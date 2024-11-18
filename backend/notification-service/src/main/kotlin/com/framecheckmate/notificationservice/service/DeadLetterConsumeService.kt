package com.framecheckmate.notificationservice.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.framecheckmate.notificationservice.dto.request.NotificationSaveRequest
import com.framecheckmate.notificationservice.slack.SlackWebHookSender
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Component

@Component
class DeadLetterConsumeService(
    val slackWebHookSender: SlackWebHookSender,
) {
    @KafkaListener(
        topics = ["member-notification-topic.dlt", "card-notification-topic.dlt"],
        groupId = "member-card-notification"
    )
    fun consumeDeadLetter(message: String) {
        slackWebHookSender.sendSlackMessage(
            convert(message)
        )
    }

    fun convert(jsonString : String) : NotificationSaveRequest {
        val objectMapper = jacksonObjectMapper()
        val notificationsaveRequest : NotificationSaveRequest = objectMapper.readValue(jsonString, NotificationSaveRequest::class.java)

        return notificationsaveRequest
    }
}
