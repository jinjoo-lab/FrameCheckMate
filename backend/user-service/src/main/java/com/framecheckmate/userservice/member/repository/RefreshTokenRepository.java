package com.framecheckmate.userservice.member.repository;

import com.framecheckmate.userservice.member.entity.RefreshToken;
import org.springframework.data.repository.CrudRepository;

public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {
}