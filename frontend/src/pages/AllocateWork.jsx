import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { ko } from "date-fns/locale";
import styled from 'styled-components';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactPlayer from "react-player";
import { axiosClient } from '../axios';
import { workAssign, cardVideoView } from '../api';
import { BASE_URL, USER_URL } from '../axios';

const AllocateWork = ({ workingBefore, uploadView }) => {

	const { projectId, cardId } = useParams();

	const navigate = useNavigate();

	const [fileURL, setFileURL] = useState('');
	const [isPlaying, setIsPlaying] = useState(false);
	const playerRef = useRef(null); // ReactPlayer에 대한 ref 생성
	const [playTime, setPlayTime] = useState();

	/* 작업자 배정인 경우 */
	// 작업자 
	const [ workContent, setWorkContet ] = useState('')
	const [ worker, setWorker ] = useState('')
	const [ workerEmail, setWorkerEmail ] = useState('')

	// 작업 기간 - 시작 날짜 & 종료 날짜
	const [ startDate, setStartDate ] = useState(null);
	const [ endDate, setEndDate ] = useState(null);

	// 현재 작업자 정보
	const [ nowWorker, setNowWorker ] = useState('')
	const [ nowContent, setNowContent ] = useState('')
	const [ nowWorkDate, setNowWorkDate ] = useState('')

	// 현재 프로젝트의 멤버 목록
	const [memberData, setMemberData] = useState([])

	const closeButton = () => {
		navigate(`/mainWorkPage/${projectId}`);
	}

	// 할당된 영상 정보
	const showVideo = async() => {
		try{
      const response = await fetch(`${BASE_URL}/api/frame/card/${cardId}`, {
        method: 'GET',
        withCredentials: true,
      });
      const answer = await response.text()
			setFileURL(answer)
			setIsPlaying(true)
		}catch(error){
			console.log(`에러 ${error}`)
		}
	}

	/* 현재 속한 프로젝트의 멤버 목록 불러오기 */
	const memberImport = async() => {
		try{
			const accessToken = localStorage.getItem('accessToken');
			const response = await fetch(`${USER_URL}/api/project/${projectId}/members`, {
				method: 'GET',
				headers: { access: `${accessToken}` },
			});
			const members = await response.json()
			console.log(members)
			setMemberData(members)
		}catch(error){
			console.log(error)
		}
	}

	// 작업 할당 요청
	const workAllot = async() => {
		try{
			const startDay = formatDate(startDate)
			const endDay = formatDate(endDate)
			const Data = {
				"workerId": worker,
				"workerEmail": workerEmail,
				"startDate": startDay,
				"endDate": endDay,
				"description": workContent,
			}

			const response = await fetch(`${BASE_URL}/api/card/${cardId}/assign`, {
        method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body:JSON.stringify(Data),
        // withCredentials: true,
      },
		);

		console.log(response)
		navigate(`/mainWorkPage/${projectId}`)

		}catch(error){
			console.log(`작업 배정 에러:${error}`)
		}

	}

	useEffect(() => {
		showVideo()
		memberImport()
	},[])

	// 달력 헤더
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
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const hour = String(date.getHours()).padStart(2, '0');
		const minute = String(date.getMinutes()).padStart(2, '0');
		return `${year}-${month}-${day}T${hour}:${minute}:00`;
	};

	const [selectedName, setSelectedName] = useState('');

  // 드롭다운에서 선택된 값을 처리하는 함수
  const handleSelectChange = (event) => {
    // 선택된 option의 value는 해당 id이므로
    const selectedId = event.target.value;
		console.log(selectedId)
    // 선택된 id에 맞는 name을 찾기
    const selectedItem = memberData.find(item => item.memberId === selectedId);
    // selectedName을 업데이트
    if (selectedItem) {
      setSelectedName(selectedItem.name);
			setWorker(selectedItem.memberId)
			setWorkerEmail(selectedItem.email)
    }
  };

	useEffect(() => {
		memberImport()
	},[])

	return(
		<div>
				{
					workingBefore
					?(
						<>
							<div>작업자 배정</div>
							<select 
								style={{width:'100%', height:'35px', margin:'10px 0px', borderRadius:'5px'}}
								onChange={handleSelectChange}>
								<option value="" style={{textAlign:'center'}}>선택하세요</option>
								{memberData.map((item) => (
									<option 
										style={{textAlign:'center'}}
										key={item.memberId} 
										value={item.memberId}>
										{item.name}
									</option>
								))}
							</select>
							{/* <WorkerInput 
								type="text" 
								onChange={(event) => setWorker(event.target.value)}/> */}
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
								showTimeSelect
								startDate={startDate}
								minDate={new Date()}
								endDate={endDate}
								locale={ko}
								dateFormat="yyyy-MM-dd HH:mm"
								placeholderText="시작 날짜"
								isClearable
								onKeyDown={(event) => event.preventDefault()}
								renderCustomHeader={customHeader}
							/>
							<DatePicker
								selected={endDate}
								onChange={(date) => setEndDate(date)}
								selectsEnd
								showTimeSelect
								startDate={startDate}
								endDate={endDate}
								minDate={startDate} // 시작 날짜 이후로만 선택하도록 하기
								locale={ko}
								dateFormat="yyyy-MM-dd HH:mm"
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
					/>
				</VideoBox>
				
				{ workingBefore 
				? (
					<ButtonBox>
					<DownloadButton onClick={workAllot}>
						작업 배정
					</DownloadButton>
					<UploadButton onClick={closeButton}>
						닫기
					</UploadButton>
				</ButtonBox>
				)
				: (
					<></>
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
		height:20px;
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
	align-items:center;
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
	border-radius:5px; 
	padding:10px 20px; 
	margin:10px 5px; 
	background-color:gray; 
	color:white; 
	font-weight:bold; 
	cursor:pointer;
`



export default AllocateWork