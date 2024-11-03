package com.framecheckmate.cardservice.domain.card.service;


import com.framecheckmate.cardservice.domain.card.dto.request.AssignCardWorkRequest;
import com.framecheckmate.cardservice.domain.card.dto.request.CreateCardRequest;
import com.framecheckmate.cardservice.domain.card.entity.Card;
import com.framecheckmate.cardservice.domain.card.repository.CardRepository;
import com.framecheckmate.cardservice.domain.card.type.CardStatus;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;


    public Card assignCardWork(UUID cardId, AssignCardWorkRequest assignCardWorkRequest) {
        Card existingCard = findCardById(cardId);

        /**
         * to-do: 입력 값 검증
         */
        // validateDateRange(request.getStartDate(), request.getEndDate());

        return cardRepository.save(buildUpdatedCard(cardId, assignCardWorkRequest, existingCard));
    }

    private Card buildUpdatedCard(UUID cardId, AssignCardWorkRequest request, Card existingCard) {
        return Card.builder()
                .cardId(cardId)
                .workerId(request.getWorkerId())
                .projectId(existingCard.getProjectId())
                .frameId(existingCard.getFrameId())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .description(request.getDescription())
                .createdAt(existingCard.getCreatedAt())
                .confirms(existingCard.getConfirms())
                .status(existingCard.getStatus())
                .build();
    }

    public Card createCard(CreateCardRequest request) {
        Card card = Card.builder()
                .cardId(request.getCardId())
                .frameId(request.getFrameId())
                .projectId(request.getProjectId())
                .createdAt(LocalDateTime.now())
                .status(CardStatus.TODO) // 초기 상태값이 필요하다면
                .confirms(new ArrayList<>()) // 빈 리스트로 초기화
                .build();

        return cardRepository.save(card);
    }

    public Card moveToToDo(UUID cardId) {
        return moveCardToStatus(cardId, CardStatus.TODO);
    }

    public Card moveToInProgress(UUID cardId) {
        return moveCardToStatus(cardId, CardStatus.IN_PROGRESS);
    }

    public Card moveToConfirm(UUID cardId) {
        return moveCardToStatus(cardId, CardStatus.PENDING_CONFIRMATION);
    }

    public Card moveToCompletion(UUID cardId) {
        return moveCardToStatus(cardId, CardStatus.COMPLETED);
    }

    @Transactional
    public Card moveCardToStatus(UUID cardId, CardStatus status) {
        Card card = findCardById(cardId);
        Long maxOrder = cardRepository.findMaxOrderByStatus(status).orElse(0L);

        card.setStatus(status);
        card.setOrder(maxOrder + 1);

        return cardRepository.save(card);
    }

    private Card findCardById(UUID cardId) {
        return Optional.ofNullable(cardRepository.findByCardId(cardId))
                .orElseThrow(() -> new EntityNotFoundException("Card not found with id: " + cardId));
    }
}
