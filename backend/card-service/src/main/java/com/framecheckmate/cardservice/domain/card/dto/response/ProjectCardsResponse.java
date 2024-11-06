package com.framecheckmate.cardservice.domain.card.dto.response;


import com.framecheckmate.cardservice.domain.card.entity.Card;
import com.framecheckmate.cardservice.domain.card.type.CardStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
@AllArgsConstructor
public class ProjectCardsResponse {
    private Map<CardStatus, List<Card>> cardsByStatus;
    private boolean isProjectCompleted;
}