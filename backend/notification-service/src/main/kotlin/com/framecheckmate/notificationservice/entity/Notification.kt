package com.framecheckmate.notificationservice.entity

import jakarta.persistence.*
import java.util.UUID

@Entity
class Notification (
    var name : String,
    var email : String,
    var content : String,
    @Enumerated(EnumType.STRING)
    var type : NotificationType
) {
    @Id
    @Column(columnDefinition = "BINARY(16)")
    var id : UUID = UUID.randomUUID()
}