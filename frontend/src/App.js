import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import LoginSignUp from "./pages/LoginSignUp.jsx";
import MainHomePage from "./pages/MainHomePage.jsx";
import ManageMember from "./pages/ManageMember.jsx";
import MainWorkPage from "./pages/MainWorkPage.jsx";
import UploadVideo from "./pages/UploadVideo.jsx";
import ImageProcessing from "./pages/ImageProcessing.jsx";
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
      <Route path="/manageMember/:projectId" element={<ManageMember />} />
      <Route path="/mainWorkPage/:projectId" element={<MainWorkPage />} />
      <Route path="/uploadVideo/:projectId" element={<UploadVideo />} />
      <Route path="/imageProcessing/:projectId" element={<ImageProcessing />} />
      <Route path="/beforeWork/:projectId/:cardId" element={<BeforeWork />} />
      <Route path="/feedbackAllocateWork" element={<FeedbackAllocateWork />} />
      <Route path="/working/:projectId/:cardId/:workerId" element={<Working />} />
      <Route path="/confirmWorking/:projectId/:cardId/:workerId" element={<ConfirmWorking />} />
      <Route path="/doneWork/:projectId/:cardId/:workerId" element={<DoneWork />} />
      <Route path="/resultWork/:projectId" element={<ResultWork />} />
      <Route path="/workingLog/:projectId/:cardId" element={<WorkingLog />} />
    </Routes>
  );
}

export default App;