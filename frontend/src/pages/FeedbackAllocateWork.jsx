import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom'; // eslint-disable-line no-unused-vars
import AllocateWork from './AllocateWork';
import styled from 'styled-components';
import { axiosClient } from '../axios';
import ReactPlayer from "react-player";
import { createGlobalStyle } from 'styled-components';
import { cardView, commentSave, confirmSave } from '../api';


const FeedbackAllocateWork = ({ confirmView, confirmTitle, commentView, uploadView }) => {

	const navigate = useNavigate();

	const { projectId, cardId } = useParams();

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
		console.log(`총 시간${a}`);
	};

	const videoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFileURL(url);
      setIsPlaying(false); // 파일 선택 후 자동으로 재생
    }
  };

	const uploadVideo = () => {
			
	}

	const downloadVideo = () => {

	}
	const [confirmList, setConfirmList] = useState([])
	const [commentList, setCommentList] = useState([])

	const [confirms, setConfirms] = useState('')
	const [comments, setComments] = useState('')

	const confirmSubmit = async (event, confirms) => {
		try{
			const Data = { content: confirms }
			const response = await confirmSave(Data)
			if (response.OK){
				console.log(response)
			}
		}catch(error){
			console.log(error)
		}

		navigate('/mainWorkPage')
	}

	const commentSubmit = async (event, comments) => {
		try{
			const Data = {
				userId : "123e4567-e89b-12d3-a456-426614171233",
				content : comments
			}
			const response = await commentSave(Data)
		}catch(error){
			console.log(error)
		}

	}

	const cardImport = async() => {
		try{
			const response = await cardView()
			if (response.OK){
        setStartDate(response.startDate)
        setEndDate(response.endDate)
				setNowContent(response.description)
				setConfirmList(response.confirms)
				setCommentList(response.comments)
				setFileURL(response.frameInfo)
      }
		}catch(error){
			console.log(error)
		}
	}

	useEffect(() => {
		/* 처음에 컨펌 목록, 코멘트 목록 불러오기 */
		cardImport()

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
            <div style={{padding:"5px"}}>
              {startDate}
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
						{ uploadView ?
            <UploadStyle>
						업로드
					<input 
						type="file" 
						accept="video/*" 
						style={{ display: "none" }} 
						onChange={videoChange} />
					</UploadStyle>
						: <div style={{width:'150px'}}></div>}
					</ButtonBox>
			</div>
			<div style={{ width:'45%' }}>

			<div style={{ margin:'10px 5px'}}>컨펌 내용</div>
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
									<ReviewText>{list.content}</ReviewText>
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
							{confirmTitle}
						</ReviewButton>
					</ReviewInputContainer>
					)
				: null
			}

			<div style={{ margin:'10px 5px'}}>코멘트</div>
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
									<ReviewText>{list.content}</ReviewText>
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
	border:1px solid black;
	width:90%; 
	height:200px; 
	margin:5px; 
	padding:10px; 
	display:flex; 
	flex-direction:column; 
	overflow-y:auto;
`
const ReviewStyle = styled.div`
	border-bottom:1px solid black; 
	width:85%; 
	display:flex; 
	flex-direction:row; 
	justify-content:center;
`
const ReviewText = styled.div`
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

export default FeedbackAllocateWork