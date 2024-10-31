package com.framecheckmate.notificationservice.dto.request

import com.framecheckmate.notificationservice.entity.NotificationType

data class NotificationSaveRequest (
    val email : String,
    val type : NotificationType
)