package com.framecheckmate.notificationservice.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.framecheckmate.notificationservice.dto.request.NotificationSaveRequest
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.stereotype.Service

@Service
class NotificationRabbitConsumeService (
    private val notificationService: NotificationService,
    private val objectMapper: ObjectMapper
){
    @RabbitListener(queues = ["member-notification-queue", "card-notification-queue"])
    fun consumeMemberNotificationMessage(message : String) {
        val request = convert(message)
        notificationService.saveNotification(request)
    }

    fun convert(jsonString : String) : NotificationSaveRequest {
        val notificationSaveRequest : NotificationSaveRequest = objectMapper.readValue(jsonString, NotificationSaveRequest::class.java)
        return notificationSaveRequest
    }
}
