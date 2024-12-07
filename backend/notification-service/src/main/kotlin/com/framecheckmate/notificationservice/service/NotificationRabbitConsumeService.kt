package com.framecheckmate.notificationservice.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.framecheckmate.notificationservice.dto.request.NotificationSaveRequest
import com.framecheckmate.notificationservice.slack.SlackWebHookSender
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.stereotype.Service

@Service
class NotificationRabbitConsumeService (
    private val notificationService: NotificationService,
    private val objectMapper: ObjectMapper,
    private val slackWebHookSender: SlackWebHookSender
){

    @RabbitListener(queues = ["member-notification-queue", "card-notification-queue"])
    fun consumeMemberNotificationMessage(message : String) {
        val request = convert(message)
        notificationService.sendNotification(request)
    }

    @RabbitListener(queues = ["member-dead-letter-queue", "card-dead-letter-queue"])
    fun consumeDeadLetterMessage(message : String) {
        slackWebHookSender.sendSlackMessage(convert(message))
    }

    fun convert(jsonString : String) : NotificationSaveRequest {
        val notificationSaveRequest : NotificationSaveRequest =
            objectMapper.readValue(jsonString, NotificationSaveRequest::class.java)
        return notificationSaveRequest
    }
}

