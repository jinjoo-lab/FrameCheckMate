package com.framecheckmate.cardservice.domain.card.type;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ConfirmDetail {
    private String content;
    private LocalDateTime createdAt;

    @Builder
    private ConfirmDetail(String content) {
        this.content = content;
        this.createdAt = LocalDateTime.now();
    }
}