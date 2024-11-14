package com.framecheckmate.cardservice.domain.frame.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FrameLog {
    private Long logSequence;
    private String frameName;
    private LocalDateTime createdAt;

    @Builder
    public FrameLog(Long logSequence, String frameName) {
        this.logSequence = logSequence;
        this.frameName = frameName;
        this.createdAt = LocalDateTime.now();
    }
}
