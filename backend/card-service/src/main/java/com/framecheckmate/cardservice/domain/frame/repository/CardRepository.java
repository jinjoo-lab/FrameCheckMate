package com.framecheckmate.cardservice.domain.frame.repository;

import com.framecheckmate.cardservice.domain.card.entity.Card;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CardRepository extends MongoRepository<Card, UUID> {
    Card findByCardId(UUID cardId);
}
