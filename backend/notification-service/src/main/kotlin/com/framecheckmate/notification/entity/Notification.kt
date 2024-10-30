package com.framecheckmate.notification.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import java.util.UUID

@Entity
class Notification(

) {
    @Id
    @Column(columnDefinition = "BINARY(16)")
    var id : UUID = UUID.randomUUID()
}