package com.framecheckmate.cardservice.domain.card.dto.response;

import com.framecheckmate.cardservice.domain.card.type.FrameConfirmMatch;
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
    private String originFrame;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private List<FrameConfirmMatch> frameConfirmPairs;
}
