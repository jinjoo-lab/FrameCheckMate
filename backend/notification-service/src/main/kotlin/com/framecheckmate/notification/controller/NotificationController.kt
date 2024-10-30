package com.framecheckmate.notification.controller

import com.framecheckmate.notification.dto.request.NotificationSaveRequest
import com.framecheckmate.notification.dto.response.NotificationSaveResponse
import com.framecheckmate.notification.service.NotificationService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/notification")
class NotificationController (val notificationService: NotificationService){

    @PostMapping()
    fun sendNotification(saveNotificationRequest : NotificationSaveRequest) : NotificationSaveResponse {
        TODO()
    }

}