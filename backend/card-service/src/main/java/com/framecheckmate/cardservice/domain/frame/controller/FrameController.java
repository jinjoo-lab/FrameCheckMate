package com.framecheckmate.cardservice.domain.frame.controller;

import com.framecheckmate.cardservice.domain.frame.dto.response.FrameUploadResponseDTO;
import com.framecheckmate.cardservice.domain.frame.service.FrameService;
import org.springframework.core.io.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;

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

    @GetMapping("/download")
    // !!RequestParam: CardId로 수정 예정
    public ResponseEntity<Resource> downloadFrame(@RequestParam String fileName) {
        try {
            Resource resource = frameService.loadFileAsResource(fileName);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
