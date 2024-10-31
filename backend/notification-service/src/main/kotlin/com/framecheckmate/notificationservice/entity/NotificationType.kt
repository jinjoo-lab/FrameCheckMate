package com.framecheckmate.notificationservice.entity

enum class NotificationType (
    val koName : String,
    val typeContent : String
) {
    MEMBER_SAVE("회원가입","Welcome ~ 회원가입이 완료되었습니다 !"),
    ALLOCATION("작업 배정","작업 배정이 완료되었습니다"),
    PENDING_CONFIRMATION("컨펌 요청","작업하신 내용이 컨펌 요청되었습니다"),
    PENDING_CONFIRMATION_REJECTED("컨펌 반려","관리자에 의해 컨펌 내용이 반려되었습니다"),
    COMPLETED("최종 승인","관리자에 의해 컨펌 내용이 승인되었습니다")
}