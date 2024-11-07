package com.framecheckmate.testservice.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.framecheckmate.testservice.kafka.KafkaProducer;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class KafkaTestController {
    private KafkaProducer kafkaProducer;

    public KafkaTestController(KafkaProducer kafkaProducer) {
        this.kafkaProducer = kafkaProducer;
    }

    @GetMapping("/go")
    public void test() throws JsonProcessingException {

        System.out.println("TEST START");

        NotificationSaveRequest request = new NotificationSaveRequest(
                "drasgon@naver.com",
                NotificationType.MEMBER_SAVE
        );

        ObjectMapper mapper = new ObjectMapper();

        String jsonString = mapper.writeValueAsString(request);

        kafkaProducer.sendMessage("member-notification-topic",jsonString);
    }
}
