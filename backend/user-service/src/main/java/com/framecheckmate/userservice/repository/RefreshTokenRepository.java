package com.framecheckmate.userservice.repository;

import com.framecheckmate.userservice.entity.RefreshToken;
import org.springframework.data.repository.CrudRepository;

public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {
}