package com.framecheckmate.cardservice.domain.card.type;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Media {
    private int sequence;
    private String url;
    private LocalDateTime uploadTime;
}