import React, { useState, useEffect, useRef } from 'react'; // eslint-disable-line no-unused-vars
import TopBar from "../components/TopBar";
import { useNavigate, Link, useParams } from 'react-router-dom'; // eslint-disable-line no-unused-vars
import styled from 'styled-components'
import ReactPlayer from "react-player";
// import { videoSplit } from '../api';
import { BASE_URL, FLASK_URL } from '../axios';
// import axios from 'axios';
// import { detectTime } from '../api';

const ImageProcessing = () => {

  const navigate = useNavigate();

  const { projectId } = useParams();

  const [fileURL, setFileURL] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null); // ReactPlayer에 대한 ref 생성
  const [playTime, setPlayTime] = useState();

	const [second, setSecond] = useState(0);
	const [minute, setMinute] = useState(0);
	const [hour, setHour] = useState(0);

  const [aiTime, setAiTime] = useState([]);
  // TODO : 영상 총 길이를 미리 넣어두기
	const [splitTime, setSplitTime] = useState([0, 30000]);
  const [result, setResult] = useState([]);

  const [fps, setfps] = useState(null);
  const videoRef = useRef(null);

  // 경고 메세지 상태 추가
  const [warningMessage, setWarningMessage] = useState('');
  
  const [loading, setLoading] = useState(true); // 로딩 상태 변수 추가

  const handleHourChange = (event) => {
    const value = Math.max(0, Number(event.target.value)); // 음수 방지
    setWarningMessage('');
    setHour(value);
  };
  
  const handleMinuteChange = (event) => {
    const value = Math.max(0, Number(event.target.value)); // 음수 방지
    setWarningMessage('');
    setMinute(value);
  };
  
  const handleSecondChange = (event) => {
    const value = Math.max(0, Number(event.target.value)); // 음수 방지
    setWarningMessage('');
    setSecond(value);
  };

  const moveSeconds = (event, seconds) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    setIsPlaying(true);
    if (playerRef.current) {
      playerRef.current.seekTo(seconds);
    }
    setPlayTime(seconds);
  };

  const timeView = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
  
    return `${String(hours).padStart(2, '0')}:
						${String(minutes).padStart(2, '0')}:
						${String(secs).padStart(2, '0')}`;
  };
	
  const AiResult = async () => {
    setLoading(true); // 로딩 시작
    const response = await fetch(`${FLASK_URL}/predict`, {
      method : 'POST',
    });
    const data = await response.json();
    setAiTime(data.detection_times)
    setLoading(false); // 로딩 종료
  }

  // 사용자가 입력한 시간 초 단위로 변환하여 splitTime에 추가
  const addSplitTime = () => {
    const totalSeconds = Number(hour) * 3600 + Number(minute) * 60 + Number(second);
    // 중복 확인
    if (splitTime.includes(totalSeconds)) {
      setWarningMessage('이미 입력한 시간입니다');
      return;
    }

    if (hour < 0 || minute < 0 || second < 0 ) {
      setWarningMessage('0보다 작은 값을 입력할 수 없습니다.');
      return
    }

    // 전체 길이 초과 확인
    if (totalSeconds > splitTime[splitTime.length - 1] || totalSeconds < 0) {
      setWarningMessage('영상의 전체 길이를 벗어나는 시간은 입력할 수 없습니다');
      return;
    }

    setSplitTime(prev => {
      const updatedSplitTime = [...prev, totalSeconds];
      return updatedSplitTime.sort((a, b) => a - b); // 오름차순 정렬
    });

    // 입력 칸 초기화
    setHour(0);
    setMinute(0);
    setSecond(0);
  };

  // splitTime을 초기화하고 입력 칸도 초기화
  const resetSplitTime = () => {
    // TODO : 영상 총길이를 end값으로 넣기
    setSplitTime([0, 30000]);
    
    // 입력 칸 초기화
    setHour(0);
    setMinute(0);
    setSecond(0);
  };

  // 초 단위 시간을 hh:mm:ss 형식으로 변환하는 함수
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

	const videoDownload = async () => {
		try{
			const response = await fetch(`${BASE_URL}/api/frame/original/${projectId}/download`, {
        method: 'GET',
        headers:{}
        // headers: { access: `${accessToken}` },
      },);

			const blob = await response.blob();
			console.log(response)

      // Blob URL을 만들어서 다운로드
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'work-video.mp4'; 
      link.click();

      // 링크 제거
      URL.revokeObjectURL(link.href);

		}catch(error){
			console.log(`다운로드 에러${error}`)
			// console.log(`분할 에러${error}`)
		}
  };

  // 동영상 총 시간 계산
  const goDuration = (a) => {
    // setPlayTime(a);
    console.log(`총 시간${a}`);
  };

  // TODO 결과를 BE로 보내 영상을 자를 수 있도록 수정
  const imageResult = async() => {
    // videoSplit
		try{
      const response = await fetch(`${BASE_URL}/api/frame/original/${projectId}`, {
        method: 'GET',
        // body: formData,
        headers:{}
        // headers: { access: `${accessToken}` },
      },);
			// const text = await response.text();
			const text = await response.text();
      // console.log(text)
      console.log(`응답왔음${text}`)
			setFileURL(text)
			setIsPlaying(true)

		}catch(error){
			console.log(`분할 에러${error}`)
		}
	}

  const createSegments = (splitTime, aiTime, projectId, fps) => {
    // `segments` 배열을 초기화
    const segments = splitTime.map(([start, end]) => {
      // `detect` 변수를 false로 초기화하고, aiTime과의 비교를 통해 true로 변경
      let detect = false;
  
      // aiTime 배열에서 `start`, `end` 구간과 겹치는지 확인
      for (const [aiStart, aiEnd] of aiTime) {
        if (
          (aiStart >= start && aiStart < end) || // aiStart가 구간 내에 있음
          (aiEnd > start && aiEnd <= end) ||     // aiEnd가 구간 내에 있음
          (aiStart <= start && aiEnd >= end)     // aiTime이 구간 전체를 포함
        ) {
          detect = true;
          break;
        }
      }
      // `start`, `end`, `detect` 속성을 가진 객체로 반환
      return { start, end, detect };
    });
    // `Data` 객체 생성
    const Data = {
      projectId,
      fps,
      segments,
    };
    return Data;
  };

	const imageSplit = async() => {
		try{
      const Data = createSegments(splitTime, aiTime, projectId, fps)
			// const Data = {
			// 	projectId : projectId,
      //  fps : fps,
			// 	segments:[
			// 		{"start": "0", "end": "3", "detect": false},
			// 		{"start": "3", "end": "5", "detect": true},
			// 		{"start": "5", "end": "8", "detect": true},
			// 	]
			// }
			const Datas = JSON.stringify(Data)

			const response = await fetch(`${BASE_URL}/api/frame/split`, {
        method: 'POST',
        body: Datas,
				headers: {
					"Access-Control-Allow-Origin": "*",
					'Content-Type': 'application/json',
				},
      },);
			console.log(response)
			navigate(`/mainWorkPage/${projectId}`);
		}catch(error){
			console.log(`분할 에러${error}`)
		}
	}

  useEffect(() => {
    if (fileURL) {
      const videoElement = document.createElement("video");
      videoElement.src = fileURL;
      videoElement.onloadedmetadata = () => {
        const duration = videoElement.duration;
        const estimatedFrames = Math.floor(videoElement.videoWidth * videoElement.videoHeight * duration / 500000);
        const calculatedFPS = estimatedFrames / duration;
        setfps(calculatedFPS.toFixed(0)); // 추정 FPS 설정
      };
    }
  }, [fileURL]);

  useEffect(() => {
    AiResult()
		imageResult()
  }, [])

	return(
		<div>
			<TopBar title='영상 분석 점검' logoutView={true}/>
			<ColumnContainer>
				<WorkingBox>
					<h4>AI 분석 결과</h4>
					<div 
						style={{ 
							width:"100%",
							height:"200px", 
							border:"1px solid black"}}>
					<ReactPlayer
						url={fileURL}
						playing={isPlaying} // 재생 여부
						controls={true}
						width="100%"
						height="100%"
						ref={playerRef} // 여기서 ref 사용
						onReady={() => setIsPlaying(true)} 
						onDuration={goDuration}
					/>
					</div>

					<h4>타임스탬프</h4>
            <TimeScroll>
              {loading ? (
                <NoReview>
                  <p>분석 중입니다</p> {/* 로딩 중일 때 표시 */}
                </NoReview>
              ) : (
                aiTime.length === 0 ? (
                  <NoReview>
                    <p>탐지 내용이 없습니다</p>
                  </NoReview>
                ) : (
                  <>
                    {aiTime.map((list) => 
                      <ReviewAlign key={list[0]}>
                        <ReviewStyle>
                          <TimeMove onClick={(event) => moveSeconds(event, list[0])}>
                            {timeView(list[0])}
                          </TimeMove> 
                            ~ 
                          <TimeMove onClick={(event) => moveSeconds(event, list[1])}>
                            {timeView(list[1])}
                          </TimeMove>
                        </ReviewStyle>
                      </ReviewAlign>
                    )}
                  </>
                )
              )}
						</TimeScroll>
					</WorkingBox>
					<WorkingBox>
						<h4>타임스탬프 생성</h4>
            <div key={'timestamp'} style={{ padding: '10px 80px', border: '1px solid black' }}>
              {splitTime.slice(0, -1).map((time, i) => (
                <div key={i}>
                  {formatTime(time)} ~ {formatTime(splitTime[i + 1])}
                </div>
              ))}
            </div>
            <br />
						<div style={{display:'flex', width:'100%'}}>
							<TimeInput 
							type="number" 
							value={hour}
							onChange={(event) => setHour(event.target.value)} />시
							<TimeInput 
							type="number" 
							value={minute}
							onChange={(event) => setMinute(event.target.value)} />분
							<TimeInput 
							type="number" 
							value={second}
							onChange={(event) => setSecond(event.target.value)} />초
						</div>


						<WorkingButton onClick={videoDownload}>
							다운
						</WorkingButton>

            <br />
            {/* 경고 메시지 표시 */}
            {warningMessage && <div style={{ color: 'red' }}>{warningMessage}</div>}

						<WorkingButton onClick={addSplitTime}>
							추가하기
						</WorkingButton>
            {/* TODO : 영상 총 길이를 미리 넣어두기 */}
						<ResetButton onClick={resetSplitTime}>
							초기화
						</ResetButton>
						
						<WorkingButton 
							onClick={imageSplit}>
							영상 분할하기
						</WorkingButton>
					</WorkingBox>
			</ColumnContainer>
		</div>
	)
}

