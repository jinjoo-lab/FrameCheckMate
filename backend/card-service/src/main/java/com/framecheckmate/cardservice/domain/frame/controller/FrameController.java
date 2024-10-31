package com.framecheckmate.cardservice.domain.frame.controller;

import com.framecheckmate.cardservice.domain.frame.dto.response.FrameUploadResponseDTO;
import com.framecheckmate.cardservice.domain.frame.service.FrameService;
import org.springframework.core.io.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
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
    public ResponseEntity<FrameUploadResponseDTO> uploadFrame(@RequestBody MultipartFile file) throws IOException {
        return ResponseEntity.ok(frameService.uploadFrame(file));
    }

    @GetMapping("/download")
    // !!RequestParam: CardId로 수정 예정
    public ResponseEntity<Resource> downloadFrame(@RequestParam String fileName) throws MalformedURLException {
        Resource resource = frameService.getFrameResource(fileName);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/view")
    public ResponseEntity<String> viewFrame(@RequestParam String fileName) throws IOException {
        return ResponseEntity.ok(frameService.getFrameResource(fileName).getURL().toString());
    }
}
