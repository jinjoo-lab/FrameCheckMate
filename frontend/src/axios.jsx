import axios from "axios";

export const BASE_URL = process.env.REACT_APP_LOCAL_API_URL;
export const USER_URL = process.env.REACT_APP_LOCAL_API_USER_URL;

export const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

export const FORMHEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "multipart/form-data"
};

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: HEADERS,
});
export const memberClient = axios.create({
  baseURL: BASE_URL,
  headers: FORMHEADERS,
});
export const userClient = axios.create({
  baseURL: USER_URL,
  headers: HEADERS,
});
// export const flaskClient = axios.create({
//   baseURL: USER_URL,
//   headers: HEADERS,
// });
