package com.framecheckmate.userservice.member.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Entity
public class Member {

    @Id
    @Column(columnDefinition = "BINARY(16)")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID memberId;

    @Column(length = 25, nullable = false)
    private String name;

    @Column(length = 25, nullable = false)
    private String email;

    @Column(length = 255, nullable = true)
    private String image;

    @Column(length = 255, nullable = false)
    private String password;

    @Column(length = 25, nullable = true)
    private String role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departmentId", insertable = false, updatable = false, nullable = true)
    private Department department;

}
