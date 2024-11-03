package com.framecheckmate.cardservice.domain.card.type;

import lombok.*;

import java.time.LocalDateTime;

@Getter
public class ConfirmDetail {
    private String content;
    private LocalDateTime createdAt;

    @Builder
    public ConfirmDetail(String content) {
        this.content = content;
        this.createdAt = LocalDateTime.now();
    }
}