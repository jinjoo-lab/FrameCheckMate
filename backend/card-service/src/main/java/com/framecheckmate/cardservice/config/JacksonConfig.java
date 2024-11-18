package com.framecheckmate.cardservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.TimeZone;

@Configuration
public class JacksonConfig {
    private static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        JavaTimeModule module = new JavaTimeModule();

        module.addSerializer(LocalDateTime.class,
                new LocalDateTimeSerializer(DateTimeFormatter.ofPattern(DATE_TIME_FORMAT)));
        objectMapper.setTimeZone(TimeZone.getTimeZone("Asia/Seoul"));
        objectMapper.registerModule(module);
        return objectMapper;
    }
}