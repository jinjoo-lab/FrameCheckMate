package com.framecheckmate.notificationservice.service

import org.springframework.beans.factory.annotation.Value
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service

@Service
class CustomMailSender(
    private val javaMailSender : JavaMailSender
) {
    @Value("\${spring.mail.username}")
    lateinit var mailSender : String

    fun snedMail(to : String, subject : String, content : String) {

        val message = SimpleMailMessage().apply {
            from = mailSender
            setTo(to)
            setSubject(subject)
            text = content
        }

        javaMailSender.send(message)
    }
}
