import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom'; // eslint-disable-line no-unused-vars
import AllocateWork from './AllocateWork';
import styled from 'styled-components';
import { axiosClient } from '../axios';
import ReactPlayer from "react-player";
import { createGlobalStyle } from 'styled-components';
import { cardView, commentSave, confirmSave } from '../api';
import { BASE_URL, USER_URL } from '../axios';
import { FcVoicePresentation } from "react-icons/fc";
import { FaUserCircle } from "react-icons/fa";

const FeedbackAllocateWork = ({ confirmView, commentView, uploadView }) => {

	const navigate = useNavigate();

	const { projectId, cardId, workerId } = useParams();

	// 현재 작업자 정보
	const [ nowWorker, setNowWorker ] = useState('')
	const [ nowContent, setNowContent ] = useState('')
	const [ startDate, setStartDate ] = useState('')
	const [ endDate, setEndDate ] = useState('')
	const [fileURL, setFileURL] = useState('');
	const [isPlaying, setIsPlaying] = useState(false);
	const playerRef = useRef(null); // ReactPlayer에 대한 ref 생성
	const [playTime, setPlayTime] = useState();

  // 동영상 총 시간 계산
	const goDuration = (a) => {
		setPlayTime(a);
	};

	/* 직접 영상 업로드 & 카드 영상 업로드 요청 */
	const videoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFileURL(url);
      setIsPlaying(false); // 파일 선택 후 자동으로 재생
    }

		try{
			const url = URL.createObjectURL(file);
      const responses = await fetch(url); // URL에서 파일을 fetch
      const blob = await responses.blob(); // 파일을 Blob으로 변환

      const formData = new FormData();
      formData.append('file', blob, 'video.mp4');
      
      const response = await fetch(`${BASE_URL}/api/frame/card/${cardId}`, {
        method: 'POST',
        body: formData,
        headers:{}
      },);
      const text = await response.json();
			alert('영상 업로드가 완료되었습니다')
		}catch(error){
			console.log(`영상 업로드 문제 ${error}`)
		}
  };

	/* 비디오 다운로드 */
	const downloadVideo = async () => {
		try{
			const response = await fetch(`${BASE_URL}/api/frame/card/${cardId}/download`, {
        method: 'GET',
        headers:{}
      },);

			const blob = await response.blob();
      // Blob URL을 만들어서 다운로드
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'work-video.mp4'; 
      link.click();

      // 링크 제거
      URL.revokeObjectURL(link.href);

		}catch(error){
			console.log(`다운로드 에러${error}`)
		}
	}

	// 현재 카드의 컨펌 정보, 코멘트 정보
	const [confirmList, setConfirmList] = useState([])
	const [commentList, setCommentList] = useState([])

	// 현재 카드에 입력하는 컨펌, 코멘트
	const [confirms, setConfirms] = useState('')
	const [comments, setComments] = useState('')

	// 프로젝트 멤버 불러오기
	const [memberData, setMemberData] = useState([])

	/* 컨펌 저장 */
	const confirmSubmit = async (event, confirms) => {
		try{
			const Data = {
				content : confirms
			}
			const response = await fetch(`${BASE_URL}/api/card/${cardId}/confirm`, {
				method: 'POST',
				headers:{
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(Data),
			});
			if (nowWorker.length == 0){
				const goAllot = beforeMove()
			}
			else{
				const goWorking = workingMove()
			}
		}catch(error){
			console.log(error)
		}
	}

	  /* 작업중으로 이동시키기 */
		const workingMove = async () => {
			try{
				const response = await fetch(`${BASE_URL}/api/card/${cardId}/inProgress`, {
					method: 'PATCH', 
					withCredentials: true,
				});
				alert('컨펌 요청이 완료되었습니다')
				navigate(`/mainWorkPage/${projectId}`)
			}catch(error){
				console.log(error)
			}
		}

	  /* 작업 배정으로 이동시키기 */
		const beforeMove = async () => {
			try{
				const response = await fetch(`${BASE_URL}/api/card/${cardId}/toDo`, {
					method: 'PATCH', 
					withCredentials: true,
				});
				alert('컨펌 요청이 완료되었습니다')
				navigate(`/mainWorkPage/${projectId}`)
			}catch(error){
				console.log(error)
			}
		}

		
	/* 코멘트 저장 */
	const commentSubmit = async (event, comments) => {
		try{
			// !!!!! userid 받아와야 함
			const myId = localStorage.getItem('myId')
			try{
				const Data = {
					userId : myId,
					content : comments
				}
				const response = await fetch(`${BASE_URL}/api/card/${cardId}/comment`, {
					method: 'POST',
					headers:{
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(Data),
				});
				alert('코멘트 저장이 완료되었습니다')
				setComments('')
			}catch(error){
				console.log(`실패:${error}`)
			}
			cardImport()
		}catch(error){
			console.log(error)
		}
	}

  /* 카드 조회 */
  const cardImport = async() => {
		try{
      const response = await fetch(`${BASE_URL}/api/card/${cardId}/detail`, {
        method: 'GET',
        withCredentials: true,
      });
      const answer = await response.json()
      if (answer && answer.workerId) {
				setNowWorker(answer.workerId)
      }
      if (answer && answer.startDate) {
				setStartDate(answer.startDate)
      }
      if (answer && answer.endDate) {
				setEndDate(answer.endDate)
      }
			if (answer && answer.confirms){
				setConfirmList(answer.confirms)
			}
			if (answer && answer.comments){
				setCommentList(answer.comments)
			}
			if (answer && answer.description){
				setNowContent(answer.description)
			}
			if (answer && answer.frameInfo){
				setFileURL(answer.frameInfo)
			}
    }catch(error){
      console.log(`카드 요청 조회 문제 ${error}`)
    }
  }

	/* 닫기 버튼 */
	const closeButton = () => {
		navigate(`/mainWorkPage/${projectId}`);
	}

	/* 내 정보 조회 */
	const myInfo = async() => {
		try{
			const emailInfo = localStorage.getItem('myEmail');
			//
		}catch(error){
			console.log(`${error}`)
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
			// const myId = localStorage.getItem('myId')
			const workerInfo = members.find(data => data.memberId === workerId);
			const infoName = workerInfo.name
			setNowWorker(infoName)
			// console.log(workerInfo)
			// const cardWorker = (workerInfo.memberId)
			// console.log(`my Id : ${myId}`)
			// console.log(`workerIds : ${cardWorker}`)
			setMemberData(members)
		}catch(error){
			console.log(error)
		}
	}

  const getCommentName = (workerId) => {
    const worker = memberData.find((worker) => worker.memberId == workerId);
    return worker ? worker.name : '이름을 가져올 수 없습니다.';
  };

	useEffect(() => {
		/* 처음에 카드 정보, 컨펌 목록, 코멘트 목록 불러오기 */
		cardImport()
	}, [])
	
	useEffect(() => {
		memberImport()
	}, [])

	return(
		<FeedbackContainer>
			<div style={{ width:'45%' }}>
        <div>작업자</div>
        <WorkView>
          <div 
            style={{padding:"5px"}}>
            {nowWorker}
          </div>
        </WorkView>

				<div>작업 내용</div>
          <WorkView>
            <div 
              style={{padding:"5px"}}>
              {nowContent}
            </div>
          </WorkView>

				<div>작업 기간</div>
          <WorkView>
            <div
							style={{fontSize:"13px", textAlign:"center", padding:"5px"}}>
              {startDate} ~ 
							{endDate}
            </div>
          </WorkView>

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

					<ButtonBox>
						<DownloadButton onClick={downloadVideo}>
							다운로드
						</DownloadButton>
						{ uploadView 
						?
            <UploadStyle>
						업로드
						<input 
							type="file" 
							accept="video/*" 
							style={{ display: "none" }} 
							onChange={videoUpload} />
						</UploadStyle>
							: <div style={{width:'150px'}}></div>}
					</ButtonBox>
			</div>
			<div style={{ width:'45%' }}>

			<div style={{ margin:'15px', fontWeight:"bold"}}>컨펌 내용</div>
			<ReviewScroll>
				{ confirmList.length == 0 
				? (
					<NoReview>
						<p>컨펌 내용이 없습니다</p>
					</NoReview>
					)
				: (
						<>
						{ confirmList.map((list) => 
							<ReviewAlign key={list.createdAt}>
								<ReviewStyle>
									<ReviewText>{list.createdAt}<br />{list.content}</ReviewText>
								</ReviewStyle>
							</ReviewAlign>
						)}
						</>
					)
				}
			</ReviewScroll>

			{ confirmView 
				? (
					<ReviewInputContainer> 
						<ReviewInput 
							value={confirms} 
							onChange={(event) => setConfirms(event.target.value)} />
						<ReviewButton 
							onClick={(event) => confirmSubmit(event, confirms)}>
							작업 재요청
						</ReviewButton>
					</ReviewInputContainer>
					)
				: null
			}

			<div style={{ margin:'15px', fontWeight:"bold"}}>코멘트</div>
			<ReviewScroll>
				{ commentList.length == 0 
				? (
						<NoReview>
							<p>코멘트가 없습니다</p>
						</NoReview>
					)
				: (
						<>
						{ commentList.map((list) => 
							<ReviewAlign key={list.createdAt}>
								<ReviewStyle>
									<div style={{ display:"flex", alignItems:"center", margin:"0px 10px"}}>
										<FaUserCircle size={25}/>
									</div>
									<ReviewText>
										<div style={{padding:"1px 5px"}}> 
										{getCommentName(list.userId)}&nbsp;&nbsp;
										{list.createdAt}<br />
										{list.content}
										</div>
									</ReviewText>
								</ReviewStyle>
							</ReviewAlign>
						)}
						</>
					)}
			</ReviewScroll>

			{ commentView 
				? (
					<ReviewInputContainer> 
						<ReviewInput 
							value={comments}
							onChange={(event) => setComments(event.target.value)}/>
						<ReviewButton 
							onClick={(event) => commentSubmit(event, comments)}>
							작성하기
						</ReviewButton>
					</ReviewInputContainer>
					) 
				: null
			}
			<ButtonAlign>
					{/* <FinishButton 
						onClick={uploadButton}>작업 완료</FinishButton>	 */}
					<CloseButton 
						onClick={closeButton}>닫기</CloseButton>
			</ButtonAlign>

			</div>
		</FeedbackContainer>
	)
}

const FeedbackContainer = styled.div`
	display:flex; 
	justify-content:space-between; 
	align-items:center;
`
const ReviewScroll = styled.div`
	border:1px solid #ccc;
	width:90%; 
	border-radius:10px;
	box-shadow:0 5px 5px rgba(0, 0, 0, 0.15);
	height:200px; 
	margin:5px; 
	padding:10px 5px; 
	display:flex; 
	flex-direction:column; 
	overflow-y:auto;
	&::-webkit-scrollbar {
	padding:10px 5px;
  border-radius: 10px;
	width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #ccc;
  }
`

const ReviewStyle = styled.div`
	// border:1px solid gray; 
	border-radius:10px;
	box-shadow:0 3px 3px rgba(0, 0, 0, 0.10);
	width:90%;
	padding:10px 0px; 
	display:flex; 
	flex-direction:row; 
`
const ReviewText = styled.div`
	font-size:12px; 
	margin:3px 0px;
	// font-weight:bold; 
	white-space:normal
`
const NoReview = styled.div`
	display:flex; 
	justify-content:center; 
	align-items:center; 
	height:100vh;
`
const ReviewAlign = styled.div`
	display:flex; 
	justify-content:center; 
	align-items:center; 
	margin:15px 0px; 
	width:90%; 
	padding:0px 5px;
`
const ReviewInputContainer = styled.div`
	display:flex; 
	flex-direction:row; 
	justify-content:center;
`

const ReviewInput = styled.input`
	width:70%;
	padding:5px 10px; 
	margin:10px 5px;
`
const ReviewButton = styled.button`
	width:150px; 
	border:none; 
	border-radius:5px; 
	padding:5px 10px; 
	margin:10px 5px; 
	background-color:black; 
	color:white; 
	font-weight:bold; 
	cursor:pointer;
`

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
const UploadStyle = styled.label`
  cursor:pointer;
  display:block;
	background-color:gray; 
	border-radius:5px; 
	text-align:center;
  border:none;
	padding:10px 10px; 
	margin:10px 5px; 
  width: 150px;
  font-weight:bold;
	color:white;
`
const ButtonAlign = styled.div`
	width:100%; 
	display:flex; 
	justify-content:center; 
	flex-direction:row;  
`
const FinishButton = styled.div`
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
const CloseButton = styled.div`
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
export default FeedbackAllocateWork