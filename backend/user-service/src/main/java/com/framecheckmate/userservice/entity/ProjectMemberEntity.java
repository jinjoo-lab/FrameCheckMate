package com.framecheckmate.userservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Getter
@Setter
public class ProjectMemberEntity {
    @Id
    @Column(name = "key", columnDefinition = "BINARY(16)")
    private UUID id;             // Key

    @Column(columnDefinition = "BINARY(16)", nullable = false)
    private UUID projectId;      // 프로젝트번호

    @Column(columnDefinition = "BINARY(16)", nullable = false)
    private UUID memberId;       // 회원ID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projectId", insertable = false, updatable = false)
    private ProjectEntity project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "memberId", insertable = false, updatable = false)
    private MemberEntity member;

}