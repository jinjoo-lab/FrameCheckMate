package com.framecheckmate.notificationservice.config

import org.apache.kafka.clients.admin.NewTopic
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.config.TopicBuilder
import org.springframework.kafka.core.KafkaAdmin

@Configuration
class KafkaConfig {
    @Bean
    fun kafkaAdmin(): KafkaAdmin {
        var configs : MutableMap<String, Any> = HashMap()
        configs[ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG] = "127.0.0.1:9092"
        return KafkaAdmin(configs)
    }

    @Bean
    fun makeMemberNotificationTopic() : NewTopic {
        return TopicBuilder.name("member-notification-topic")
            .partitions(3)
            .replicas(1)
            .build()
    }
}