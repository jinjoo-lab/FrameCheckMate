package com.framecheckmate.userservice.project.repository;

import com.framecheckmate.userservice.project.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
    List<Project> findByManagerId(UUID managerId);
    Project findByProjectId(UUID projectId);
    List<Project> findByIsFinishedTrue();
    Project findByName(String name);

}
