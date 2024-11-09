package com.framecheckmate.cardservice.domain.card.entity;

import com.framecheckmate.cardservice.domain.card.type.CardStatus;
import com.framecheckmate.cardservice.domain.card.type.ConfirmDetail;
import lombok.*;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.UUID;
import java.util.List;
import java.time.LocalDateTime;

@Document(collection = "cards")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class Card {
    @Id
    private UUID cardId;
    private UUID workerId;
    private String workerEmail;
    private UUID projectId;
    private UUID frameId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String description;
    private List<ConfirmDetail> confirms;
    private CardStatus status;
    private Long order;
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    @LastModifiedDate
    private LocalDateTime updatedAt;

    public void addConfirm(String content) {
        if (confirms == null) { confirms = new ArrayList<>(); }
        confirms.add(new ConfirmDetail(content));
    }
}
