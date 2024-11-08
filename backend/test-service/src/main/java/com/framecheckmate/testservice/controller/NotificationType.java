package com.framecheckmate.testservice.controller;

public enum NotificationType {
    MEMBER_SAVE("FrameCheckMate : [회원가입]", "Welcome ~ 회원가입이 완료되었습니다 !"),
    ALLOCATION("FrameCheckMate : [작업 배정]", "작업 배정이 완료되었습니다"),
    PENDING_CONFIRMATION("FrameCheckMate : [컨펌 요청]", "작업하신 내용이 컨펌 요청되었습니다"),
    PENDING_CONFIRMATION_REJECTED("FrameCheckMate : [컨펌 반려]", "관리자에 의해 컨펌 내용이 반려되었습니다"),
    COMPLETED("FrameCheckMate : [최종 승인]", "관리자에 의해 컨펌 내용이 승인되었습니다");

    private final String koName;
    private final String typeContent;

    // 생성자
    NotificationType(String koName, String typeContent) {
        this.koName = koName;
        this.typeContent = typeContent;
    }

    public String getKoName() {
        return koName;
    }

    public String getTypeContent() {
        return typeContent;
    }
}
