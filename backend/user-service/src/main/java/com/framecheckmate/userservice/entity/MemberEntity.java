package com.framecheckmate.userservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Entity
public class MemberEntity {

    @Id
    @Column(columnDefinition = "BINARY(16)")
    private UUID memberId;        // 회원ID

    @Column(length = 25, nullable = false)
    private String name;          // 이름

    @Column(length = 25, nullable = false)
    private String email;         // 이메일

    @Column(length = 255, nullable = false)
    private String image;         // 이미지

    @Column(length = 25, nullable = false)
    private String password;      // 비밀번호

    @Column(columnDefinition = "BINARY(16)", nullable = false)
    private UUID departmentId;    // 부서번호

    private String role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departmentId", insertable = false, updatable = false)
    private DepartmentEntity department;


}
