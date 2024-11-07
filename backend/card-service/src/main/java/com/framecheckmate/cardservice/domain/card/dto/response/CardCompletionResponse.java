package com.framecheckmate.cardservice.domain.card.dto.response;

import com.framecheckmate.cardservice.domain.card.entity.Card;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CardCompletionResponse {
    private Card card;
    private boolean isProjectCompleted;
}
