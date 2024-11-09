package com.framecheckmate.cardservice.domain.kafka.mapper;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.framecheckmate.cardservice.domain.kafka.dto.NotificationSaveRequest;
import org.springframework.stereotype.Component;

@Component
public class KafkaDtoMapper {
    public String toNotificationDto(NotificationSaveRequest request) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            String jsonString = mapper.writeValueAsString(request);
            return jsonString;
        }catch (Exception e){
            return "NULL";
        }
    }
}
