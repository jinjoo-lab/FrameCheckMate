package com.framecheckmate.userservice.member.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.framecheckmate.userservice.member.kafka.dto.NotificationSaveRequest;
import org.springframework.stereotype.Component;

@Component
public class KafkaDtoMapper {

    public String makeNotificationSaveRequest(NotificationSaveRequest request){
        try {
            ObjectMapper mapper = new ObjectMapper();
            String jsonString = mapper.writeValueAsString(request);
            return jsonString;
        }catch (Exception e){
            return "NULL";
        }
    }



}
