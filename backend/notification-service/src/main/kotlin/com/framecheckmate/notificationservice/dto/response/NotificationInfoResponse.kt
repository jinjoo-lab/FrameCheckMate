package com.framecheckmate.notificationservice.dto.response

import com.framecheckmate.notificationservice.entity.NotificationType
import java.util.*

data class NotificationInfoResponse (
    val id : UUID,
    val name : String,
    val email : String,
    val content : String,
    val type : NotificationType
)