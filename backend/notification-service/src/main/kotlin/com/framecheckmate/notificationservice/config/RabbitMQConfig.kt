package com.framecheckmate.notificationservice.config

import org.springframework.amqp.core.Binding
import org.springframework.amqp.core.BindingBuilder
import org.springframework.amqp.core.DirectExchange
import org.springframework.amqp.core.Queue
import org.springframework.amqp.rabbit.annotation.EnableRabbit
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory
import org.springframework.amqp.rabbit.connection.ConnectionFactory
import org.springframework.amqp.rabbit.core.RabbitAdmin
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter
import org.springframework.amqp.support.converter.MessageConverter
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.retry.backoff.ExponentialBackOffPolicy
import org.springframework.retry.policy.SimpleRetryPolicy
import org.springframework.retry.support.RetryTemplate

@EnableRabbit
@Configuration
class RabbitMQConfig {

    @Value("\${spring.rabbitmq.host}")
    lateinit var rabbitMqHost : String

    @Value("\${spring.rabbitmq.port}")
    lateinit var rabbitMqPort : String

    @Value("\${spring.rabbitmq.username}")
    lateinit var rabbitMqUsername: String

    @Value("\${spring.rabbitmq.password}")
    lateinit var rabbitMqPassword: String

    @Bean
    fun connectionFactory() : CachingConnectionFactory {
        val connectionFactory = CachingConnectionFactory(rabbitMqHost, rabbitMqPort.toInt())
        connectionFactory.username = rabbitMqUsername
        connectionFactory.setPassword(rabbitMqPassword)
        return connectionFactory
    }

    @Bean
    fun rabbitAdmin(connectionFactory: CachingConnectionFactory) : RabbitAdmin {
        val rabbitAdmin : RabbitAdmin = RabbitAdmin(connectionFactory)
        return rabbitAdmin
    }

    @Bean
    fun memberNotificationQueue() : Queue {
        return Queue("member-notification-queue",true)
    }

    @Bean
    fun notificationExchange() : DirectExchange {
        return DirectExchange("notification-exchange")
    }

    @Bean
    fun memberNotificationBinding() : Binding {
        return BindingBuilder.bind(memberNotificationQueue())
            .to(notificationExchange())
            .with("member-notification-key")
    }

    @Bean
    fun cardNotificationQueue() : Queue {
        return Queue("card-notification-queue", true)
    }

    @Bean
    fun cardNotificationBinding() : Binding {
        return BindingBuilder.bind(cardNotificationQueue())
            .to(notificationExchange())
            .with("card-notification-key")
    }

    @Bean
    fun messageConverter() : MessageConverter {
        return Jackson2JsonMessageConverter()
    }

    @Bean
    fun rabbitTemplate(
        connectionFactory: ConnectionFactory,
        messageConverter: MessageConverter,
        retryTemplate: RetryTemplate
    ) : RabbitTemplate {
        val rabbitTemplate = RabbitTemplate(connectionFactory)
        rabbitTemplate.messageConverter = messageConverter
        rabbitTemplate.setRetryTemplate(retryTemplate)
        return rabbitTemplate
    }

    @Bean
    fun retryTemplate() : RetryTemplate {
        val retryTemplate = RetryTemplate()

        val retryPolicy = SimpleRetryPolicy()
        retryPolicy.maxAttempts = 2

        val backOffPolicy = ExponentialBackOffPolicy()
        backOffPolicy.initialInterval = 5_000L

        retryTemplate.setRetryPolicy(retryPolicy)
        retryTemplate.setBackOffPolicy(backOffPolicy)

        return retryTemplate
    }

    @Bean
    fun cardDeadLetterQueue() : Queue {
        return Queue("card-dead-letter-queue", true)
    }

    @Bean
    fun deadLetterExchange() : DirectExchange {
        return DirectExchange("dead-letter-exchange")
    }

    @Bean
    fun cardDeadLetterBinding() :Binding {
        return BindingBuilder.bind(cardDeadLetterQueue())
            .to(deadLetterExchange())
            .with("card-dead-key")
    }

    @Bean
    fun memberDeadLetterQueue() : Queue {
        return Queue("member-dead-letter-queue", true)
    }

    @Bean
    fun memberDeadLetterBinding() :Binding {
        return BindingBuilder.bind(memberDeadLetterQueue())
            .to(deadLetterExchange())
            .with("card-dead-key")
    }
}
