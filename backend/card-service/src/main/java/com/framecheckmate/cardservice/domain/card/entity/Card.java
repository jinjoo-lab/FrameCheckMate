package com.framecheckmate.cardservice.domain.card.entity;

import com.framecheckmate.cardservice.domain.card.type.CardStatus;
import com.framecheckmate.cardservice.domain.card.type.Media;
import com.framecheckmate.cardservice.domain.card.type.ConfirmDetail;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.UUID;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "cards")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Card {
    @Id
    private UUID cardKey;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private UUID workerId;
    private String description;
    private List<Media> medias = new ArrayList<>();
    private List<ConfirmDetail> confirms = new ArrayList<>();
    private CardStatus status;
    private Long order;
    private String projectId;
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
