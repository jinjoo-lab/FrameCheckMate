//  import axios from './axios'
//  import { axiosClient } from './axios';



//  // 회원가입
// export const signupUser = async (data) => {
//   return axiosClient.post(`/signup`, data, {
//     headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
//   });
// };

// // 작업 배정
// export const workAssign = async (cardId, data) => {
//     return axiosClient.post(`/card/${cardId}/assign`, data, {
//       headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
//     });
//   };
  
//   // 단일 카드 조회
//   export const cardView = async (cardId) => {
//     return axiosClient.get(`/card/${cardId}`, {
//       headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
//     });
//   };
  
//   // 코멘트 저장
//   export const commentSave = async (cardKey) => {
//     return axiosClient.post(`/card/comment`, {
//       headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
//     });
//   };
  
//   // 컨펌 저장
//   export const confirmSave = async (cardKey) => {
//     return axiosClient.post(`/card/confirm`, {
//       headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
//     });
//   };
  
//   // 작업 중으로 상태 변경
//   export const workingChange = async (cardKey) => {
//     return axiosClient.patch(`/card/inprogress/${cardKey}`, {
//       headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
//     });
//   };
  
//   // 컨펌으로 상태 변경
//   export const confirmChange = async (cardKey) => {
//     return axiosClient.patch(`/card/confirm/${cardKey}`, {
//       headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
//     });
//   };
  
//   // 작업중으로 상태 변경
//   export const resultChange = async (cardKey) => {
//     return axiosClient.patch(`/card/completion/${cardKey}`, {
//       headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
//     });
//   };
  
//   // 전체 카드 조회
//   export const allCardView = async (cardKey) => {
//     return axiosClient.patch(`/card`, {
//       headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
//     });
//   };
  
//   // 작업 로그 조회
//   export const allLogView = async (cardKey) => {
//     return axiosClient.get(`/card-log`, {
//       headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
//     });
//   };
  
//   // 카드 영상 조회
//   export const cardVideoView = async (cardId) => {
//     return axiosClient.get(`/frame/card/${cardId}`, {
//       headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
//     });
//   };
  
//   // 원본 영상 조회
//   export const originalVideoView = async (cardId) => {
//     return axiosClient.get(`/frame/original/${protectId}`, {
//       headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
//     });
//   };
  
//   // 병합 영상 조회
//   export const mergeVideoView = async (cardId) => {
//     return axiosClient.get(`/frame/merged/${protectId}`, {
//       headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
//     });
//   };
  
//   // 카드 영상 업로드
//   export const cardVideoUpload = async (cardId) => {
//     return axiosClient.post(`/frame/card/${cardId}`, {
//       headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
//     });
//   };
  
//   // 원본 영상 업로드
//   export const originalVideoUpload = async (cardId) => {
//     return axiosClient.post(`/frame/original/${protectId}`, {
//       headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
//     });
//   };
  
//   // 카드 영상 다운로드
//   export const cardVideoDownload = async (cardId) => {
//     return axiosClient.get(`/frame/card/${cardId}/download`, {
//       headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
//     });
//   };
  
//   // 원본 영상 다운로드
//   export const originalVideoDownload = async (cardId) => {
//     return axiosClient.get(`/frame/original/${protectId}/download`, {
//       headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
//     });
//   };
  
//   // 병합 영상 다운로드
//   export const mergedVideoDownload = async (cardId) => {
//     return axiosClient.get(`/frame/merged/${protectId}/download`, {
//       headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
//     });
//   };
  
//   // 영상 분할 (카드 생성)
//   export const videoSplit = async (cardId) => {
//     return axiosClient.get(`/frame/split`, {
//       headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
//     });
//   };
  
//   // 영상 병힙
//   export const videoMerge = async (cardId) => {
//     return axiosClient.get(`/frame/merged/${protectId}`, {
//       headers: { Authorization: `${accessToken}`, "Requires-Auth": true },
//     });
//   };