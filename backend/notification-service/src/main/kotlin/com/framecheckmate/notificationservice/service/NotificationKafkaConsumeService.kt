package com.framecheckmate.notificationservice.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.framecheckmate.notificationservice.dto.request.NotificationSaveRequest
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.kafka.annotation.RetryableTopic
import org.springframework.kafka.retrytopic.DltStrategy
import org.springframework.retry.annotation.Backoff
import org.springframework.stereotype.Service

@Service
class NotificationKafkaConsumeService(
    private val notificationService: NotificationService
) {

    @KafkaListener(topics = ["member-notification-topic"], groupId = "member-card-notification",
        concurrency = "3")
    fun consumeMemberNotificationMessage(message : String) {
        val request : NotificationSaveRequest = convert(message)

       notificationService.saveNotification(request)
    }

    @KafkaListener(topics = ["card-notification-topic"], groupId = "member-card-notification",
        concurrency = "3")
    fun consumeCardNotificationMessage(message : String) {
        val request : NotificationSaveRequest = convert(message)

        notificationService.saveNotification(request)
    }

    fun convert(jsonString : String) : NotificationSaveRequest {
        val objectMapper = jacksonObjectMapper()
        val notificationsaveRequest : NotificationSaveRequest = objectMapper.readValue(jsonString, NotificationSaveRequest::class.java)

        return notificationsaveRequest
    }
}
