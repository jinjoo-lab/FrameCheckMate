package com.framecheckmate.userservice.member.controller;

import com.framecheckmate.userservice.member.dto.JoinDTO;
import com.framecheckmate.userservice.member.entity.Member;
import com.framecheckmate.userservice.member.repository.MemberRepository;
import com.framecheckmate.userservice.member.service.JoinService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@ResponseBody
@RequestMapping(value = "/api/member")
public class MemberController {

    private final JoinService joinService;
    private final MemberRepository memberRepository;

    public MemberController(JoinService joinService, MemberRepository memberRepository) {

        this.joinService = joinService;
        this.memberRepository = memberRepository;
    }

    @PostMapping("/join")
    public String joinProcess(@RequestBody JoinDTO joinDTO) {

        joinService.joinProcess(joinDTO);

        return "ok";
    }

    @GetMapping("/find/{name}")
    public ResponseEntity<List<Member>> getUserByName(@PathVariable(value="name") String name) {
        List<Member> res = memberRepository.findAllByName(name);
        return ResponseEntity.ok().body(res);
    }
}
