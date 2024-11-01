package com.framecheckmate.cardservice.domain.frame.service;

import com.framecheckmate.cardservice.config.FFmpegConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileService {

    private final FFmpegConfig ffmpegConfig;

    public void moveOriginalFrame(String fileName) throws IOException {
        Path downloadPath = Paths.get(System.getProperty("user.home"), "Downloads", fileName);
        File file = new File(downloadPath.toString());
        if (!file.exists()) throw new IOException("File not found in downloads: " + fileName);

        Path targetPath = ffmpegConfig.getInputPath().resolve(fileName);
        Files.createDirectories(ffmpegConfig.getInputPath());
        Files.copy(downloadPath, targetPath);
        Files.delete(downloadPath);

        System.out.println("File moved successfully to: " + targetPath);
    }
}
