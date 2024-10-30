package com.framecheckmate.notification.repository

import com.framecheckmate.notification.entity.Notification
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface NotificationRepository : JpaRepository<Notification,UUID> {

}