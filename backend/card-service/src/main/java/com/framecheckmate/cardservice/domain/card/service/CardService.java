package com.framecheckmate.cardservice.domain.card.service;


import com.framecheckmate.cardservice.domain.card.dto.request.AssignCardWorkRequest;
import com.framecheckmate.cardservice.domain.card.dto.request.CommentRequest;
import com.framecheckmate.cardservice.domain.card.dto.request.ConfirmRequest;
import com.framecheckmate.cardservice.domain.card.dto.request.CreateCardRequest;
import com.framecheckmate.cardservice.domain.card.dto.response.CardCompletionResponse;
import com.framecheckmate.cardservice.domain.card.dto.response.CardLogResponse;
import com.framecheckmate.cardservice.domain.card.dto.response.CardResponse;
import com.framecheckmate.cardservice.domain.card.dto.response.ProjectCardsResponse;
import com.framecheckmate.cardservice.domain.card.entity.Card;
import com.framecheckmate.cardservice.domain.card.entity.Comment;
import com.framecheckmate.cardservice.domain.card.repository.CardRepository;
import com.framecheckmate.cardservice.domain.card.repository.CommentRepository;
import com.framecheckmate.cardservice.domain.card.type.CardStatus;
import com.framecheckmate.cardservice.domain.card.type.CommentDetail;
import com.framecheckmate.cardservice.domain.frame.service.FrameService;
import com.framecheckmate.cardservice.domain.frame.type.FrameType;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private final CommentRepository commentRepository;
    private final FrameService frameService;

    public CardResponse getCard(UUID cardId) throws IOException {
        Card card = findCardById(cardId);
        String frameInfo = frameService.getFrameResource(cardId, FrameType.CARD).getURL().toString();
        List<CommentDetail> comments = getComments(cardId);
        return CardResponse.builder()
                .cardId(cardId)
                .description(card.getDescription())
                .startDate(card.getStartDate())
                .endDate(card.getEndDate())
                .frameInfo(frameInfo)
                .confirms(card.getConfirms())
                .comments(comments)
                .build();
    }

    public CardLogResponse getCardLogs(UUID cardId) {
        Card card = findCardById(cardId);
        List<String> frameLogs = frameService.getFrameUrlStrings(cardId);
        return CardLogResponse.builder()
                .cardId(cardId)
                .description(card.getDescription())
                .startDate(card.getStartDate())
                .endDate(card.getEndDate())
                .frames(frameLogs)
                .confirms(card.getConfirms())
                .build();
    }

    private Card findCardById(UUID cardId) {
        return Optional.ofNullable(cardRepository.findByCardId(cardId))
                .orElseThrow(() -> new EntityNotFoundException("Card not found with id: " + cardId));
    }

    public ProjectCardsResponse getAllCardsWithCompletionStatus(UUID projectId) {
        Map<CardStatus, List<Card>> cardsByStatus = getAllCardsGroupedByStatus(projectId);
        boolean isCompleted = isProjectCompleted(projectId);

        return new ProjectCardsResponse(cardsByStatus, isCompleted);
    }

    private Map<CardStatus, List<Card>> getAllCardsGroupedByStatus(UUID projectId) {
        List<Card> cards = cardRepository.findByProjectId(projectId);
        return cards.stream()
                .collect(Collectors.groupingBy(Card::getStatus,
                        Collectors.collectingAndThen(Collectors.toList(), list -> {
                            list.sort(Comparator.comparingLong(Card::getOrder));
                            return list;
                        })));
    }

    private boolean isProjectCompleted(UUID projectId) {
        long totalCards = cardRepository.countByProjectId(projectId).orElse(0L);
        long completedCards = cardRepository.countByProjectIdAndStatus(projectId, CardStatus.COMPLETED).orElse(0L);
        return totalCards > 0 && totalCards == completedCards;
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

    public CardCompletionResponse moveToCompletion(UUID cardId) {
        Card card = moveCardToStatus(cardId, CardStatus.COMPLETED);
        boolean isProjectCompleted = isProjectCompleted(card.getProjectId());
        return new CardCompletionResponse(card, isProjectCompleted);
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

    public List<CommentDetail> getComments(UUID cardId) {
        return commentRepository.findByCardId(cardId)
                .map(Comment::getComments)
                .orElse(Collections.emptyList());
    }
}
