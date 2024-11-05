package com.framecheckmate.notificationservice.controller

import com.framecheckmate.notificationservice.dto.request.NotificationSaveRequest
import com.framecheckmate.notificationservice.dto.response.NotificationInfoResponse
import com.framecheckmate.notificationservice.dto.response.NotificationSaveResponse
import com.framecheckmate.notificationservice.service.CustomMailSender
import com.framecheckmate.notificationservice.service.NotificationService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/notification")
class NotificationController(
    val notificationService: NotificationService,
) {

    @PostMapping()
    fun sendNotification(@RequestBody notificationSaveRequest: NotificationSaveRequest): ResponseEntity<NotificationSaveResponse> {
        return ResponseEntity.ok(notificationService.saveNotification(notificationSaveRequest))
    }

    @GetMapping("/{email}")
    fun getAllNotificationsByEmail(@PathVariable(value = "email") email : String) : ResponseEntity<List<NotificationInfoResponse>> {
        return ResponseEntity.ok(notificationService.getNotificationsByEmail(email))
    }
}
