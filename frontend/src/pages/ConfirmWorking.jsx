import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import TopBar from "../components/TopBar";
import { useNavigate, Link, useParams } from 'react-router-dom'; // eslint-disable-line no-unused-vars
import FeedbackAllocateWork from './FeedbackAllocateWork';
import styled from 'styled-components'
import { axiosClient } from '../axios';

const ConfirmWorking = () => {

	const navigate = useNavigate();

	const { projectId, cardId } = useParams();

	return(
		<div>
			<TopBar title='컨펌' logoutView={true}/>
			<RowContainer>
				<FeedbackAllocateWork 
					confirmView={true} 
					commentView={false} 
					uploadView={false}/>
			</RowContainer>
		</div>
	)
}

const RowContainer = styled.div`
	border:4px dashed black; 
	width:90%; 
	padding:60px 10px; 
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