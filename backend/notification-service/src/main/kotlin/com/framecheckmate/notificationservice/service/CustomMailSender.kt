package com.framecheckmate.notificationservice.service

import jakarta.mail.internet.InternetAddress
import jakarta.mail.internet.MimeMessage
import org.springframework.beans.factory.annotation.Value
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service

@Service
class CustomMailSender(
    private val javaMailSender : JavaMailSender
) {
    @Value("\${spring.mail.username}")
    lateinit var mailSender : String

    fun snedMail(to : String, subject : String, content : String) {

        var message : MimeMessage = javaMailSender.createMimeMessage()

        message.addRecipients(MimeMessage.RecipientType.TO, to)
        message.subject = subject

        message.setText(content,"utf-8")
        message.setFrom(InternetAddress(mailSender,"FrameCheckMate"))

        javaMailSender.send(message)
    }
}
