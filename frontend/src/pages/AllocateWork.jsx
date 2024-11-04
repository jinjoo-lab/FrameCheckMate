import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { ko } from "date-fns/locale";
import styled from 'styled-components';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactPlayer from "react-player";

const AllocateWork = ({ workingBefore, uploadView }) => {

	const navigate = useNavigate();

	const [fileURL, setFileURL] = useState('');
	const [isPlaying, setIsPlaying] = useState(false);
	const playerRef = useRef(null); // ReactPlayer에 대한 ref 생성
	const [playTime, setPlayTime] = useState();

	const videoPlaying = (event) => {
		const file = event.target.files[0];
		if (file) {
			const url = URL.createObjectURL(file);
			setFileURL(url);
			setIsPlaying(true); // 파일 선택 후 자동으로 재생
		}
	};

	// 동영상 총 시간 계산
	const goDuration = (a) => {
		setPlayTime(a);
		console.log(`총 시간${a}`);
	};

	// 작업자 
	const [ workContent, setWorkContet ] = useState('')
	const [ worker, setWorker ] = useState('')

	// 작업 기간 - 시작 날짜 & 종료 날짜
	const [ startDate, setStartDate ] = useState(null);
	const [ endDate, setEndDate ] = useState(null);

	// 현재 작업자 정보
	const [ nowWorker, setNowWorker ] = useState('dd')
	const [ nowContent, setNowContent ] = useState('dd')
	const [ nowWorkDate, setNowWorkDate ] = useState('dd')


	const uploadVideo = () => {
			
	}

	const downloadVideo = () => {

	}

	const customHeader = ({ date, decreaseMonth, increaseMonth }) => {
		const month = date.getMonth();
		const year = date.getFullYear();

		return (
			<div 
				style={{ 
					display: 'flex', 
					justifyContent: 'space-between', 
					alignItems: 'center' }}>
				<button 
					style={{margin:'0px 5px'}} 
					onClick={decreaseMonth}>{"<"}</button>
				<span>{year}년 {month + 1}월</span>
				<button 
					style={{margin:'0px 5px'}} 
					onClick={increaseMonth}>{">"}</button>
			</div>
		);
	};

	// 날짜 변환해서 보내줘야 함
	const formatDate = (date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0'); // 1월은 0이므로 +1
		const day = String(date.getDate()).padStart(2, '0');

		return `${year}-${month}-${day}`;
	};

	useEffect(() => {

	},[])

	return(
		<div>
				{
					workingBefore
					?(
						<>
							<div>작업자 배정</div>
							<WorkerInput 
								type="text" 
								onChange={(event) => setWorker(event.target.value)}/>
						</>
					)
					:(
						<>
							<div>작업자</div>
							<WorkView>
								<div 
									style={{padding:"5px"}}>
									{nowWorker}
								</div>
							</WorkView>
						</>
					)
				}
				
				<div>작업 내용</div>
				{
					workingBefore
					?(
						<WorkerInput
							type="text" 
							onChange={(event) => setWorkContet(event.target.value)}/>
					)
					:(
						<WorkView>
							<div 
								style={{padding:"5px"}}>
								{nowContent}
							</div>
						</WorkView>
					)
				}

				<div>작업 기간</div>
				{
					workingBefore
					?(
						<div 
							style={{ 
								display: "flex", 
								alignItems:"center", 
								margin:"10px 0px"}}>
							<DateStyle />
							<DatePicker
								selected={startDate}
								onChange={(date) => {
									if (endDate && endDate < date) {
										setEndDate(null); // 시작 날짜가 종료 날짜 이후로 선택되면 종료 날짜 초기화 시키기
									}
									setStartDate(date);
								}}
								selectsStart
								startDate={startDate}
								minDate={new Date()}
								endDate={endDate}
								locale={ko}
								dateFormat="yyyy-MM-dd"
								placeholderText="시작 날짜"
								isClearable
								onKeyDown={(event) => event.preventDefault()}
								renderCustomHeader={customHeader}
							/>
							<DatePicker
								selected={endDate}
								onChange={(date) => setEndDate(date)}
								selectsEnd
								startDate={startDate}
								endDate={endDate}
								minDate={startDate} // 시작 날짜 이후로만 선택하도록 하기
								locale={ko}
								dateFormat="yyyy-MM-dd"
								placeholderText="종료 날짜"
								isClearable
								onKeyDown={(event) => event.preventDefault()}
								disabled={!startDate}
								renderCustomHeader={customHeader}
							/>
						</div>
					)
					:(
						<WorkView>
							<div style={{padding:"5px"}}>
								{nowWorkDate}
							</div>
						</WorkView>
					)
				}

				<div>작업 영상</div>
				<VideoBox>
					<ReactPlayer
						url={fileURL}
						playing={isPlaying} // 재생 여부
						controls={true}
						width="100%"
						height="100%"
						ref={playerRef} // 여기서 ref 사용
						onDuration={goDuration}
					/>
				</VideoBox>
				
				{ workingBefore ? null : (
					<ButtonBox>
						<DownloadButton onClick={downloadVideo}>
							다운로드
						</DownloadButton>
						{ uploadView ?
						<UploadButton onClick={uploadVideo}>
							업로드
						</UploadButton> : null}
					</ButtonBox>
				)}
		</div>
	)
}

const WorkerInput = styled.input`
	border: 1px solid gray; 
	border-radius: 10px; 
	margin: 10px 0px; 
	height: 30px; 
	width: 350px;
`

const DateStyle = createGlobalStyle`
	.react-datepicker__input-container input {
		border: 1px solid gray;
		border-radius: 10px;
		margin: 3px 2px;
		padding: 5px 5px;
		text-align: center;
		cursor: pointer;
		caret-color: transparent;
	}
	.react-datepicker__input-container input:disabled {
		background-color: #f0f0f0; 
		color: #a9a9a9; 
	}
`
const VideoBox = styled.div`
	margin-top:20px; 
	width:100%; 
	height:200px; 
	border:1px solid black;
`
const WorkView = styled.div`
	width:100%; 
	height:30px; 
	border:1px solid black; 
	margin:10px 0px;
`

const ButtonBox = styled.div`
	display:flex; 
	flex-direction:row; 
	justify-content:center;
`

const DownloadButton = styled.button`
	width:150px; 
	border:none; 
	border-radius:5px; 
	padding:10px 20px; 
	margin:10px 5px; 
	background-color:black; 
	color:white; 
	font-weight:bold; 
	cursor:pointer;
`

const UploadButton = styled.button`
	width:150px; 
	border:none; 
	order-radius:5px; 
	padding:10px 20px; 
	margin:10px 5px; 
	background-color:gray; 
	color:white; 
	font-weight:bold; 
	cursor:pointer;
`



export default AllocateWork