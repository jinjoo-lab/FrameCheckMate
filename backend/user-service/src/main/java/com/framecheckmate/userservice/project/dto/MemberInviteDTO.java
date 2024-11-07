package com.framecheckmate.userservice.project.dto;

import com.framecheckmate.userservice.member.entity.Department;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberInviteDTO {
    private UUID memberId;
    private String name;          // 이름
    private String email;         // 이메일
    private String image;         // 이미지
    private String password;      // 비밀번호
    private String role;
    private Department department;
}
