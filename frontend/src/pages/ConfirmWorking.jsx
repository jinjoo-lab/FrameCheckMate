import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import TopBar from "../components/TopBar";
import { useNavigate, Link, useParams } from 'react-router-dom'; // eslint-disable-line no-unused-vars
import FeedbackAllocateWork from './FeedbackAllocateWork';
import styled from 'styled-components'
import { axiosClient } from '../axios';

const ConfirmWorking = () => {

	const navigate = useNavigate();

	const { projectId, cardId } = useParams();

  const detailButton = () => {
    navigate(`/workingLog/${projectId}/${cardId}`)
  }

	return(
		<div>
			<TopBar title='컨펌' logoutView={true}/>
			<AlignContainer>
			<WorkingButton onClick={detailButton}>작업 로그</WorkingButton>
			</AlignContainer>
			<RowContainer>
				<FeedbackAllocateWork 
					confirmView={true} 
					commentView={false} 
					uploadView={false}/>
			</RowContainer>
		</div>
	)
}

const AlignContainer = styled.div`
  width:90%;
  padding:5px;
  display:flex;
  justify-content:flex-end;
  align-items:center;
  margin:10px auto;
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
const RowContainer = styled.div`
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
const ButtonAlign = styled.div`
	width:100%; 
	display:flex; 
	justify-content:center; 
	flex-direction:row;  
`
const ConfirmButton = styled.div`
	width:150px; 
	border:none; 
	border-radius:5px; 
	padding:10px 20px; 
	margin:10px 5px; 
	background-color:black; 
	text-align:center; 
	color:white; 
	font-weight:bold; 
	cursor:pointer;
`
const ConfirmCloseButton = styled.div`
	width:150px; 
	border:none; 
	border-radius:5px; 
	padding:10px 20px; 
	margin:10px 5px; 
	background-color:gray; 
	text-align:center; 
	color:white; 
	font-weight:bold; 
	cursor:pointer;
`
export default ConfirmWorking