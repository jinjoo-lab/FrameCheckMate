import React from 'react'; 
import TopBar from "../components/TopBar";
import { useNavigate, useParams } from 'react-router-dom';
import FeedbackAllocateWork from './FeedbackAllocateWork';
import styled from 'styled-components';

const Working = () => {
  
  const navigate = useNavigate();
  
  const { projectId, cardId } = useParams();

  const detailButton = () => {
    navigate(`/workingLog/${projectId}/${cardId}`)
  }

  return(
    <div>
      <TopBar title='작업 진행중' logoutView={true}/>
      <LogContainer>
        <WorkingButton onClick={detailButton}>작업 로그</WorkingButton>
      </LogContainer>
      <WorkingContainer>
        <FeedbackAllocateWork 
          confirmView={false} 
          commentView={true} 
          uploadView={true}/>
      </WorkingContainer>
      <div style={{marginBottom:"50px"}}></div>
    </div>
  )
}
const LogContainer = styled.div`
  width:90%;
  padding:0px;
  display:flex;
  justify-content:flex-end;
  align-items:center;
  margin:10px auto;
`
const WorkingContainer = styled.div`
  border:1px solid #ccc;
  	box-shadow:0px 8px 7px rgba(0, 0, 0, 0.4);
  // background-color:#ccc;
  border-radius:10px;
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