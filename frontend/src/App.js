import { Routes, Route, Navigate } from "react-router-dom";
import React, { useState } from "react";
import LoginSignUp from "./pages/LoginSignUp.jsx";
import MainHomePage from "./pages/MainHomePage.jsx";
import ManageMember from "./pages/ManageMember.jsx";
import MainWorkPage from "./pages/MainWorkPage.jsx";
import UploadVideo from "./pages/UploadVideo.jsx";
import ImageProcessing from "./pages/ImageProcessing.jsx";
import ImageProcessingResult from "./pages/ImageProcessingResult.jsx";
import BeforeWork from "./pages/BeforeWork.jsx";
import FeedbackAllocateWork from "./pages/FeedbackAllocateWork.jsx";
import Working from './pages/Working.jsx'
import ConfirmWorking from "./pages/ConfirmWorking.jsx";
import DoneWork from "./pages/DoneWork.jsx";
import ResultWork from "./pages/ResultWork.jsx";
import WorkingLog from "./pages/WorkingLog.jsx";

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