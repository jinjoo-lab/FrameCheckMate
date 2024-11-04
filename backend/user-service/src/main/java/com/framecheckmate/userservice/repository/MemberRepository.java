package com.framecheckmate.userservice.repository;

import com.framecheckmate.userservice.entity.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface MemberRepository extends JpaRepository<MemberEntity, UUID> {
    MemberEntity findByEmail(String email);

    boolean existsByEmail(String email);
}