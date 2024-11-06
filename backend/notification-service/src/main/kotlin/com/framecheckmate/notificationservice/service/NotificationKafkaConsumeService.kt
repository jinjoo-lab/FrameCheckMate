package com.framecheckmate.notificationservice.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.framecheckmate.notificationservice.dto.request.NotificationSaveRequest
import com.framecheckmate.notificationservice.kafka.KafkaProducer
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Service

@Service
class NotificationKafkaConsumeService(
    private val notificationService: NotificationService
) {
    @KafkaListener(topics = ["member-notification-topic"], groupId = "member-notification")
    fun consumeNotificationMessage(message : String) {
        val request : NotificationSaveRequest = convert(message)
        notificationService.saveNotification(request)
    }

    fun convert(jsonString : String) : NotificationSaveRequest {
        val objectMapper = jacksonObjectMapper()
        val notificationsaveRequest : NotificationSaveRequest = objectMapper.readValue(jsonString, NotificationSaveRequest::class.java)

        return notificationsaveRequest
    }
}