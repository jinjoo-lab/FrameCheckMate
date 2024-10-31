package com.framecheckmate.notificationservice.repository

import com.framecheckmate.notificationservice.entity.Notification
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface NotificationRepository : JpaRepository<Notification,UUID> {
    fun findAllByEmail(email : String) : List<Notification>
}