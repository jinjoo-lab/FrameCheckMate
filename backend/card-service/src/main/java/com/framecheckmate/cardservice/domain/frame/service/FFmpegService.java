package com.framecheckmate.cardservice.domain.frame.service;

import com.framecheckmate.cardservice.config.FFmpegConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FFmpegService {
    private final FFmpegConfig ffmpegConfig;
    private final S3Service s3Service;

    private String[] buildSplitFFmpegCommand(String fileName, String startTime, String endTime, Long seq) {
        double startSeconds = Long.parseLong(startTime);
        double duration = (Long.parseLong(endTime) - Long.parseLong(startTime));

        return new String[]{
                ffmpegConfig.getFFmpegPath().toString(),
                "-i", ffmpegConfig.getInputPath() + File.separator + fileName,
                "-ss", String.valueOf(startSeconds),
                "-t", String.valueOf(duration),
                "-c:v", "libx264",
                "-crf", "18",
                ffmpegConfig.getOutputPath() + File.separator + seq + "_" + fileName
        };
    }

    private String[] reencodeFFmpegCommand(String inputFilePath, String outputFilePath) {
        return new String[]{
                ffmpegConfig.getFFmpegPath().toString(),
                "-i", inputFilePath,
                "-c:v", "libx264",
                "-preset", "fast",
                "-crf", "23",
                "-r", "30",
                outputFilePath
        };
    }

    private String[] buildMergeFFmpegCommand(File fileList, String outputFilePath) {
        return new String[]{
                ffmpegConfig.getFFmpegPath().toString(),
                "-f", "concat",
                "-safe", "0",
                "-fflags", "+genpts",
                "-i", fileList.getAbsolutePath(),
                "-c:v", "libx264",
                "-preset", "fast",
                "-force_key_frames", "expr:gte(t,n_forced*0.5)",
                outputFilePath,
                "-r", "30"
        };
    }

    private void runFFmpegCommand(String[] command, String errorMessage) throws IOException, InterruptedException {
        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        }

        if (process.waitFor() != 0) {
            throw new RuntimeException(errorMessage);
        }
    }

    public String mergeFrame(UUID projectId, List<String> frameFiles) throws IOException, InterruptedException {
        downloadFrames(frameFiles);

        File tempListFile = createFFmpegConcatFile(frameFiles);
        String mergedFileName = "merged_" + projectId + ".mp4";
        String outputFilePath = ffmpegConfig.getOutputPath() + File.separator + mergedFileName;
        executeMergeProcess(tempListFile, outputFilePath);
        s3Service.uploadToS3(outputFilePath, mergedFileName, -1L);

        return mergedFileName;
    }

    public File createFFmpegConcatFile(List<String> frameFiles) throws IOException {
        File tempListFile = new File(ffmpegConfig.getOutputPath() + File.separator + "file_list.txt");
        try (FileWriter writer = new FileWriter(tempListFile)) {
            for (int i = 1; i < frameFiles.size(); i++) {
                writer.write("file '" + ffmpegConfig.getInputPath() + File.separator + frameFiles.get(i) + "'\n");
            }
        }
        return tempListFile;
    }

    public void executeMergeProcess(File fileList, String outputFilePath) throws IOException, InterruptedException {
        String[] command = buildMergeFFmpegCommand(fileList, outputFilePath);
        runFFmpegCommand(command, "Failed to merge video.");
    }

    public String splitFrame(String fileName, String startTime, String endTime, Long seq) throws IOException, InterruptedException {
        String[] command = buildSplitFFmpegCommand(fileName, startTime, endTime, seq);
        runFFmpegCommand(command, "Failed to trim video.");
        return ffmpegConfig.getOutputPath() + File.separator + seq + "_" + fileName;
    }

    public void downloadFrames(List<String> frameFiles) throws IOException, InterruptedException {
        for (int i = 1; i < frameFiles.size(); i++) {
            s3Service.downloadFileFromS3(frameFiles.get(i));
            frameFiles.set(i, reencodeFrame(frameFiles.get(i)));
        }
    }

    public String reencodeFrame(String fileName) throws IOException, InterruptedException {
        String inputFilePath = ffmpegConfig.getInputPath() + File.separator + fileName;
        String outputFileName = "reencoded_" + fileName;
        String outputFilePath = ffmpegConfig.getInputPath() + File.separator + outputFileName;

        String[] command =reencodeFFmpegCommand(inputFilePath, outputFilePath);
        runFFmpegCommand(command, "Failed to reencode video: " + fileName);

        return outputFileName;
    }
}
