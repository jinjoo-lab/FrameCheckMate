package com.framecheckmate.cardservice.domain.card.dto.response;

import com.framecheckmate.cardservice.domain.card.type.ConfirmDetail;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Builder
public class CardLogResponse {
    private UUID cardId;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private List<String> frames;
    private List<ConfirmDetail> confirms;
}
