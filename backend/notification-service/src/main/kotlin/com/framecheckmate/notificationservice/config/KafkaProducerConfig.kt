package com.framecheckmate.notificationservice.config

import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.common.serialization.StringSerializer
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.annotation.EnableKafka
import org.springframework.kafka.core.DefaultKafkaProducerFactory
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.kafka.core.ProducerFactory

@Configuration
@EnableKafka
class KafkaProducerConfig {

    @Bean
    fun producerFactory() : ProducerFactory<String, String> {
        var properties : MutableMap<String, Any> = HashMap()

        properties[ProducerConfig.BOOTSTRAP_SERVERS_CONFIG] = "127.0.0.1:9092"
        properties[ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG] = StringSerializer::class.java
        properties[ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG] = StringSerializer::class.java

        return DefaultKafkaProducerFactory(properties)
    }

    @Bean
    fun kafkaTemplate() : KafkaTemplate<String, String> {
        return KafkaTemplate(producerFactory())
    }
}