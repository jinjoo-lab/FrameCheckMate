import React from 'react';
import TopBar from "../components/TopBar";
import { useNavigate, useParams } from 'react-router-dom';
import AllocateWork from './AllocateWork';
import styled from 'styled-components';

const BeforeWork = () => {

	const navigate = useNavigate();

	const { projectId, cardId } = useParams();


	return(
		<div>
			<TopBar title='작업 배정' logoutView={true}/>
			<RowContainer>
				<AllocateWork workingBefore={true}/>
			</RowContainer>
			<div style={{margin:"30px 0px"}} />
		</div>
	)
}

const RowContainer = styled.div`
	width:60%; 
	padding:60px 10px; 
	height:100%; 
	display:flex; 
	justify-content:center; 
	align-items:center; 
	margin:10px auto; 
	flex-direction:column;
	border:1px solid #ccc;
	box-shadow:0px 8px 7px rgba(0, 0, 0, 0.4);
  border-radius:10px;
`

const BeforeCloseButton = styled.button`
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
const BeforeFinButton = styled.button`
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
const ButtonContainer = styled.div`
	display:flex; 
	flex-direction:row; 
	justify-content:center;
`

export default BeforeWork