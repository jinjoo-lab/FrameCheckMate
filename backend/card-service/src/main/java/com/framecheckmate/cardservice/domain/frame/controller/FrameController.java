package com.framecheckmate.cardservice.domain.frame.controller;

import com.framecheckmate.cardservice.domain.frame.dto.response.FrameUploadResponseDTO;
import com.framecheckmate.cardservice.domain.frame.service.FrameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/frame")
public class FrameController {

    private final FrameService frameService;

    @PostMapping("/upload")
    public ResponseEntity<FrameUploadResponseDTO> uploadFrame(@RequestBody MultipartFile file) {
        try {
            FrameUploadResponseDTO response = frameService.saveFile(file);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new FrameUploadResponseDTO(null, "파일 업로드 실패: " + e.getMessage()));
        }
    }
}
