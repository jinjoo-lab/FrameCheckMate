package com.framecheckmate.userservice.member.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
public class Department {
    @Id
    @Column(columnDefinition = "BINARY(16)")
    private UUID departmentId;    // 부서번호

    @Column(nullable = false)
    private Integer employeeNum = 0;     // 사원수

    @Column(length = 25, nullable = false)
    private String name;          // 부서명

    @OneToMany(mappedBy = "department")
    private List<Member> members = new ArrayList<>();

}