package com.framecheckmate.cardservice.domain.card.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AssignCardWorkRequest {

    private UUID workerId;

    private String workerEmail;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private LocalDateTime startDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private LocalDateTime endDate;

    private String description;
}
