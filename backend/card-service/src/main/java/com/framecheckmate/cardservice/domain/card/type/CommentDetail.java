package com.framecheckmate.cardservice.domain.card.type;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
public class CommentDetail {
    private UUID userId;
    private String content;
    private LocalDateTime createdAt;

    @Builder
    public CommentDetail(UUID userId, String content) {
        this.userId = userId;
        this.content = content;
        this.createdAt = LocalDateTime.now();
    }
}