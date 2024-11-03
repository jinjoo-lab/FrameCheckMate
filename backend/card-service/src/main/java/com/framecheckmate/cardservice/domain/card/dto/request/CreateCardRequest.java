package com.framecheckmate.cardservice.domain.card.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCardRequest {
    private UUID cardId;
    private UUID frameId;
    private UUID projectId;
}
