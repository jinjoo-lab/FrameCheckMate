package com.framecheckmate.cardservice.domain.frame.entity;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.UUID;

@Document(collection = "frame")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Frame {
    @Id
    private UUID frameId;
    Long sequence;
    List<FrameLog> logs;
}
