package com.framecheckmate.userservice.member.kafka.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationSaveRequest {
    private String email;
    private NotificationType type;
}