package com.framecheckmate.cardservice.domain.card.type;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FrameConfirmMatch {
    private String frame;
    private ConfirmDetail confirm;
}
