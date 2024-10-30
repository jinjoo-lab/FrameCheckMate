package com.framecheckmate.cardservice.domain.frame.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FrameUploadResponseDTO {
    private String fileUrl;
    private String fileName;
}
