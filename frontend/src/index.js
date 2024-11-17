import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css"; 
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer } from "react-toastify";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <ToastContainer 
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        toastStyle={{
          minHeight:"100px",
          minWidth:"400px",
          textAlign:"center",
          fontWeight:"bold",
        }}
      />
      <App />
    </BrowserRouter>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
