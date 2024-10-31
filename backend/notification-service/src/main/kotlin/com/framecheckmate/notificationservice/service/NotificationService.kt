package com.framecheckmate.notificationservice.service

import com.framecheckmate.notificationservice.dto.request.NotificationSaveRequest
import com.framecheckmate.notificationservice.dto.response.NotificationInfoResponse
import com.framecheckmate.notificationservice.dto.response.NotificationSaveResponse
import com.framecheckmate.notificationservice.mapper.NotificationMapper
import com.framecheckmate.notificationservice.repository.NotificationRepository
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import kotlin.streams.toList

@Service
class NotificationService(
    val notificationRepository : NotificationRepository,
    val notificationMapper : NotificationMapper
) {

    @Transactional
    fun saveNotification(notificationSaveRequest: NotificationSaveRequest) : NotificationSaveResponse {
           return notificationMapper.entityToSaveResponse(
               notificationRepository.save(notificationMapper.saveRequestToEntity(notificationSaveRequest))
           )
    }

    @Transactional
    fun getNotificationsByEmail(email : String) : List<NotificationInfoResponse> {
        return notificationRepository.findAllByEmail(email).stream().map { notificationMapper.entityToInfoResponse(it) }.toList()
    }
}