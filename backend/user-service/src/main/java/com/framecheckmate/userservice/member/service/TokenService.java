package com.framecheckmate.userservice.member.service;

import com.framecheckmate.userservice.member.entity.Member;
import com.framecheckmate.userservice.member.entity.RefreshToken;
import com.framecheckmate.userservice.member.jwt.JWTUtil;
import com.framecheckmate.userservice.member.repository.MemberRepository;
import com.framecheckmate.userservice.member.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@RequiredArgsConstructor
@Transactional
@Service
public class TokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final MemberRepository memberRepository;
    private final JWTUtil tokenProvider;

    public String generateAccessToken(final RefreshToken refreshToken) {
        RefreshToken refreshToken1 = refreshTokenRepository.findById(refreshToken.getRefreshToken())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        Member user = memberRepository.findByEmail(refreshToken1.getUserId());
        if(user == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);


        return tokenProvider.createJwt("access", user.getEmail(), user.getRole(), 600000L);
    }
}