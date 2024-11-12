package com.framecheckmate.userservice.member.service;

import com.framecheckmate.userservice.member.dto.JoinDTO;
import com.framecheckmate.userservice.member.entity.Member;
import com.framecheckmate.userservice.member.exception.DuplicateEmailException;
import com.framecheckmate.userservice.member.kafka.KafkaDtoMapper;
import com.framecheckmate.userservice.member.kafka.MemberKafkaProducer;
import com.framecheckmate.userservice.member.kafka.dto.NotificationSaveRequest;
import com.framecheckmate.userservice.member.kafka.dto.NotificationType;
import com.framecheckmate.userservice.member.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class MemberService {

    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final MemberKafkaProducer memberKafkaProducer;
    private final KafkaDtoMapper kafkaDtoMapper;

    private static final String NOTIFICATION_TOPIC = "member-notification-topic";

    public MemberService(MemberRepository memberRepository, BCryptPasswordEncoder bCryptPasswordEncoder, MemberKafkaProducer memberKafkaProducer, KafkaDtoMapper kafkaDtoMapper) {
        this.memberRepository = memberRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.memberKafkaProducer = memberKafkaProducer;
        this.kafkaDtoMapper = kafkaDtoMapper;
    }

    @Transactional
    public void joinProcess(JoinDTO joinDTO) {
        validateDuplicateEmail(joinDTO.getEmail());

        String email = joinDTO.getEmail();
        Member data = new Member();
        data.setName(joinDTO.getUsername());
        data.setEmail(email);
        data.setPassword(bCryptPasswordEncoder.encode(joinDTO.getPassword()));
        data.setRole("ROLE_USER");
        memberRepository.save(data);

        memberKafkaProducer.sendMessage(NOTIFICATION_TOPIC,kafkaDtoMapper.makeNotificationSaveRequest(
                new NotificationSaveRequest(
                        email,
                        NotificationType.MEMBER_SAVE
                )
        ));
    }

    private void validateDuplicateEmail(String email) {
        if (memberRepository.existsByEmail(email)) {
            throw new DuplicateEmailException("Email already exists: " + email);
        }
    }


    public List<Member> findAllByName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }
        return memberRepository.findAllByNameContainingIgnoreCase(name);
    }

    public String getMember(UUID memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("Member not found with id: " + memberId))
                .getName();
    }
}
