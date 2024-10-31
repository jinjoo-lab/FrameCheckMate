package com.framecheckmate.cardservice.domain.frame.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FrameLog {
    private Long logSequence;
    private String frameName;

}
