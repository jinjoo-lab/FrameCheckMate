import React, { useState, useEffect} from 'react'; // eslint-disable-line no-unused-vars
import TopBar from "../components/TopBar";
import { useNavigate, useParams } from 'react-router-dom';
import AllocateWork from './AllocateWork';
import styled from 'styled-components';
import { axiosClient } from '../axios';

const BeforeWork = () => {

	const navigate = useNavigate();

	const { projectId, cardId } = useParams();

	const closeButton = () => {
		navigate(`/mainWorkPage/${projectId}`);
		}

	const finButton = () => {
		navigate(`/mainWorkPage/${projectId}`)
	}

	return(
		<div>
			<TopBar title='작업 배정' logoutView={true}/>
			<RowContainer>
				<AllocateWork workingBefore={true}/>
				{/* <ButtonContainer>
					<BeforeFinButton onClick={finButton}>
						작업 배정
					</BeforeFinButton>
					<BeforeCloseButton onClick={closeButton}>
						닫기
					</BeforeCloseButton>
				</ButtonContainer> */}
			</RowContainer>
		</div>
	)
}

const RowContainer = styled.div`
	border:4px dashed black; 
	width:90%; padding:60px 10px; 
	height:100%; 
	display:flex; 
	justify-content:center; 
	align-items:center; 
	margin:0 auto; 
	flex-direction:column;
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