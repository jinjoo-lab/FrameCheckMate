package com.framecheckmate.cardservice.domain.frame.service;

import com.framecheckmate.cardservice.config.FFmpegConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

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

    public void moveFileToInputDir(File file) throws IOException {
        File targetFile = new File(ffmpegConfig.getInputPath() + file.getName());
        Files.move(file.toPath(), targetFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
    }
}
