package com.framecheckmate.cardservice.domain.frame.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.framecheckmate.cardservice.domain.card.entity.Card;
import com.framecheckmate.cardservice.domain.card.type.CardStatus;
import com.framecheckmate.cardservice.domain.frame.dto.request.FrameSplitRequestDTO;
import com.framecheckmate.cardservice.domain.frame.entity.Frame;
import com.framecheckmate.cardservice.domain.card.repository.CardRepository;
import com.framecheckmate.cardservice.domain.frame.entity.FrameLog;
import com.framecheckmate.cardservice.domain.frame.repository.FrameRepository;
import com.framecheckmate.cardservice.domain.frame.type.FrameType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import com.framecheckmate.cardservice.domain.frame.dto.response.FrameUploadResponseDTO;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.*;
import java.net.MalformedURLException;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FrameService {
    private final AmazonS3 amazonS3;
    private final CardRepository cardRepository;
    private final FrameRepository frameRepository;
    private final FileService fileService;
    private final S3Service s3Service;
    private final FFmpegService ffmpegService;

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
        mergedFrame.addLog(mergedFrame.getLogs().size() + 1L, "-1_" + fileName);
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

    private List<FrameLog> getCardFrameLogs(UUID cardId) {
        return Optional.ofNullable(cardRepository.findByCardId(cardId))
                .map(Card::getFrameId)
                .map(frameRepository::findByFrameId)
                .map(Frame::getLogs)
                .orElse(Collections.emptyList());
    }

    public List<String> getFrameUrlStrings(UUID cardId) {
        List<FrameLog> frameLogs = getCardFrameLogs(cardId);
        return frameLogs.stream()
                .map(FrameLog::getFrameName)
                .collect(Collectors.toList());
    }

    public String splitFrame(FrameSplitRequestDTO requestDTO) throws IOException, InterruptedException {
        UUID projectId = requestDTO.getProjectId();
        List<FrameSplitRequestDTO.Segment> segments = requestDTO.getSegments();

        fileService.createDir();
        String fileName = getOriginalFrameName(projectId);
        s3Service.downloadFileFromS3(fileName);

        for (int i = 0; i < segments.size(); i++) {
            FrameSplitRequestDTO.Segment segment = segments.get(i);
            String splitFileName = processSegment(fileName, segment, i + 1L);
            UUID frameId = createFrame(projectId, splitFileName, i + 1L);
            createCard(projectId, frameId, i + 1L, segment.getDetect());
        }

        fileService.deleteDir();
        return "Frame split operation completed for project ID: " + projectId;
    }

    private String processSegment(String fileName, FrameSplitRequestDTO.Segment segment, Long seq) throws IOException, InterruptedException {
        String outputFilePath = ffmpegService.splitFrame(fileName, segment.getStart(), segment.getEnd(), seq);
        return s3Service.uploadToS3(outputFilePath, fileName, seq);
    }

    private UUID createFrame(UUID projectId, String fileName, Long seq) {
        UUID frameId = UUID.randomUUID();
        Frame frame = Frame.builder()
                .frameId(frameId)
                .projectId(projectId)
                .sequence(seq)
                .logs(new ArrayList<>())
                .build();
        frame.addLog(1L, fileName);
        frameRepository.save(frame);
        return frameId;
    }

    private UUID createCard(UUID projectId, UUID frameId, Long order, Boolean detect) {
        UUID cardId = UUID.randomUUID();
        Card card = Card.builder()
                .cardId(cardId)
                .frameId(frameId)
                .projectId(projectId)
                .order(order)
                .status(detect ? CardStatus.TODO : CardStatus.PENDING_CONFIRMATION)
                .build();
        cardRepository.save(card);
        return cardId;
    }

    public String mergeFrame(UUID projectId) throws IOException, InterruptedException {
        List<Frame> frames = frameRepository.findByProjectId(projectId);
        fileService.createDir();

        List<String> frameFiles = frames.stream()
                .sorted(Comparator.comparingLong(Frame::getSequence))
                .map(Frame::getLastLogFrameName)
                .collect(Collectors.toList());

        String mergedFileName = ffmpegService.mergeFrame(projectId, frameFiles);
        uploadMergedFrame(projectId, mergedFileName);
        fileService.deleteDir();
        return "Frame merge operation completed for project ID: " + projectId;
    }
}
