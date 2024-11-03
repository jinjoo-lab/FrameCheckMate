package com.framecheckmate.cardservice.domain.card.repository;

import com.framecheckmate.cardservice.domain.card.entity.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;
import java.util.UUID;

public interface CommentRepository extends MongoRepository<Comment, UUID> {
    Optional<Comment> findByCardId(UUID cardId);
}
