package com.framecheckmate.userservice.member.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.framecheckmate.userservice.member.entity.RefreshToken;
import com.framecheckmate.userservice.member.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@Controller
@ResponseBody
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