package com.framecheckmate.notificationservice.controller

import com.framecheckmate.notificationservice.dto.request.NotificationSaveRequest
import com.framecheckmate.notificationservice.dto.response.NotificationInfoResponse
import com.framecheckmate.notificationservice.dto.response.NotificationSaveResponse
import com.framecheckmate.notificationservice.service.NotificationService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class NotificationController(val notificationService: NotificationService) {

    @PostMapping()
    fun sendNotification(@RequestBody notificationSaveRequest: NotificationSaveRequest): ResponseEntity<NotificationSaveResponse> {
        return ResponseEntity.ok(notificationService.saveNotification(notificationSaveRequest))
    }

    @GetMapping("/{email}")
    fun getAllNotificationsByEmail(@PathVariable(value = "email") email : String) : ResponseEntity<List<NotificationInfoResponse>> {
        TODO()
    }


}