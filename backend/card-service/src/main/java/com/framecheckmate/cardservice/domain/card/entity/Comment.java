package com.framecheckmate.cardservice.domain.card.entity;

import com.framecheckmate.cardservice.domain.card.type.CommentDetail;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Document(collection = "comments")
@Getter
@NoArgsConstructor
public class Comment {
    @Id
    private UUID commentId;
    private UUID cardId;
    private List<CommentDetail> comments;

    public Comment(UUID cardId) {
        this.commentId = UUID.randomUUID();
        this.cardId = cardId;
        this.comments = new ArrayList<>();
    }

    public void addComment(UUID userId, String content) {
        comments.add(new CommentDetail(userId, content));
    }
}
