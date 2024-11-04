package com.framecheckmate.userservice.repository;

import com.framecheckmate.userservice.entity.DepartmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DepartmentRepository extends JpaRepository<DepartmentEntity, UUID> {
    Optional<DepartmentEntity> findByName(String name);
    List<String> findDistinctByName();
}
