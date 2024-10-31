package com.framecheckmate.notificationservice.controller

import com.framecheckmate.notificationservice.dto.request.NotificationSaveRequest
import com.framecheckmate.notificationservice.dto.response.NotificationInfoResponse
import com.framecheckmate.notificationservice.dto.response.NotificationSaveResponse
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class NotificationController {

    @PostMapping()
    fun sendNotification(@RequestBody notificationSaveRequest: NotificationSaveRequest): NotificationSaveResponse {
        TODO()
    }

    @GetMapping("/{email}")
    fun getAllNotificationsByEmail(@PathVariable(value = "email") email : String) : List<NotificationInfoResponse> {
        TODO()
    }


}