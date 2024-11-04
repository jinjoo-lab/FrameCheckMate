package com.framecheckmate.userservice.member.service;

import com.framecheckmate.userservice.member.dto.CustomUserDetails;
import com.framecheckmate.userservice.member.entity.Member;
import com.framecheckmate.userservice.member.repository.MemberRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    private final MemberRepository userRepository;

    public CustomUserDetailsService(MemberRepository userRepository) {

        this.userRepository = userRepository;
    }

    @Override
    public org.springframework.security.core.userdetails.UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        Member userData = userRepository.findByEmail(email);

        if (userData != null) {

            return new CustomUserDetails(userData);
        }


        return null;
    }
}
