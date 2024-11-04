package com.framecheckmate.userservice.member.jwt;

import com.framecheckmate.userservice.member.dto.LoginDTO;
import com.framecheckmate.userservice.member.entity.Refresh;
import com.framecheckmate.userservice.member.entity.RefreshToken;
import com.framecheckmate.userservice.member.repository.RefreshRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.framecheckmate.userservice.member.repository.RefreshTokenRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.catalina.Store;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;
import java.util.UUID;

public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
//    private RefreshRepository refreshRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil, RefreshTokenRepository refreshTokenRepository) {

        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.refreshTokenRepository = refreshTokenRepository;
        setFilterProcessesUrl("/api/member/login");
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        String email = request.getParameter("email");
        String password = obtainPassword(request);

        System.out.println(email);

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(email, password, null);

        return authenticationManager.authenticate(authToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) {

        //유저 이메일
        String email = authentication.getName();
        System.out.println(email);

        //Authority 추출
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        //토큰 생성
        String access = jwtUtil.createJwt("access", email, role, 600000L);
//        String refresh = jwtUtil.createJwt("refresh", email, role, 86400000L);
        String refresh = UUID.randomUUID().toString();
        System.out.println("access : " + access);
        System.out.println("refresh : " + refresh);

        //save refresh in redis
        RefreshToken redis = new RefreshToken(refresh, email);
        refreshTokenRepository.save(redis);

        response.setHeader("access", access);
        //Refresh 토큰 저장
//        addRefreshEntity(username, refresh, 86400000L);
//
//        //응답 설정
//        response.setHeader("access", access);
//        response.addCookie(createCookie("refresh", refresh));
        response.setStatus(HttpStatus.OK.value());
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {

        response.setStatus(404);
    }

//    private void addRefreshEntity(String username, String refresh, Long expiredMs) {
//
//        Date date = new Date(System.currentTimeMillis() + expiredMs);
//
//        Refresh refreshEntity = new Refresh();
//        refreshEntity.setUsername(username);
//        refreshEntity.setRefresh(refresh);
//        refreshEntity.setExpiration(date.toString());
//
////        refreshRepository.save(refreshEntity);
//    }
//
//    private Cookie createCookie(String key, String value) {
//
//        Cookie cookie = new Cookie(key, value);
//        cookie.setMaxAge(24*60*60);
//        //cookie.setSecure(true);
//        //cookie.setPath("/");
//        cookie.setHttpOnly(true);
//
//        return cookie;
//    }
}
