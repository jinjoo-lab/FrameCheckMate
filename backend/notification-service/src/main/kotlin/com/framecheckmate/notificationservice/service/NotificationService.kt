package com.framecheckmate.notificationservice.service

import com.framecheckmate.notificationservice.dto.request.NotificationSaveRequest
import com.framecheckmate.notificationservice.repository.NotificationRepository
import org.springframework.stereotype.Service

@Service
class NotificationService(val notificationRepository : NotificationRepository) {

    fun saveNotification(notificationSaveRequest: NotificationSaveRequest) {

    }
}