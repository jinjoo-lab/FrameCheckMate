package com.framecheckmate.cardservice.domain.frame.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.util.IOUtils;
import com.framecheckmate.cardservice.config.FFmpegConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {
    private final FFmpegConfig ffmpegConfig;
    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucketName}")
    private String bucket;

    public void downloadFileFromS3(String fileName) throws IOException {
        S3Object s3Object = amazonS3.getObject(bucket, fileName);
        File downloadedFile = new File(fileName);
        try (FileOutputStream fos = new FileOutputStream(ffmpegConfig.getInputPath() + File.separator +downloadedFile)) {
            IOUtils.copy(s3Object.getObjectContent(), fos);
        }
    }

    public String uploadToS3(String filePath, String fileName, Long seq) throws IOException {
        File file = new File(filePath);
        String s3FileName = seq + "_" + fileName;

        try (FileInputStream fileInputStream = new FileInputStream(file)) {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.length());
            metadata.setContentType("video/mp4");

            amazonS3.putObject(bucket, s3FileName, fileInputStream, metadata);
        }
        return s3FileName;
    }
}