const ColumnContainer = styled.div`
  border:4px dashed black; 
	width:90%; 
	padding:60px 10px; 
	height:100%; 
	display:flex; 
	justify-content:center; 
	align-items:center; 
	margin:0 auto;
`
const WorkingBox = styled.div`
  display:flex; 
	flex-direction:column; 
	font-weight:bold; 
	align-items:center; 
	margin:0px 5px; 
	padding:10px 30px; 
	border:1px solid black; 
	width:40%; 
	height:600px;
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
const ResetButton = styled.button`
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
const TimeScroll = styled.div`
  border:1px solid black; 
	width:90%; 
	height:200px; 
	margin:5px; 
	padding:10px; 
	display:flex; 
	flex-direction:column; 
	overflow-y:auto;
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
const ReviewStyle = styled.div`
  border-bottom:1px solid black;
	width:85%; 
	display:flex; 
	flex-direction:row; 
	justify-content:center;
`
const TimeMove = styled.div`
  font-size:20px; 
	font-weight:bold; 
	white-space:normal; 
	cursor:pointer;
`
const TimeInput = styled.input`
  text-align: right;
  margin-right: 3px;
  margin-left: 3px;
  height: 20px;
	width: 30%;
  font-size: 15px;

  /* 숫자 조정 버튼 숨기기 */
  -moz-appearance: textfield;
  appearance: none;
  
  /* Chrome, Safari, Edge용 숫자 조정 버튼 숨기기 */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`
export default ImageProcessing