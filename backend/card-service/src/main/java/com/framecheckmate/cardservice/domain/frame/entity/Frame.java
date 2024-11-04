package com.framecheckmate.cardservice.domain.frame.entity;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Document(collection = "frame")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Frame {
    @Id
    private UUID frameId;
    private UUID projectId;
    Long sequence;
    List<FrameLog> logs;

    public String getLastLogFrameName() {
        return logs.stream()
                .max(Comparator.comparing(FrameLog::getLogSequence))
                .map(FrameLog::getFrameName)
                .orElse(null);
    }

    public void addLog(Long logSequence, String fileName) {
        this.logs.add(new FrameLog(logSequence, fileName));
    }
}
