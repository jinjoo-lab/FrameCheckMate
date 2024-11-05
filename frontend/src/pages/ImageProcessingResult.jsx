import React, { useState, useEffect, useRef } from 'react';
import TopBar from "../components/TopBar";
import { useNavigate, Link } from 'react-router-dom'; // eslint-disable-line no-unused-vars
import styled from 'styled-components'
import ReactPlayer from "react-player";
import { axiosClient } from '../axios';

const ImageProcessingResult = () => {

	const navigate = useNavigate();

	const [isPlaying, setIsPlaying] = useState(false);
	const playerRef = useRef(null); // ReactPlayer에 대한 ref 생성
	const [playTime, setPlayTime] = useState();
	
	const timeView = (seconds) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
	
		return `${String(hours).padStart(2, '0')}:
						${String(minutes).padStart(2, '0')}:
						${String(secs).padStart(2, '0')}`;
	};

	const moveSeconds = (event, seconds) => {
		event.preventDefault(); // 페이지 새로 고침 방지
		setIsPlaying(true);
		if (playerRef.current) {
			playerRef.current.seekTo(seconds);
		}
		setPlayTime(seconds);
	};

	const [splitResult, setSplitResult] = useState([])

	const splitImport = () => {
		const response = [
			{number:1, type:'a', file:'', time:'00:01:00~00:02:00'},
			{number:2, type:'b', file:'', time:'00:02:00~00:03:00'},
			{number:3, type:'c', file:'', time:'00:03:00~00:06:00'},
			{number:4, type:'d', file:'', time:'00:06:00~00:10:00'},
		]

		setSplitResult(response)
	}

	const mainButton = () => {
		navigate('/mainWorkPage');
	}

	const closeButton = () => {
		navigate('/mainWorkPage');
	}

	useEffect (() => {
		splitImport()
	}, [])

	return(
		<div>
			<TopBar title='최종 분할 결과' logoutView={true}/>
			<RowContainer>
				<VideoScroll>
					{ splitResult.length != 0 
					? (
						<>
							{splitResult.map((list) => 
								<VideoBox key={list.number}>
									<VideoList>
										{ list.file
										? (                    
											<div 
												style={{
													width:'40%', 
													height:'40%'}}>
												<ReactPlayer
													url={list.file}
													playing={isPlaying} // 재생 여부
													controls={true}
													width="100%"
													height="100%"
													ref={playerRef} // 여기서 ref 사용
													// onReady={() => setIsPlaying(true)} 
												/>
											</div>
											)
										: (
											<div 
												style={{
													width:'200px', 
													height:'150px', 
													border:'1px solid black'}}>
											</div>
											)}

										<VideoContents>{list.time}</VideoContents>
									</VideoList>
								</VideoBox>
							)}
						</>
						) 
					: (
						<NoReview>
							<p>결과를 기다리는 중입니다</p>
						</NoReview>
						)}
				</VideoScroll>
				<WorkingButton 
					onClick={mainButton}>작업페이지 이동
				</WorkingButton>
				<CloseButton 
					onClick={closeButton}>닫기
				</CloseButton>
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
const VideoScroll = styled.div`
  border:1px solid black; 
	width:90%; 
	height:300px; 
	margin:5px; 
	padding:0px 10px; 
	display:flex; 
	flex-direction:column; 
	overflow-y:auto;
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
const CloseButton = styled.button`
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
const VideoBox = styled.div`
  display:flex; 
	justify-content:center; 
	align-items:center; 
	margin:15px 0px; 
	width:90%; 
	padding:0px 5px;
`
const VideoList = styled.div`
	border-bottom:2px solid black; 
	width:85%; display:flex; 
	flex-direction:row; 
	justify-content:space-between; 
	align-items:center;	
`
const VideoContents = styled.div`
  font-size:12px; 
	font-weight:bold; 
	white-space:normal
`
const NoReview = styled.div`
  display:flex; 
	justify-content:center; 
	align-items:center; 
	height:100vh;
`
export default ImageProcessingResult