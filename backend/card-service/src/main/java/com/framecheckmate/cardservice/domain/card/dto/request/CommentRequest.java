package com.framecheckmate.cardservice.domain.card.dto.request;

import lombok.Getter;

import java.util.UUID;

@Getter
public class CommentRequest {
    private UUID userId;
    private String content;
}