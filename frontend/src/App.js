import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import React, { useState } from "react";
import LoginSignUp from "./LoginSignUp.jsx";
import MainHomePage from "./MainHomePage.jsx";
import ManageMember from "./ManageMember.jsx";
import MainWorkPage from "./MainWorkPage.jsx";
import UploadVideo from "./UploadVideo.jsx";
import ImageProcessing from "./ImageProcessing.jsx";
import ImageProcessingResult from "./ImageProcessingResult.jsx";
import BeforeWork from "./BeforeWork.jsx";
import FeedbackAllocateWork from "./FeedbackAllocateWork.jsx";
import Working from './Working.jsx'
import ConfirmWorking from "./ConfirmWorking.jsx";
import DoneWork from "./DoneWork.jsx";
import ResultWork from "./ResultWork.jsx";
import WorkingLog from "./WorkingLog.jsx";

function App() {
  const loginCheck = false;

  return (
    <Routes>
      <Route path="/" element={<Navigate to={loginCheck ? "/mainHomePage" : "loginSignup"} />}/>
      <Route path="/loginSignup" element={<LoginSignUp />} />
      <Route path="/mainHomePage" element={<MainHomePage />} />
      <Route path="/manageMember" element={<ManageMember />} />
      <Route path="/mainWorkPage" element={<MainWorkPage />} />
      <Route path="/uploadVideo" element={<UploadVideo />} />
      <Route path="/imageProcessing" element={<ImageProcessing />} />
      <Route path="/imageProcessingResult" element={<ImageProcessingResult />} />
      <Route path="/beforeWork" element={<BeforeWork />} />
      <Route path="/feedbackAllocateWork" element={<FeedbackAllocateWork />} />
      <Route path="/working" element={<Working />} />
      <Route path="/confirmWorking" element={<ConfirmWorking />} />
      <Route path="/doneWork" element={<DoneWork />} />
      <Route path="/resultWork" element={<ResultWork />} />
      <Route path="/workingLog" element={<WorkingLog />} />
    </Routes>
  );
}

export default App;