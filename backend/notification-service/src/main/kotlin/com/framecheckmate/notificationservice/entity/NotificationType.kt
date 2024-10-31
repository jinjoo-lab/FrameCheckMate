package com.framecheckmate.notificationservice.entity

enum class NotificationType (
    val koName : String
) {
    MEMBER_SAVE("회원가입"),
    ALLOCATION("작업 배정"),
    PENDING_CONFIRMATION("컨펌 요청"),
    PENDING_CONFIRMATION_REJECTED("컨펌 반려"),
    COMPLETED("최종 승인")
}