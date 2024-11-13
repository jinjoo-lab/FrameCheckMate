package com.framecheckmate.notificationservice.entity

enum class NotificationType (
    val koName : String,
    val typeContent : String
) {
    MEMBER_SAVE("[FrameCheckMate] : 회원가입","Welcome ~ 회원가입이 완료되었습니다 !"),
    ALLOCATION("[FrameCheckMate] : 작업 배정","작업 배정이 완료되었습니다"),
    PENDING_CONFIRMATION("[FrameCheckMate] : 컨펌 요청","작업하신 내용이 컨펌 요청되었습니다"),
    PENDING_CONFIRMATION_REJECTED("[FrameCheckMate] : 컨펌 반려","관리자에 의해 컨펌 내용이 반려되었습니다"),
    COMPLETED("[FrameCheckMate] : 최종 승인","관리자에 의해 컨펌 내용이 승인되었습니다"),
    PROJECT_CREATE("[FrameCheckMate] : 프로젝트 생성","새로운 프로젝트가 생성되었습니다"),
    PROJECT_INVITE("[FrameCheckMate] : 프로젝트 초대","작업 프로젝트에 초대되었습니다")
}
