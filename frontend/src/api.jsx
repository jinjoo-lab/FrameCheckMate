import { axiosClient } from "./axios";
import { memberClient } from "./axios";
import { userClient } from "./axios";

// 요청 인터셉터 설정
axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      config.headers.Authorization = `${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* ★★★ 카드 서비스 ★★★ */

// 작업 배정
export const workAssign = async (cardId, data) => {
  // const accessToken = localStorage.getItem('accessToken');

  return axiosClient.post(`/api/card/${cardId}/assign`, data,
  //    {
  //   headers: { access: `${accessToken}`},
  // }
);
};

// 코멘트 저장
export const commentSave = async (cardId, data) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.post(`/api/card/${cardId}/comment`, data, {
    headers: { access: `${accessToken}` },
  });
};

// 코멘트 조회
export const commentView = async (cardId) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.get(`/api/card/${cardId}/confirm`, {
    headers: { access: `${accessToken}` },
  });
};

// 컨펌 저장
export const confirmSave = async (cardId, data) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.post(`/api/card/${cardId}/confirm`, data, {
    headers: { access: `${accessToken}` },
  });
};


// 사용 테스트 - todo 상태 변경
export const toDoChange = async (cardId) => {
  const accessToken = localStorage.getItem('accessToken');
  return axiosClient.patch(`/api/card/${cardId}/toDo`, {
    headers: { access: `${accessToken}` },
  });
};

// 사용 테스트 - 작업 중으로 상태 변경
export const workingChange = async (cardId) => {
  const accessToken = localStorage.getItem('accessToken');
  return axiosClient.patch(`/api/card/${cardId}/inProgress`, {
    headers: { access: `${accessToken}` },
  });
};

// 사용 테스트 - 컨펌으로 상태 변경
export const confirmChange = async (cardId) => {
  const accessToken = localStorage.getItem('accessToken');
  return axiosClient.patch(`/api/card/${cardId}/confirm`, {
    headers: { access: `${accessToken}` },
  });
};

// 사용 테스트 - 작업 완료로 상태 변경
export const resultChange = async (cardId) => {
  const accessToken = localStorage.getItem('accessToken');
  return axiosClient.patch(`/api/card/${cardId}/completion`, {
    headers: { access: `${accessToken}` },
  });
};

// 단일 카드 조회
export const cardView = async (cardId) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.get(`/api/card/${cardId}`, {
    headers: { access: `${accessToken}` },
  });
};

// 사용 x - 전체 카드 조회
export const allCardView = async (testId) => {
  // const accessToken = localStorage.getItem('accessToken');
  const ids = '123e4567-e89b-12d3-a456-426614174002'
  return axiosClient.get(`/api/card/${ids}`, 
  //   {
  //   headers: { access: `${accessToken}`},
  // }
  );
};

// 작업 로그 조회
export const allLogView = async (cardId) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.get(`/api/card/${cardId}/logs`, 
    {
    headers: { access: `${accessToken}` },
  }
);
};

// 카드 영상 조회
export const cardVideoView = async (cardId) => {
  // const accessToken = localStorage.getItem('accessToken');

  return axiosClient.get(`/api/frame/card/${cardId}`, 
  //   {
  //   headers: { access: `${accessToken}` },
  // }
);
};

// 원본 영상 조회
export const originalVideoView = async (protectId) => {
  const accessToken = localStorage.getItem('accessToken');
  return axiosClient.get(`/api/frame/original/${protectId}`, {
    headers: { access: `${accessToken}` },
  });
};

// 병합 영상 조회
export const mergeVideoView = async (protectId) => {
  const accessToken = localStorage.getItem('accessToken');
  return axiosClient.get(`/api/frame/merged/${protectId}`, {
    headers: { access: `${accessToken}` },
  });
};

// 카드 영상 업로드
export const cardVideoUpload = async (cardId, data) => {
  const accessToken = localStorage.getItem('accessToken');
  return axiosClient.post(`/api/frame/card/${cardId}`, data, {
    headers: { access: `${accessToken}` },
  });
};

// 원본 영상 업로드
export const originalVideoUpload = async (protectId, data) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.post(`/api/frame/original/${protectId}`, data, {
    headers: { access: `${accessToken}` },
  });
};

// 카드 영상 다운로드
export const cardVideoDownload = async (cardId) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.get(`/api/frame/card/${cardId}/download`, {
    headers: { access: `${accessToken}` },
  });
};

// 원본 영상 다운로드
export const originalVideoDownload = async (protectId) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.get(`/api/frame/original/${protectId}/download`, {
    headers: { access: `${accessToken}` },
  });
};

// 병합 영상 다운로드
export const mergedVideoDownload = async (protectId) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.get(`/api/frame/merged/${protectId}/download`, {
    headers: { access: `${accessToken}` },
  });
};

// 영상 분할 (카드 생성)
export const videoSplit = async (data) => {
  const accessToken = localStorage.getItem('accessToken');
  return axiosClient.post(`/api/frame/split`, data, {
    headers: { access: `${accessToken}` },
  });
};

// 영상 병합
export const videoMerge = async (protectId) => {
  const accessToken = localStorage.getItem('accessToken');
  return axiosClient.post(`/api/frame/merged/${protectId}`, {
    headers: { access: `${accessToken}` },
  });
};


/* ★★★ 유저 서비스 ★★★ */

// 사용 o - 회원가입
export const signupUser = async (data) => {
  return userClient.post(`/api/member/join`, data);
};

// 사용 x - 로그인
export const loginUser = async (data) => {
  return axiosClient.post(`/api/member/login`, data);
};

// 사용 x - 유저 전체 이름 검색
export const findUser = async (name) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.get(`/api/member/find${name}`, {
    headers: { access: `${accessToken}`},
  });
};

// 사용 x - 프로젝트 생성
export const createProject = async (data) => {
  const accessToken = localStorage.getItem('accessToken');
  return axiosClient.post(`/api/project`, data, {
    headers: { access: `${accessToken}` },
  });
}; 

// 사용 o - 프로젝트 조회
export const viewProject = async () => {
  const accessToken = localStorage.getItem('accessToken');
  return userClient.get(`/api/project/my-project`, {
    headers: { access: `${accessToken}`},
  });
};

// 사용 o - 프로젝트 초대하기
export const inviteProject = async (data) => {
  const accessToken = localStorage.getItem('accessToken');
  return userClient.post(`/api/project/invite`, data, {
    headers: { access: `${accessToken}`},
  });
};

// 사용 x - 프로젝트 멤버 조회
export const viewProjectMember = async (data) => {
  const accessToken = localStorage.getItem('accessToken');
  return memberClient.get(`/api/project/project-members`, data, {
    headers: { access: `${accessToken}` },
  });
};

// // flask 서버
// export const detectTime = async (data) => {
//   const accessToken = localStorage.getItem('accessToken');

//   return flaskClient.post('/predict'), data, {
//     headers: { access: `${accessToken}` },
//   }
// }