package com.framecheckmate.cardservice.domain.card.entity;

import com.framecheckmate.cardservice.domain.card.type.CommentDetail;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Document(collection = "comments")
@Getter
@NoArgsConstructor
public class Comment {
    @Id
    private UUID commentKey;
    private UUID cardId;
    private List<CommentDetail> comments = new ArrayList<>();
    @CreatedDate
    private LocalDateTime createdAt;
}
