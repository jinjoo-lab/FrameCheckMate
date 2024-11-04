package com.framecheckmate.userservice.repository;

import com.framecheckmate.userservice.entity.ProjectMemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectMemberRepository extends JpaRepository<ProjectMemberEntity, UUID> {
    List<ProjectMemberEntity> findByMemberId(UUID memberId);
    List<ProjectMemberEntity> findByProjectId(UUID projectId);
    Optional<ProjectMemberEntity> findByProjectIdAndMemberId(UUID projectId, UUID memberId);
}