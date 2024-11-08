package com.framecheckmate.userservice.member.service;

import com.framecheckmate.userservice.member.dto.JoinDTO;
import com.framecheckmate.userservice.member.entity.Member;
import com.framecheckmate.userservice.member.kafka.KafkaDtoMapper;
import com.framecheckmate.userservice.member.kafka.MemberKafkaProducer;
import com.framecheckmate.userservice.member.kafka.dto.NotificationSaveRequest;
import com.framecheckmate.userservice.member.kafka.dto.NotificationType;
import com.framecheckmate.userservice.member.repository.MemberRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class JoinService {

    private final MemberRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final MemberKafkaProducer memberKafkaProducer;
    private final KafkaDtoMapper kafkaDtoMapper;

    private static final String NOTIFICATION_TOPIC = "member-notification-topic";

    public JoinService(MemberRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder, MemberKafkaProducer memberKafkaProducer, KafkaDtoMapper kafkaDtoMapper) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.memberKafkaProducer = memberKafkaProducer;
        this.kafkaDtoMapper = kafkaDtoMapper;
    }

    @Transactional
    public void joinProcess(JoinDTO joinDTO) {
        String username = joinDTO.getUsername();
        String email = joinDTO.getEmail();
        String password = joinDTO.getPassword();

        Boolean isExist = userRepository.existsByEmail(email);

        if (isExist) {
            return;
        }

        Member data = new Member();
        data.setName(username);
        data.setEmail(email);
        data.setPassword(bCryptPasswordEncoder.encode(password));
        data.setRole("ROLE_USER");

        userRepository.save(data);

        memberKafkaProducer.sendMessage(NOTIFICATION_TOPIC,kafkaDtoMapper.makeNotificationSaveRequest(
                new NotificationSaveRequest(
                        email,
                        NotificationType.MEMBER_SAVE
                )
        ));
    }
}
