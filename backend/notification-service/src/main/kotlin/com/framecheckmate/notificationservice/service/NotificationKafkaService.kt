package com.framecheckmate.notificationservice.service

import com.framecheckmate.notificationservice.kafka.KafkaProducer
import org.springframework.stereotype.Service

@Service
class NotificationKafkaService(
    private val kafkaProducer: KafkaProducer
) {

}