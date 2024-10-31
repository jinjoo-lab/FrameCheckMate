package com.framecheckmate.cardservice.domain.frame.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.framecheckmate.cardservice.domain.card.entity.Card;
import com.framecheckmate.cardservice.domain.frame.entity.Frame;
import com.framecheckmate.cardservice.domain.frame.repository.CardRepository;
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
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FrameService {
    private final AmazonS3 amazonS3;
    private final CardRepository cardRepository;
    private final FrameRepository frameRepository;

    @Value("${cloud.aws.s3.bucketName}")
    private String bucket;

    public FrameUploadResponseDTO uploadFrame(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        amazonS3.putObject(bucket, fileName, file.getInputStream(), metadata);
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
}
