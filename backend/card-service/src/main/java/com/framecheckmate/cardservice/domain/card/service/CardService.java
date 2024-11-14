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
import com.framecheckmate.cardservice.domain.card.type.ConfirmDetail;
import com.framecheckmate.cardservice.domain.card.type.FrameConfirmMatch;
import com.framecheckmate.cardservice.domain.frame.service.FrameService;
import com.framecheckmate.cardservice.domain.frame.type.FrameType;
import com.framecheckmate.cardservice.domain.kafka.KafkaProducer;
import com.framecheckmate.cardservice.domain.kafka.dto.NotificationSaveRequest;
import com.framecheckmate.cardservice.domain.kafka.dto.NotificationType;
import com.framecheckmate.cardservice.domain.kafka.mapper.KafkaDtoMapper;
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
    private final KafkaProducer kafkaProducer;
    private final KafkaDtoMapper kafkaDtoMapper;
    private final String TOPIC = "card-notification-topic";

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

    private Card findCardById(UUID cardId) {
        return Optional.ofNullable(cardRepository.findByCardId(cardId))
                .orElseThrow(() -> new EntityNotFoundException("Card not found with id: " + cardId));
    }

    public CardLogResponse getCardLogs(UUID cardId) {
        Card card = findCardById(cardId);
        List<String> frameLogs = frameService.getFrameUrlStrings(cardId);
        return CardLogResponse.builder()
                .cardId(cardId)
                .description(card.getDescription())
                .startDate(card.getStartDate())
                .endDate(card.getEndDate())
                .originFrame(extractOrigin(frameLogs))
                .frameConfirmPairs(createFrameConfirmMatches(
                        getRemainingFrameLogs(frameLogs),
                        card.getConfirms()))
                .build();
    }

    private String extractOrigin(List<String> frameLogs) {
        return frameLogs.isEmpty() ? null : frameLogs.get(0);
    }

    private List<String> getRemainingFrameLogs(List<String> frameLogs) {
        return frameLogs.size() > 1 ?
                frameLogs.subList(1, frameLogs.size()) :
                new ArrayList<>();
    }

    private List<FrameConfirmMatch> createFrameConfirmMatches(
            List<String> remainingFrameLogs,
            List<ConfirmDetail> confirms) {
        List<FrameConfirmMatch> matches = new ArrayList<>();
        List<String> frameLogs = (remainingFrameLogs != null) ? remainingFrameLogs : Collections.emptyList();
        List<ConfirmDetail> confirmDetails = (confirms != null) ? confirms : Collections.emptyList();

        int maxSize = Math.max(frameLogs.size(), confirmDetails.size());
        for (int i = 0; i < maxSize; i++) {
            matches.add(FrameConfirmMatch.builder()
                    .frame(getElementOrNull(frameLogs, i))
                    .confirm(getElementOrNull(confirmDetails, i))
                    .build());
        }
        return matches;
    }

    private <T> T getElementOrNull(List<T> list, int index) {
        return index < list.size() ? list.get(index) : null;
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

    @Transactional
    public Card assignCardWork(UUID cardId, AssignCardWorkRequest assignCardWorkRequest) {
        Card existingCard = findCardById(cardId);
        Card updateCard = existingCard.toBuilder()
                .workerId(assignCardWorkRequest.getWorkerId())
                .workerEmail(assignCardWorkRequest.getWorkerEmail())
                .startDate(assignCardWorkRequest.getStartDate())
                .endDate(assignCardWorkRequest.getEndDate())
                .description(assignCardWorkRequest.getDescription())
                .build();

        Card card = cardRepository.save(updateCard);

        kafkaProducer.send(TOPIC,
                kafkaDtoMapper.toNotificationDto(new NotificationSaveRequest(
                        card.getWorkerEmail(),
                        NotificationType.ALLOCATION
                ))
        );

        return card;
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
        Card card = cardRepository.findByCardId(cardId);

        if(card.getStatus().equals(CardStatus.PENDING_CONFIRMATION)) {
            kafkaProducer.send(TOPIC,
                    kafkaDtoMapper.toNotificationDto(new NotificationSaveRequest(
                            card.getWorkerEmail(),
                            NotificationType.PENDING_CONFIRMATION_REJECTED
                    ))
            );
        }

        return moveCardToStatus(cardId, CardStatus.IN_PROGRESS);
    }

    @Transactional
    public Card moveToConfirm(UUID cardId) {
        Card card = moveCardToStatus(cardId, CardStatus.PENDING_CONFIRMATION);

        kafkaProducer.send(TOPIC,
                kafkaDtoMapper.toNotificationDto(new NotificationSaveRequest(
                        card.getWorkerEmail(),
                        NotificationType.PENDING_CONFIRMATION
                ))
        );

        return card;
    }

    @Transactional
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
