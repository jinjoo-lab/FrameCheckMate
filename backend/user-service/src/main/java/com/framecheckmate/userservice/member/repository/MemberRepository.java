package com.framecheckmate.userservice.member.repository;

import com.framecheckmate.userservice.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MemberRepository extends JpaRepository<Member, UUID> {
    Member findByEmail(String email);
    List<Member> findAllByNameContainingIgnoreCase(String name);
    boolean existsByEmail(String email);
}