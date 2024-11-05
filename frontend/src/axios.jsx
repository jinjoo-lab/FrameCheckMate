import axios from "axios";

// export const BASE_URL = process.env.REACT_APP_API_URL;
export const BASE_URL = process.env.REACT_APP_LOCAL_API_URL;

export const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: HEADERS,
});