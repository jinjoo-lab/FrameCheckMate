package com.framecheckmate.cardservice.domain.card.repository;

import com.framecheckmate.cardservice.domain.card.entity.Card;
import com.framecheckmate.cardservice.domain.card.type.CardStatus;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CardRepository extends MongoRepository<Card, UUID> {
    Card findByCardId(UUID cardId);
    List<Card> findByProjectId(UUID projectId);
    @Aggregation(pipeline = {
            "{ $match: { 'status': ?0 } }",
            "{ $group: { '_id': null, 'maxOrder': { $max: '$order' } } }"
    })
    Optional<Long> findMaxOrderByStatus(CardStatus status);
    @Aggregation(pipeline = {
            "{ $match: { projectId: ?0 } }",
            "{ $count: 'total' }"
    })
    Optional<Long> countByProjectId(UUID projectId);

    @Aggregation(pipeline = {
            "{ $match: { projectId: ?0, status: ?1 } }",
            "{ $count: 'total' }"
    })
    Optional<Long> countByProjectIdAndStatus(UUID projectId, CardStatus status);
}
