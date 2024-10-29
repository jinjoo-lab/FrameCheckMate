package com.framecheckmate.cardservice.domain.card.type;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@NoArgsConstructor
public class CommentDetail {
    private String content;      // chat 내용
    private UUID userId;         // user 정보
    private LocalDateTime createdAt;  // 생성 시간

    @Builder
    private CommentDetail(String content, UUID userId) {
        this.content = content;
        this.userId = userId;
        this.createdAt = LocalDateTime.now();
    }
}