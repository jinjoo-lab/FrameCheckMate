package com.framecheckmate.userservice.member.controller;

import com.framecheckmate.userservice.member.dto.JoinDTO;
import com.framecheckmate.userservice.member.entity.Member;
import com.framecheckmate.userservice.member.service.MemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@ResponseBody
@RequestMapping(value = "/api/member")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @PostMapping("/join")
    public ResponseEntity<String> joinProcess(@RequestBody JoinDTO joinDTO) {
        memberService.joinProcess(joinDTO);
        return ResponseEntity.ok("success");
    }

    @GetMapping("/find/{name}")
    public ResponseEntity<List<Member>> getUserByName(@PathVariable(value="name") String name) {
        List<Member> res = memberService.findAllByName(name);
        return ResponseEntity.ok().body(res);
    }
}
