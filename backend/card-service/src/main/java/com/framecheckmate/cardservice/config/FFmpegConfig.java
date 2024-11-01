package com.framecheckmate.cardservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class FFmpegConfig {
    @Value("${ffmpeg.path}")
    private String ffmpegPath;

    @Value("${frame.input.path}")
    private String inputPath;

    @Value("${frame.output.path}")
    private String outputPath;

    public Path getFFmpegPath() {
        return Paths.get(ffmpegPath).toAbsolutePath();  // 절대 경로로 변환
    }

    public Path getInputPath() {
        return Paths.get(inputPath).toAbsolutePath();
    }

    public Path getOutputPath() {
        return Paths.get(outputPath).toAbsolutePath();
    }
}
