// 작업 배정
export const workAssign = async (cardId, data) => {
  return axiosClient.post(`/api/card/${cardId}/assign`, data, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 코멘트 저장
export const commentSave = async (cardId) => {
  return axiosClient.post(`/api/card/${cardId}/comment`, data, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 코멘트 조회
export const commentView = async (cardId) => {
  return axiosClient.get(`/api/card/${cardId}/confirm`, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 컨펌 저장
export const confirmSave = async (cardId) => {
  return axiosClient.post(`/api/card/${cardId}/confirm`, data, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};


// todo 상태 변경
export const toDoChange = async (cardId) => {
  return axiosClient.patch(`/api/card/${cardId}/toDo`, data, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};
// 작업 중으로 상태 변경
export const workingChange = async (cardId) => {
  return axiosClient.patch(`/api/card/${cardId}/inProgress`, data, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 컨펌으로 상태 변경
export const confirmChange = async (cardId) => {
  return axiosClient.patch(`/api/card/${cardId}/confirm`, data, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 작업 완료로 상태 변경
export const resultChange = async (cardId) => {
  return axiosClient.patch(`/api/card/${cardId}/completion`, data, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 단일 카드 조회
export const cardView = async (cardId) => {
  return axiosClient.get(`/api/card/${cardId}`, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 전체 카드 조회
export const allCardView = async (projectId) => {
  return axiosClient.get(`/api/card/${projectId}`, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 작업 로그 조회
export const allLogView = async (projectId) => {
  return axiosClient.get(`/api/card/log/${projectId}`, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 카드 영상 조회
export const cardVideoView = async (cardId) => {
  return axiosClient.get(`/api/frame/card/${cardId}`, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 원본 영상 조회
export const originalVideoView = async (protectId) => {
  return axiosClient.get(`/api/frame/original/${protectId}`, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 병합 영상 조회
export const mergeVideoView = async (protectId) => {
  return axiosClient.get(`/api/frame/merged/${protectId}`, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 카드 영상 업로드
export const cardVideoUpload = async (cardId) => {
  return axiosClient.post(`/api/frame/card/${cardId}`, data, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 원본 영상 업로드
export const originalVideoUpload = async (protectId) => {
  return axiosClient.post(`/api/frame/original/${protectId}`, data, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 카드 영상 다운로드
export const cardVideoDownload = async (cardId) => {
  return axiosClient.get(`/api/frame/card/${cardId}/download`, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 원본 영상 다운로드
export const originalVideoDownload = async (protectId) => {
  return axiosClient.get(`/api/frame/original/${protectId}/download`, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 병합 영상 다운로드
export const mergedVideoDownload = async (protectId) => {
  return axiosClient.get(`/api/frame/merged/${protectId}/download`, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 영상 분할 (카드 생성)
export const videoSplit = async () => {
  return axiosClient.post(`/api/frame/split`, data, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 영상 병합
export const videoMerge = async (protectId) => {
  return axiosClient.post(`/api/frame/merged/${protectId}`, data, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 회원가입
export const signupUser = async () => {
  return axiosClient.post(`/api/member/join`, data, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 로그인
export const loginUser = async () => {
  return axiosClient.post(`/api/member/login`, data, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 유저 전체 이름 검색
export const findUser = async () => {
  return axiosClient.get(`/api/member?name=${name}`, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 프로젝트 생성
export const createProject = async () => {
  return axiosClient.post(`/api/project`, data, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 프로젝트 조회
export const viewProject = async () => {
  return axiosClient.get(`/api/my-project`, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 프로젝트 초대하기
export const inviteProject = async () => {
  return axiosClient.post(`/api/invite`, data, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 프로젝트 멤버 조회
export const viewProjectMember = async () => {
  return axiosClient.get(`/api/project-members`, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};