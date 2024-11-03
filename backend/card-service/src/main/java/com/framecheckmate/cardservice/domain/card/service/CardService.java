package com.framecheckmate.cardservice.domain.card.service;


import com.framecheckmate.cardservice.domain.card.dto.request.AssignCardWorkRequest;
import com.framecheckmate.cardservice.domain.card.dto.request.CommentRequest;
import com.framecheckmate.cardservice.domain.card.dto.request.ConfirmRequest;
import com.framecheckmate.cardservice.domain.card.dto.request.CreateCardRequest;
import com.framecheckmate.cardservice.domain.card.entity.Card;
import com.framecheckmate.cardservice.domain.card.entity.Comment;
import com.framecheckmate.cardservice.domain.card.repository.CardRepository;
import com.framecheckmate.cardservice.domain.card.repository.CommentRepository;
import com.framecheckmate.cardservice.domain.card.type.CardStatus;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private final CommentRepository commentRepository;

    public Card getCardById(UUID cardId) {
        return findCardById(cardId);
    }

    private Card findCardById(UUID cardId) {
        return Optional.ofNullable(cardRepository.findByCardId(cardId))
                .orElseThrow(() -> new EntityNotFoundException("Card not found with id: " + cardId));
    }

    public Map<CardStatus, List<Card>> getAllCardsGroupedByStatus() {
        List<Card> cards = cardRepository.findAll();
        return cards.stream()
                .collect(Collectors.groupingBy(Card::getStatus,
                        Collectors.collectingAndThen(Collectors.toList(), list -> {
                            list.sort(Comparator.comparingLong(Card::getOrder));
                            return list;
                        })));
    }

    public Card assignCardWork(UUID cardId, AssignCardWorkRequest assignCardWorkRequest) {
        Card existingCard = findCardById(cardId);
        Card updateCard = existingCard.toBuilder()
                .workerId(assignCardWorkRequest.getWorkerId())
                .startDate(assignCardWorkRequest.getStartDate())
                .endDate(assignCardWorkRequest.getEndDate())
                .description(assignCardWorkRequest.getDescription())
                .build();
        return cardRepository.save(updateCard);
    }

    public Card createCard(CreateCardRequest request) {
        Card card = Card.builder()
                .cardId(request.getCardId())
                .frameId(request.getFrameId())
                .projectId(request.getProjectId())
                .createdAt(LocalDateTime.now())
                .status(CardStatus.TODO)
                .confirms(new ArrayList<>())
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

        Card updatedCard = card.toBuilder()
                .status(status)
                .order(maxOrder + 1)
                .build();

        return cardRepository.save(updatedCard);
    }

    @Transactional
    public Card addConfirm(UUID cardId, ConfirmRequest confirmRequest) {
        Card card = findCardById(cardId);
        card.addConfirm(confirmRequest.getContent());
        return cardRepository.save(card);
    }

    @Transactional
    public Comment addComment(UUID cardId, CommentRequest commentRequest) {
        Comment comment = commentRepository.findByCardId(cardId).orElse(new Comment(cardId));
        comment.addComment(commentRequest.getUserId(), commentRequest.getContent());
        return commentRepository.save(comment);
    }

    public Comment getComments(UUID cardId) {
        return commentRepository.findByCardId(cardId).orElse(null);
    }
}
