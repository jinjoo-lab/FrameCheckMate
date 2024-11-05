package com.framecheckmate.userservice.project.entity;

import com.framecheckmate.userservice.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Getter
@Setter
public class ProjectMember {
    @Id
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;             // Key

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

}