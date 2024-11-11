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

    public void createDir() throws IOException {
        Files.createDirectories(ffmpegConfig.getInputPath());
        Files.createDirectories(ffmpegConfig.getOutputPath());
    }

    public void deleteDir() throws IOException {
        Files.walk(ffmpegConfig.getInputPath())
                .sorted((path1, path2) -> path2.compareTo(path1))
                .forEach(path -> {
                    try {
                        Files.delete(path);
                    } catch (IOException e) {
                        throw new RuntimeException("Failed to delete " + path, e);
                    }
                });

        Files.walk(ffmpegConfig.getOutputPath())
                .sorted((path1, path2) -> path2.compareTo(path1))
                .forEach(path -> {
                    try {
                        Files.delete(path);
                    } catch (IOException e) {
                        throw new RuntimeException("Failed to delete " + path, e);
                    }
                });
    }
}
