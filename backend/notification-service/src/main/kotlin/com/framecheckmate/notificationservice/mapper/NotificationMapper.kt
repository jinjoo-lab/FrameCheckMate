package com.framecheckmate.notificationservice.mapper

import com.framecheckmate.notificationservice.dto.request.NotificationSaveRequest
import com.framecheckmate.notificationservice.dto.response.NotificationSaveResponse
import com.framecheckmate.notificationservice.entity.Notification
import org.springframework.stereotype.Component


@Component
class NotificationMapper {

    fun entityToSaveResponse(notification : Notification) : NotificationSaveResponse {
        return NotificationSaveResponse(
            id = notification.id,
            name = notification.name,
            email = notification.email,
            content = notification.content,
            type = notification.type
        )
    }

    fun saveRequestToEntity(request : NotificationSaveRequest) : Notification {
        return Notification(
            name = request.type.koName,
            email = request.email,
            content = request.type.typeContent,
            type = request.type
        )
    }

}