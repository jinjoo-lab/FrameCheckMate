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
    private UUID memberId;        // 회원ID

    @Column(length = 25, nullable = false)
    private String name;          // 이름

    @Column(length = 25, nullable = false)
    private String email;         // 이메일

    @Column(length = 255, nullable = true)
    private String image;         // 이미지

    @Column(length = 255, nullable = false)
    private String password;      // 비밀번호

    @Column(length = 25, nullable = true)
    private String role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departmentId", insertable = false, updatable = false, nullable = true)
    private Department department;

}
