package com.framecheckmate.userservice.member.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.framecheckmate.userservice.member.entity.RefreshToken;
import com.framecheckmate.userservice.member.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@ResponseBody
@RequestMapping("/api/member")
public class TokenController {

    private final TokenService tokenService;
    private static final Logger logger = LoggerFactory.getLogger(TokenController.class);

    public TokenController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @PostMapping("/token")
    public String getToken(@RequestBody RefreshToken refreshToken) {
        return tokenService.generateAccessToken(refreshToken);
    }
}