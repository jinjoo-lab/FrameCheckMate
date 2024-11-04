package com.framecheckmate.userservice.project.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
public class ProjectDTO {
    private UUID projectId;
    private String name;
    private Boolean isFinished;
    private UUID managerId;
    // Add other fields you want to expose
}