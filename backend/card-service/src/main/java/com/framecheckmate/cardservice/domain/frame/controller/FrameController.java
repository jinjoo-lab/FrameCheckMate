package com.framecheckmate.cardservice.domain.frame.controller;

import com.framecheckmate.cardservice.domain.frame.dto.request.FrameSplitRequestDTO;
import com.framecheckmate.cardservice.domain.frame.dto.response.FrameUploadResponseDTO;
import com.framecheckmate.cardservice.domain.frame.service.FrameService;
import com.framecheckmate.cardservice.domain.frame.type.FrameType;
import org.springframework.core.io.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/frame")
public class FrameController {

    private final FrameService frameService;

    @PostMapping("/card/{cardId}")
    public ResponseEntity<FrameUploadResponseDTO> uploadCardFrame(@PathVariable UUID cardId, @RequestBody MultipartFile file) throws IOException {
        return ResponseEntity.ok(frameService.uploadFrame(cardId, FrameType.CARD, file));
    }

    @PostMapping("/original/{projectId}")
    public ResponseEntity<FrameUploadResponseDTO> uploadOriginalFrame(@PathVariable UUID projectId, @RequestBody MultipartFile file) throws IOException {
        return ResponseEntity.ok(frameService.uploadFrame(projectId, FrameType.ORIGINAL, file));
    }

    @GetMapping("/card/{cardId}")
    public ResponseEntity<String> viewCardFrame(@PathVariable UUID cardId) throws IOException {
        return ResponseEntity.ok(frameService.getFrameResource(cardId, FrameType.CARD).getURL().toString());
    }

    @GetMapping("/original/{projectId}")
    public ResponseEntity<String> viewOriginalFrame(@PathVariable UUID projectId) throws IOException {
        return ResponseEntity.ok(frameService.getFrameResource(projectId, FrameType.ORIGINAL).getURL().toString());
    }

    @GetMapping("/merged/{projectId}")
    public ResponseEntity<String> viewMergedFrame(@PathVariable UUID projectId) throws IOException {
        return ResponseEntity.ok(frameService.getFrameResource(projectId, FrameType.MERGED).getURL().toString());
    }

    @GetMapping("/card/{cardId}/download")
    public ResponseEntity<Resource> downloadCardFrame(@PathVariable UUID cardId) throws IOException {
        Resource resource = frameService.getFrameResource(cardId, FrameType.CARD);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/original/{projectId}/download")
    public ResponseEntity<Resource> downloadOriginalFrame(@PathVariable UUID projectId) throws IOException {
        Resource resource = frameService.getFrameResource(projectId, FrameType.ORIGINAL);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/merged/{projectId}/download")
    public ResponseEntity<Resource> downloadMergedFrame(@PathVariable UUID projectId) throws IOException {
        Resource resource = frameService.getFrameResource(projectId, FrameType.MERGED);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @PostMapping("/split")
    public ResponseEntity<String> splitFrame(@RequestBody FrameSplitRequestDTO requestDTO) throws IOException, InterruptedException {
        return ResponseEntity.ok(frameService.splitFrame(requestDTO));
    }

    @PostMapping("/merge/{projectId}")
    public ResponseEntity<String> mergeFrame(@PathVariable UUID projectId) throws IOException, InterruptedException {
        return ResponseEntity.ok(frameService.mergeFrame(projectId));
    }
}
