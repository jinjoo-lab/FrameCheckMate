package com.framecheckmate.userservice.project.repository;

import com.framecheckmate.userservice.member.entity.Member;
import com.framecheckmate.userservice.project.entity.Project;
import com.framecheckmate.userservice.project.entity.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, UUID> {
    List<ProjectMember> findByMemberEmail(String email);
    @Query("SELECT pm.member FROM ProjectMember pm WHERE pm.project.projectId = :projectId")
    List<Member> findMembersByProjectId(@Param("projectId") UUID projectId);

}