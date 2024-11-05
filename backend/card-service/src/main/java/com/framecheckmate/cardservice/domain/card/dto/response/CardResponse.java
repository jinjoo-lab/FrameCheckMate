package com.framecheckmate.cardservice.domain.card.dto.response;

import com.framecheckmate.cardservice.domain.card.type.CommentDetail;
import com.framecheckmate.cardservice.domain.card.type.ConfirmDetail;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

@Getter
@Builder
public class CardResponse {
    private UUID cardId;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String frameInfo;
    private List<ConfirmDetail> confirms;
    private List<CommentDetail> comments;
}
