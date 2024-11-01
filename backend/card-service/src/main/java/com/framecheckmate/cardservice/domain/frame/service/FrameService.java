package com.framecheckmate.cardservice.domain.frame.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.framecheckmate.cardservice.config.FFmpegConfig;
import com.framecheckmate.cardservice.domain.card.entity.Card;
import com.framecheckmate.cardservice.domain.card.type.CardStatus;
import com.framecheckmate.cardservice.domain.frame.dto.request.FrameSplitRequestDTO;
import com.framecheckmate.cardservice.domain.frame.entity.Frame;
import com.framecheckmate.cardservice.domain.card.repository.CardRepository;
import com.framecheckmate.cardservice.domain.frame.repository.FrameRepository;
import com.framecheckmate.cardservice.domain.frame.type.FrameType;
import org.springframework.core.io.Resource;
import com.framecheckmate.cardservice.domain.frame.dto.response.FrameUploadResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FrameService {
    private final AmazonS3 amazonS3;
    private final CardRepository cardRepository;
    private final FrameRepository frameRepository;
    private final FileService fileService;
    private final FFmpegConfig ffmpegConfig;

    @Value("${cloud.aws.s3.bucketName}")
    private String bucket;

    private void uploadCardFrame(UUID cardId, String fileName) {
        Optional.ofNullable(cardRepository.findByCardId(cardId))
                .map(Card::getFrameId)
                .map(frameRepository::findByFrameId)
                .ifPresent(frame -> {
                    frame.addLog(frame.getLogs().size() + 1L, fileName);
                    frameRepository.save(frame);
                });
    }

    private void uploadOriginalFrame(UUID projectId, String fileName) {
        Frame originalFrame = Frame.builder()
                .frameId(UUID.randomUUID())
                .projectId(projectId)
                .sequence(-1L)
                .logs(new ArrayList<>())
                .build();
        originalFrame.addLog(originalFrame.getLogs().size() + 1L, fileName);
        frameRepository.save(originalFrame);
    }

    private void uploadMergedFrame(UUID projectId, String fileName) {
        Frame mergedFrame = frameRepository.findByProjectIdAndSequence(projectId, -1);
        mergedFrame.addLog(mergedFrame.getLogs().size() + 1L, fileName);
        frameRepository.save(mergedFrame);
    }

    public FrameUploadResponseDTO uploadFrame(UUID id, FrameType type, MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        amazonS3.putObject(bucket, fileName, file.getInputStream(), metadata);

        switch (type) {
            case CARD:
                uploadCardFrame(id, fileName);
                break;
            case ORIGINAL:
                uploadOriginalFrame(id, fileName);
                break;
            case MERGED:
                uploadMergedFrame(id, fileName);
                break;
            default:
                throw new IllegalArgumentException("Invalid FrameType: " + type);
        }
        return new FrameUploadResponseDTO(amazonS3.getUrl(bucket, fileName).toString(), fileName);
    }

    private String getLatestCardFrameName(UUID cardId) {
        return Optional.ofNullable(cardRepository.findByCardId(cardId))
                .map(Card::getFrameId)
                .map(frameRepository::findByFrameId)
                .map(Frame::getLastLogFrameName)
                .orElse(null);
    }

    private String getOriginalFrameName(UUID projectId) {
        Frame frame = frameRepository.findByProjectIdAndSequence(projectId, -1);
        return frame.getLogs().get(0).getFrameName();
    }

    private String getMergedFrameName(UUID projectId) {
        Frame frame = frameRepository.findByProjectIdAndSequence(projectId, -1);
        if (frame.getLogs().size() == 1) {
            throw new RuntimeException("Merged frame has not been created yet.");
        }
        return frame.getLastLogFrameName();
    }

    public Resource getFrameResource(UUID id, FrameType type) throws MalformedURLException {
        String fileName;
        switch (type) {
            case CARD:
                fileName = getLatestCardFrameName(id);
                break;
            case ORIGINAL:
                fileName = getOriginalFrameName(id);
                break;
            case MERGED:
                fileName = getMergedFrameName(id);
                break;
            default:
                throw new IllegalArgumentException("Invalid FrameType: " + type);
        }
        return new UrlResource(amazonS3.getUrl(bucket, fileName).toString());
    }

    public String splitFrame(FrameSplitRequestDTO requestDTO) throws IOException, InterruptedException {
        UUID projectId = requestDTO.getProjectId();
        List<FrameSplitRequestDTO.Segment> segments = requestDTO.getSegments();

        String fileName = getFrameResource(projectId, FrameType.ORIGINAL).getFilename();
        fileService.moveOriginalFrame(fileName);

        for (int i = 0; i < segments.size(); i++) {
            FrameSplitRequestDTO.Segment segment = segments.get(i);
            String splitFileName = processSegment(fileName, segment, i + 1L);
            UUID frameId = createFrame(projectId, splitFileName, i + 1L);
            createCard(frameId, segment.getDetect());
        }
        return "Frame split operation completed for project ID: " + projectId;
    }

    private String processSegment(String fileName, FrameSplitRequestDTO.Segment segment, Long seq) throws IOException, InterruptedException {
        String outputFilePath = splitFrameSegment(fileName, segment.getStart(), segment.getEnd(), seq);
        return uploadToS3(outputFilePath, fileName, seq);
    }

    public String splitFrameSegment(String fileName, String startTime, String endTime, Long seq) throws IOException, InterruptedException {
        String[] command = buildFFmpegCommand(fileName, startTime, endTime, seq);

        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();
        if (process.waitFor() != 0) {
            throw new RuntimeException("Failed to trim video.");
        }
        return ffmpegConfig.getOutputPath() + fileName + "_" + seq;
    }

    private String[] buildFFmpegCommand(String fileName, String startTime, String endTime, Long seq) {
        return new String[]{
                ffmpegConfig.getFFmpegPath().toString(),
                "-i", ffmpegConfig.getInputPath() + fileName,
                "-ss", startTime,
                "-to", endTime,
                "-c", "copy",
                ffmpegConfig.getOutputPath() + fileName + "_" + seq
        };
    }

    private String uploadToS3(String filePath, String fileName, Long seq) throws IOException {
        File file = new File(filePath);
        String s3FileName = fileName + "_" + seq;

        try (FileInputStream fileInputStream = new FileInputStream(file)) {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.length());
            metadata.setContentType("video/mp4");

            amazonS3.putObject(bucket, s3FileName, fileInputStream, metadata);
        }
        return s3FileName;
    }

    private UUID createFrame(UUID projectId, String fileName, Long seq) {
        UUID frameId = UUID.randomUUID();
        Frame frame = Frame.builder()
                .frameId(frameId)
                .projectId(projectId)
                .sequence(seq)
                .logs(new ArrayList<>())
                .build();
        frame.addLog(seq, fileName);
        frameRepository.save(frame);
        return frameId;
    }

    private UUID createCard(UUID frameId, Boolean detect) {
        UUID cardId = UUID.randomUUID();
        Card card = Card.builder()
                .cardId(cardId)
                .frameId(frameId)
                .status(detect ? CardStatus.TODO : CardStatus.PENDING_CONFIRMATION)
                .build();
        cardRepository.save(card);
        return cardId;
    }
}
