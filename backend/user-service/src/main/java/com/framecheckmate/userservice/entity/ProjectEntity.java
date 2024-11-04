package com.framecheckmate.userservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Setter
@Getter
public class ProjectEntity {
    @Id
    @Column(columnDefinition = "BINARY(16)")
    private UUID projectId;       // 프로젝트번호

    @Column(length = 25, nullable = false)
    private String name;          // 프로젝트명

    @Column(columnDefinition = "BINARY(16)", nullable = false)
    private UUID managerId;       // 관리자

    @Column(nullable = false)
    private Boolean isPublic;     // 완료여부

    @OneToMany(mappedBy = "project")
    private List<ProjectMemberEntity> projectMembers = new ArrayList<>();

}