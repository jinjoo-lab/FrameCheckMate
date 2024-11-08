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

// 작업 배정
export const workAssign = async (cardId, data) => {
  // const accessToken = localStorage.getItem('accessToken');

  return axiosClient.post(`/api/card/${cardId}/assign`, data,
  //    {
  //   headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  // }
);
};

// 코멘트 저장
export const commentSave = async (cardId, data) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.post(`/api/card/${cardId}/comment`, data, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 코멘트 조회
export const commentView = async (cardId) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.get(`/api/card/${cardId}/confirm`, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 컨펌 저장
export const confirmSave = async (cardId, data) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.post(`/api/card/${cardId}/confirm`, data, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};


// todo 상태 변경
export const toDoChange = async (cardId, data) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.patch(`/api/card/${cardId}/toDo`, data, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};
// 작업 중으로 상태 변경
export const workingChange = async (cardId, data) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.patch(`/api/card/${cardId}/inProgress`, data, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 컨펌으로 상태 변경
export const confirmChange = async (cardId, data) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.patch(`/api/card/${cardId}/confirm`, data, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 작업 완료로 상태 변경
export const resultChange = async (cardId, data) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.patch(`/api/card/${cardId}/completion`, data, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 단일 카드 조회
export const cardView = async (cardId) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.get(`/api/card/${cardId}`, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 전체 카드 조회
export const allCardView = async (testId) => {
  // const accessToken = localStorage.getItem('accessToken');
  const ids = '123e4567-e89b-12d3-a456-426614174002'
  return axiosClient.get(`/api/card/${ids}`, 
  //   {
  //   headers: { Authorization: `${accessToken}`},
  // }
  );
};

// 작업 로그 조회
export const allLogView = async (projectId) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.get(`/api/card/log/${projectId}`, 
    {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  }
);
};

// 카드 영상 조회
export const cardVideoView = async (cardId) => {
  // const accessToken = localStorage.getItem('accessToken');

  return axiosClient.get(`/api/frame/card/${cardId}`, 
  //   {
  //   headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  // }
);
};

// 원본 영상 조회
export const originalVideoView = async (protectId) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.get(`/api/frame/original/${protectId}`, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 병합 영상 조회
export const mergeVideoView = async (protectId) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.get(`/api/frame/merged/${protectId}`, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 카드 영상 업로드
export const cardVideoUpload = async (cardId, data) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.post(`/api/frame/card/${cardId}`, data, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 원본 영상 업로드
export const originalVideoUpload = async (protectId, data) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.post(`/api/frame/original/${protectId}`, data, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 카드 영상 다운로드
export const cardVideoDownload = async (cardId) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.get(`/api/frame/card/${cardId}/download`, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 원본 영상 다운로드
export const originalVideoDownload = async (protectId) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.get(`/api/frame/original/${protectId}/download`, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 병합 영상 다운로드
export const mergedVideoDownload = async (protectId) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.get(`/api/frame/merged/${protectId}/download`, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 영상 분할 (카드 생성)
export const videoSplit = async (data) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.post(`/api/frame/split`, data, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 영상 병합
export const videoMerge = async (protectId, data) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.post(`/api/frame/merged/${protectId}`, data, {
    headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
  });
};

// 회원가입
export const signupUser = async (data) => {
  console.log(data)
  return userClient.post(`/api/member/join`, data, {
    headers: { "Requires-Auth": true },
  });
};
// // 회원가입
// export const signupUser = async (data) => {
//   console.log(data)
//   return axiosClient.post(`/api/member/join`, data, {
//     headers: { "Requires-Auth": true },
//   });
// };

// 로그인
export const loginUser = async (data) => {
  console.log(data)
  return axiosClient.post(`/api/member/login`, data);
};

// 유저 전체 이름 검색
export const findUser = async (name) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.get(`/api/member/find${name}`, {
    headers: { Authorization: `${accessToken}`},
  });
};

// 프로젝트 생성
export const createProject = async (data) => {
  const accessToken = localStorage.getItem('accessToken');

  return axiosClient.post(`/api/project`, data, {
    headers: { access: `${accessToken}` },
  });
}; 

// 프로젝트 조회
export const viewProject = async () => {
  const accessToken = localStorage.getItem('accessToken');

  console.log(`내 토큰은 ${accessToken}`)
  
  return userClient.get(`/api/project/my-project`, {
    headers: { access: `${accessToken}`},
  }
  // return axiosClient.get(`/api/project/my-project`, {
  //   headers: { access: `${accessToken}`},
  // }
);
};

// 프로젝트 초대하기
export const inviteProject = async (data) => {
  const accessToken = localStorage.getItem('accessToken');

  return userClient.post(`/api/project/invite`, data, {
    headers: { access: `${accessToken}`},
  });
  // return axiosClient.post(`/api/project/invite`, data, {
  //   headers: { access: `${accessToken}`},
  // });
};

// 프로젝트 멤버 조회
export const viewProjectMember = async (data) => {
  const accessToken = localStorage.getItem('accessToken');

  return memberClient.get(`/api/project/project-members`, data, {
    headers: { access: `${accessToken}` },
  });
};

// flask 서버
export const detectTime = async (data) => {
  const accessToken = localStorage.getItem('accessToken');

  return flaskClient.post('/predict'), data, {
    headers: { access: `${accessToken}` },
  }
}