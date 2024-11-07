package com.framecheckmate.userservice.project.dto;

import com.framecheckmate.userservice.member.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectInviteDTO {
    private UUID ProjectId;
    private List<MemberInviteDTO> members;
}