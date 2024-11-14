import axios from "axios";

/* !!!!! 수정 필요 : 나중에 BASE_URL 하나로 합치기 */

// 카드 서비스 URL (9090)
export const BASE_URL = process.env.REACT_APP_LOCAL_API_URL;

// 유저 서비스 URL (8080)
export const USER_URL = process.env.REACT_APP_LOCAL_API_USER_URL;

// 플라스크 URL (5000)
export const FLASK_URL = process.env.REACT_APP_FLASK_API_USER_URL;

// json 요청 헤더
export const HEADERS = {
  // "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

// form-data 요청 헤더
export const FORMHEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "multipart/form-data"
};


// 카드서비스 요청 (9090)
export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: HEADERS,
});

// !!!!! 안 쓰면 삭제하기 - 카드서비스 form-data 요청(9090)
export const memberClient = axios.create({
  baseURL: BASE_URL,
  headers: FORMHEADERS,
});

// !!!!! 안 쓰면 삭제하기 - 유저서비스 요청 (8080)
export const userClient = axios.create({
  baseURL: USER_URL,
  headers: HEADERS,
});

// !!!!! 플라스크 요청 - (5000)
// export const flaskClient = axios.create({
//   baseURL: FLASK_URL,
//   headers: HEADERS,
// });
