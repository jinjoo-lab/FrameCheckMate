package com.framecheckmate.notificationservice.slack

import com.framecheckmate.notificationservice.dto.request.NotificationSaveRequest
import com.slack.api.Slack
import com.slack.api.model.Field
import com.slack.api.model.Attachment;
import com.slack.api.webhook.WebhookPayloads.payload


import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.io.IOException

@Component
class SlackWebHookSender(
    val slack : Slack = Slack.getInstance()
) {

    @Value("\${slack.webhook.url}")
    lateinit var SLACK_WEBHOOK_URL : String

    fun sendSlackMessage(request : NotificationSaveRequest) {
        try {
            slack.send(SLACK_WEBHOOK_URL,
                    payload {
                        p -> p.text(request.type.koName).attachments(
                            listOf(
                                Attachment.builder()
                                    .fields(
                                        listOf(generateSlackField(request.type.typeContent))
                                    ).build()
                            )
                        )
                    }
                )
        } catch(e : IOException) {
            e.printStackTrace()
        }
    }

    fun generateSlackField(value : String) : Field {
        return Field
            .builder()
            .value(value)
            .valueShortEnough(false)
            .build()
    }
}
