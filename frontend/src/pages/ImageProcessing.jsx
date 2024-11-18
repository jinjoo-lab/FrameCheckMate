import React, { useState, useEffect, useRef } from 'react'; // eslint-disable-line no-unused-vars
import TopBar from "../components/TopBar";
import { useNavigate, useParams, useLocation } from 'react-router-dom'; // eslint-disable-line no-unused-vars
import styled from 'styled-components'
import ReactPlayer from "react-player";
// import { videoSplit } from '../api';
import { BASE_URL, FLASK_URL } from '../axios';
// import axios from 'axios';
// import { detectTime } from '../api';
import { FaCrosshairs } from "react-icons/fa6";
import { MdMoreTime } from "react-icons/md";
import { IoIosTimer } from "react-icons/io";
import LoadingCircle from '../components/LoadingCircle';

const ImageProcessing = () => {

  const navigate = useNavigate();

  const { projectId } = useParams();

  const location = useLocation();

  const { totalTime } = location.state || {};

  const [fileURL, setFileURL] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null); // ReactPlayer에 대한 ref 생성
  const [playTime, setPlayTime] = useState();

	const [second, setSecond] = useState(0);
	const [minute, setMinute] = useState(0);
	const [hour, setHour] = useState(0);

  const [aiTime, setAiTime] = useState([]);
	const [splitTime, setSplitTime] = useState([0, 30000]);
  const [result, setResult] = useState([]);

  const [fps, setfps] = useState(null);
  const videoRef = useRef(null);

  // 경고 메세지 상태 추가
  const [warningMessage, setWarningMessage] = useState('');
  
  const [loading, setLoading] = useState(true); // 로딩 상태 변수 추가

  const [splitLoading, setSplitLoading] = useState(false)

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
	
  const AiResult = async (fileURL) => {
    setLoading(true); // 로딩 시작
    const response = await fetch(`${FLASK_URL}/api/ai/predict`, {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'url': fileURL }),
    });

      // ★★★★★★★★★★★★★★★★★★★★★★★
  if (response.status === 401 || response.status === 500) {
    console.log('???');
    // alert('로그인이 만료되었습니다')
    navigate('/loginSignup')
  }
    // const response = await fetch(`${FLASK_URL}/predict`, {
    //   method : 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Access-Control-Allow-Origin':'*',
    //   },
    //   // withCredentials: true,
    //   body:JSON.stringify(Data)
    // });
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
    setSplitTime([0, totalTime]);
    
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
      },);

      // ★★★★★★★★★★★★★★★★★★★★★★★
			if (response.status === 401 || response.status === 500) {
				console.log('???');
				// alert('로그인이 만료되었습니다')
				navigate('/loginSignup')
			}
			const blob = await response.blob();
      // Blob URL을 만들어서 다운로드
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'work-video.mp4'; 
      link.click();
      // 링크 제거
      URL.revokeObjectURL(link.href);
		}catch(error){
		}
  };

  // 동영상 총 시간 계산
  const goDuration = (a) => {
    console.log(`총 시간${a}`);
  };

  // 업로드된 원본 영상을 받아온 후 ai 분석
  const imageResult = async() => {
		try{
      const response = await fetch(`${BASE_URL}/api/frame/original/${projectId}`, {
        method: 'GET',
        headers:{}
      },);
      // ★★★★★★★★★★★★★★★★★★★★★★★
			if (response.status === 401 || response.status === 500) {
				console.log('???');
				// alert('로그인이 만료되었습니다')
				navigate('/loginSignup')
			}
			const text = await response.text();
			setFileURL(text)
			setIsPlaying(true)
      AiResult(text)
		}catch(error){
		}
	}

  const createSegments = (splitTime, aiTime, projectId, fps) => {
    // `segments` 배열을 초기화
    const segments = [];
  
    // splitTime 배열의 각 구간을 [start, end]로 만들기
    for (let i = 0; i < splitTime.length - 1; i++) {
      const start = splitTime[i];      // 현재 값 (start)
      const end = splitTime[i + 1];    // 다음 값 (end)
  
      processSegment(start, end);      // 구간 처리
    }
  
    // `Data` 객체 생성
    const Data = {
      projectId,
      fps,
      segments,
    };
  
    return Data;
  
    // segment 처리 로직
    function processSegment(start, end) {
      let detect = false;
  
      // aiTime 배열에서 `start`, `end` 구간과 겹치는지 확인
      for (const [aiStart, aiEnd] of aiTime) {
        if (
          (aiStart >= start && aiStart < end) ||   // aiStart가 구간 내에 있음
          (aiEnd > start && aiEnd <= end) ||       // aiEnd가 구간 내에 있음
          (aiStart <= start && aiEnd >= end)       // aiTime이 구간 전체를 포함
        ) {
          detect = true;
          break;
        }
      }
  
      // `start`, `end`, `detect` 속성을 가진 객체로 `segments`에 추가
      segments.push({ start, end, detect });
    }
  };
  // 영상 분할
	const imageSplit = async() => {
    setSplitLoading(true); // 로딩 시작
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
      console.log('데이터')

			const response = await fetch(`${BASE_URL}/api/frame/split`, {
        method: 'POST',
        body: Datas,
				headers: {
					"Access-Control-Allow-Origin": "*",
					'Content-Type': 'application/json',
				},
      },);
      // ★★★★★★★★★★★★★★★★★★★★★★★
			if (response.status === 401 || response.status === 500) {
				console.log('???');
				// alert('로그인이 만료되었습니다')
				navigate('/loginSignup')
			}
      // toast.success(`영상 분할이 완료되었습니다`);
      setSplitLoading(false); // 로딩 종료
      alert(`영상 분할이 완료되었습니다`)
			navigate(`/mainWorkPage/${projectId}`);
		}catch(error){
      console.log(error)
      setSplitLoading(false); // 로딩 종료
      alert(`영상 분할에 실패했습니다`)
		}
	}

  
  useEffect(() => {
    // AiResult()
		imageResult()
    setSplitTime([0, totalTime])
  }, [])
  
  useEffect(() => {
    if (fileURL) {
      const videoElement = document.createElement("video");
      videoElement.src = fileURL;
      videoElement.onloadedmetadata = () => {
        const duration = videoElement.duration; // 영상 길이 초
        const frameRate = videoElement.getVideoPlaybackQuality?.().totalVideoFrames / duration || 24; // 기본 fps를 24로 설정
        setfps(frameRate.toFixed(0)); // 추정 FPS 설정 (정수)
        // const estimatedFrames = Math.floor(videoElement.videoWidth * videoElement.videoHeight * duration / 500000);
        // const calculatedFPS = estimatedFrames / duration;
        // setfps('24'); // 임시 FPS 설정 값 (초당 24프레임)
      };
    }
  }, [fileURL]);
	return(
		<div>
			<TopBar title='영상 분석 점검' logoutView={true}/>
			<ColumnContainer>
				<WorkingBox>
        <div style={{display:'flex', flexDirection:'row', alignItems:'center', fontWeight:'bold', fontSize:'16px', margin:'15px 0px'}}>
        AI 분석 결과&nbsp;<FaCrosshairs size={20}/>
        </div>
					<div 
						style={{ 
							width:"90%",
							height:"200px", 
							border:"1px solid gray"}}>
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
          <div style={{height:'20px'}}></div>
            <TimeScroll>
            <div style={{display:'flex', flexDirection:'row', justifyContent:'center',alignItems:'center', fontWeight:'bold', fontSize:'16px', margin:'5px 0px'}}>
					    <h4 style={{textAlign:'center'}}>탐지 시간</h4>&nbsp;
              <IoIosTimer size={20}/>
            </div>
              {loading ? (
                <>
                  <NoReview>
                    <p>분석 중입니다</p> {/* 로딩 중일 때 표시 */}
                  </NoReview>
                  <LoadingCircle />
                </>
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
            <div style={{display:'flex', flexDirection:'row', alignItems:'center', fontWeight:'bold', fontSize:'16px', margin:'15px 0px'}}>
              <h4>타임스탬프 생성</h4>&nbsp;
              <MdMoreTime size={20}/>
            </div>
            <div>
              <div key={'timestamp'}>
                  {splitTime.slice(0, -1).map((time, i) => (
                    <div key={i} style={{margin:'5px 0px', color:'#333'}}>
                      {formatTime(time)} ~ {formatTime(splitTime[i + 1])}
                    </div>
                  ))}
              </div>
            </div>
            <br />
						<div style={{display:'flex', width:'50%', justifyContent:'center'}}>
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


            <br />
            {/* 경고 메시지 표시 */}
            {warningMessage && <div style={{ color: 'red' }}>{warningMessage}</div>}
            <ButtonContainer>
              <WorkingButton onClick={addSplitTime}>
                추가하기
              </WorkingButton>
              {/* TODO : 영상 총 길이를 미리 넣어두기 */}
              <ResetButton onClick={resetSplitTime}>
                초기화
              </ResetButton>
            </ButtonContainer>
						{/* <WorkingButton onClick={videoDownload}>
							다운로드
						</WorkingButton> */}
            <div style={{height:"30px"}}>
              <WorkingButton 
                onClick={imageSplit}>
                영상 분할
              </WorkingButton>
            </div>
            {splitLoading ? <><LoadingCircle /></> : null}
					</WorkingBox>
			</ColumnContainer>
		</div>
	)
}

const ColumnContainer = styled.div`
	width:70%; 
	padding:60px 10px; 
	height:100%; 
	display:flex; 
	justify-content:center; 
	align-items:center; 
	margin:0 auto; 
	flex-direction:row;
	border:1px solid #ccc;
	box-shadow:0px 8px 7px rgba(0, 0, 0, 0.4);
  border-radius:10px;
  // background-color:rgba(0, 0, 180, 0.01);

`
const WorkingBox = styled.div`
  display:flex; 
	flex-direction:column; 
	font-weight:bold; 
	align-items:center; 
	margin:0px 20px; 
	padding:10px 30px; 
	// border:1px solid rgba(0, 0, 62, 0.3);
	width:45%; 
	height:600px;
  box-shadow:0 3px 6px rgba(0, 0, 62, 0.3);
  border-radius:10px;
  background-color:white;
`
const ButtonContainer = styled.div`
  display:flex; 
	flex-direction:row; 
`
const WorkingButton = styled.button`
  width:100px; 
	border:none;
	border-radius:20px; 
	padding:10px 20px; 
	margin:10px 5px; 
	background-color:black; 
	color:white; 
	fontWeight:bold; 
	cursor:pointer;
`
const ResetButton = styled.button`
  width:100px; 
	border:none;
	border-radius:20px; 
	padding:10px 20px; 
	margin:10px 5px; 
	background-color:gray; 
	color:white; 
	fontWeight:bold; 
	cursor:pointer;
`
const TimeScroll = styled.div`
  // border:1px solid black; 
	width:90%; 
	height:200px; 
	margin:5px; 
	padding:10px; 
	display:flex; 
	flex-direction:column; 
  // justify-content:center;
  box-shadow:0 3px 3px rgba(0, 0, 0, 0.2);
  background-color:rgba(0, 0, 50, 0.03);
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
	margin:10px 0px; 
	width:90%; 
	padding:0px 5px;
`
const ReviewStyle = styled.div`
  box-shadow:0 3px 6px rgba(0, 0, 30, 0.3);
  border-radius:10px;
	width:70%; 
	display:flex; 
	flex-direction:row; 
	justify-content:center;
  padding:5px 8px;
  background-color:white;
`
const TimeMove = styled.div`
  font-size:15px; 
	font-weight:bold; 
	white-space:normal; 
	cursor:pointer;
`
const TimeInput = styled.input`
  text-align: right;
  margin-right: 3px;
  margin-left: 3px;
  height: 20px;
	width: 15%;
  font-size: 15px;
  border:1px solid gray;
  border-radius:5px;
  padding:3px;
  /* 숫자 조정 버튼 숨기기 */
  -moz-appearance: textfield;
  appearance: none;
  text-align:center;
  /* Chrome, Safari, Edge용 숫자 조정 버튼 숨기기 */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`
export default ImageProcessing