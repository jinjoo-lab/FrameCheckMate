package com.framecheckmate.cardservice.domain.frame.dto.request;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FrameSplitRequestDTO {
    private UUID projectId;
    private String fps;
    private List<Segment> segments;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Segment {
        private String start;
        private String end;
        private Boolean detect;
    }
}
