package com.framecheckmate.notificationservice.config


import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.JavaMailSenderImpl
import java.util.*


@Configuration
class MailConfig {
    @Value("\${spring.mail.username}")
    lateinit var id: String

    @Value("\${spring.mail.password}")
    lateinit var password: String

    @Value("\${spring.mail.host}")
    lateinit var host: String

    @Value("\${spring.mail.port}")
    var port: Int = 0

    @Bean
    fun javaMailSender(): JavaMailSender {
        var javaMailSender = JavaMailSenderImpl()

        javaMailSender.setHost(host)
        javaMailSender.setPort(port)
        javaMailSender.username = id
        javaMailSender.password = password
        javaMailSender.javaMailProperties = getMailProperties()
        javaMailSender.defaultEncoding = "UTF-8"

        return javaMailSender
    }

    fun getMailProperties() : Properties {
        var properties = Properties()

        properties.set("mail.transport.protocol", "smtp")
        properties.set("mail.smtp.auth", "true")
        properties.set("mail.smtp.starttls.enable", "true")
        properties.set("mail.smtp.ssl.trust", host)
        properties.setProperty("mail.smtp.ssl.enable", "true")

        return properties
    }
}