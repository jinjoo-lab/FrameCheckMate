import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import TopBar from "../components/TopBar";
import { useNavigate, Link } from 'react-router-dom'; // eslint-disable-line no-unused-vars
import FeedbackAllocateWork from './FeedbackAllocateWork';
import styled from 'styled-components';
import { axiosClient } from '../axios';

const Working = () => {

  const navigate = useNavigate();
  
  const closeButton = () => {
    navigate('/mainWorkPage');
  }

  const uploadButton = () => {
    navigate('/mainWorkPage')
  }

  const detailButton = () => {
    navigate('/workingLog')
  }

  return(
    <div>
      <TopBar title='작업 진행중' logoutView={true}/>
      <LogContainer>
        <WorkingButton onClick={detailButton}>작업 로그</WorkingButton>
      </LogContainer>
      <WorkingContainer>
        <FeedbackAllocateWork confirmView={false} commentView={true} workingBefore={false} uploadView={true}/>
        <ButtonsContainer>
          <WorkingButton onClick={uploadButton}>
            작업 완료
          </WorkingButton>
          <WorkingCloseButton onClick={closeButton}>
            닫기
          </WorkingCloseButton>
        </ButtonsContainer>
      </WorkingContainer>
    </div>
  )
}
const LogContainer = styled.div`
  width:90%;
  padding:5px;
  display:flex;
  justify-content:flex-end;
  align-items:center;
  margin:0 auto;
`
const WorkingContainer = styled.div`
  border:4px dashed black;
  width:90%;
  padding:5px;
  height:100%;
  display:flex;
  justify-content:center;
  align-items:center;
  margin:0 auto;
  flex-direction:column;
`
const WorkingButton = styled.button`
  width:150px;
  border:none;
  border-radius:5px;
  padding:10px 20px;
  margin:10px 5px;
  background-color:black;
  color:white;
  fontWeight:bold;
  cursor:pointer;
`
const WorkingCloseButton = styled.button`
  width:150px;
  border:none;
  border-radius:5px;
  padding:10px 20px;
  margin:10px 5px;
  background-color:gray;
  color:white;
  fontWeight:bold;
  cursor:pointer;
`
const ButtonsContainer = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:flex-end;
`

export default Working