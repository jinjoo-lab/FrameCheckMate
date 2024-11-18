package com.framecheckmate.notificationservice.config

import org.apache.kafka.clients.admin.NewTopic
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.annotation.RetryableTopic
import org.springframework.kafka.config.TopicBuilder
import org.springframework.kafka.core.KafkaAdmin
import org.springframework.kafka.retrytopic.DltStrategy
import org.springframework.retry.annotation.Backoff

@Configuration
class KafkaConfig {
    @Bean
    fun kafkaAdmin(): KafkaAdmin {
        var configs : MutableMap<String, Any> = HashMap()
        configs[ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG] = "3.38.201.188:9092"
        return KafkaAdmin(configs)
    }

    @RetryableTopic(
        attempts = "2",
        backoff = Backoff(delay = 2000L),
        dltStrategy = DltStrategy.FAIL_ON_ERROR,
        dltTopicSuffix = ".dlt",
        retryTopicSuffix = ".retry"
    )
    @Bean
    fun makeMemberNotificationTopic() : NewTopic {
        return TopicBuilder.name("member-notification-topic")
            .partitions(3)
            .replicas(1)
            .build()
    }

    @RetryableTopic(
        attempts = "2",
        backoff = Backoff(delay = 2000L),
        dltStrategy = DltStrategy.FAIL_ON_ERROR,
        dltTopicSuffix = ".dlt",
        retryTopicSuffix = ".retry"
    )
    @Bean
    fun makeCardNotificationTopic() : NewTopic {
        return TopicBuilder.name("card-notification-topic")
            .partitions(3)
            .replicas(1)
            .build()
    }
}
