package com.framecheckmate.notificationservice.service

import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service

@Service
class CustomMailSender(
    private val javaMailSender : JavaMailSender
) {

    fun snedMail(to : String, subject : String, content : String) {
        val message = SimpleMailMessage().apply {
            from = "drasgon@naver.com"
            setTo(to)
            setSubject(subject)
            text = content
        }

        javaMailSender.send(message)
    }
}
