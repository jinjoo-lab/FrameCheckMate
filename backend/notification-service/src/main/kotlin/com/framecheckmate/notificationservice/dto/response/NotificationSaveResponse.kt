package com.framecheckmate.notificationservice.dto.response

import com.framecheckmate.notificationservice.entity.NotificationType
import java.util.UUID

data class NotificationSaveResponse (
    val id : UUID,
    val name : String,
    val email : String,
    val content : String,
    val type : NotificationType
)