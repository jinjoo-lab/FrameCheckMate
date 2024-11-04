package com.framecheckmate.userservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
public class DepartmentEntity {
    @Id
    @Column(columnDefinition = "BINARY(16)")
    private UUID departmentId;    // 부서번호

    @Column(nullable = false)
    private Integer orderNum;     // 사원수

    @Column(length = 25, nullable = false)
    private String name;          // 부서명

    @OneToMany(mappedBy = "department")
    private List<MemberEntity> members = new ArrayList<>();

    @Builder
    public DepartmentEntity(UUID departmentId, Integer orderNum, String name) {
        this.departmentId = departmentId;
        this.orderNum = orderNum;
        this.name = name;
    }
}