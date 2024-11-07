package com.framecheckmate.notificationservice.service

import com.framecheckmate.notificationservice.dto.request.NotificationSaveRequest
import com.framecheckmate.notificationservice.dto.response.NotificationInfoResponse
import com.framecheckmate.notificationservice.dto.response.NotificationSaveResponse
import com.framecheckmate.notificationservice.mapper.NotificationMapper
import com.framecheckmate.notificationservice.repository.NotificationRepository
import jakarta.transaction.Transactional
import lombok.extern.slf4j.Slf4j
import org.apache.kafka.common.requests.DeleteAclsResponse.log
import org.springframework.stereotype.Service
import kotlin.streams.toList

@Slf4j
@Service
class NotificationService(
    private val customMailSender: CustomMailSender,
    private val notificationRepository : NotificationRepository,
    private val notificationMapper : NotificationMapper
) {

    @Transactional
    fun saveNotification(notificationSaveRequest: NotificationSaveRequest) : NotificationSaveResponse {
        customMailSender.snedMail(notificationSaveRequest.email,notificationSaveRequest.type.koName,notificationSaveRequest.type.typeContent)

        return notificationMapper.entityToSaveResponse(
               notificationRepository.save(notificationMapper.saveRequestToEntity(notificationSaveRequest))
           )
    }

    @Transactional
    fun getNotificationsByEmail(email : String) : List<NotificationInfoResponse> {
        return notificationRepository.findAllByEmail(email).stream().map { notificationMapper.entityToInfoResponse(it) }.toList()
    }
}
