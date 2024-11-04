package com.framecheckmate.userservice.repository;

import com.framecheckmate.userservice.entity.ProjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<ProjectEntity, UUID> {
    List<ProjectEntity> findByManagerId(UUID managerId);
    List<ProjectEntity> findByIsPublicTrue();
}
