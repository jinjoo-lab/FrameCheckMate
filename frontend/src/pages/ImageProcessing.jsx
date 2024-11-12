import React, { useState, useEffect, useRef } from 'react'; // eslint-disable-line no-unused-vars
import TopBar from "../components/TopBar";
import { useNavigate, Link, useParams } from 'react-router-dom'; // eslint-disable-line no-unused-vars
import styled from 'styled-components'
import ReactPlayer from "react-player";
// import { videoSplit } from '../api';
import { BASE_URL } from '../axios';
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

  // 경고 메세지 상태 추가
  const [warningMessage, setWarningMessage] = useState('');
  
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
    // TODO : AI로부터 온 list를 받아야 하는 곳
    // const response = await detectTime(fileURL);
    // const data = await response.json();
    const response = [
      [1, 10],
      [15, 30],
      [150, 180],
      [199, 210]
    ]

    // setAiTime(data)
    setAiTime(response)
  }

  // 사용자가 입력한 시간 초 단위로 변환하여 splitTime에 추가
  const addSplitTime = () => {
    const totalSeconds = Number(hour) * 3600 + Number(minute) * 60 + Number(second);
    // 중복 확인
    if (splitTime.includes(totalSeconds)) {
      setWarningMessage('이미 입력한 시간입니다');
      return;
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

  // 분할된 시간 범위를 aiTime과 비교하여 detect 값을 설정
  useEffect(() => {
    if (splitTime.length > 0 && aiTime.length > 0) {
      const videoDuration = 600; // 예시로 총 비디오 길이(초)

      // 마지막 splitTime에 동영상 총 길이 추가
      const timeRanges = [...splitTime, videoDuration];
      const tempResult = [];

      for (let i = 0; i < timeRanges.length - 1; i++) {
        const start = timeRanges[i];
        const end = timeRanges[i + 1];
        let detect = false;

        // aiTime을 탐색하여 현재 구간에 탐지가 있는지 확인
        for (const [aiStart, aiEnd] of aiTime) {
          if ((aiStart >= start && aiStart < end) || (aiEnd > start && aiEnd <= end) || (aiStart <= start && aiEnd >= end)) {
            detect = true;
            break;
          }
        }
        tempResult.push({ start, end, detect });
      }
      setResult(tempResult);
    }
  }, [splitTime, aiTime]);

  // splitTime이 변경될 때마다 콘솔에 출력
  useEffect(() => {
    console.log(splitTime);
  }, [splitTime]);

  useEffect(() => {
    AiResult();
  }, []);

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
			const text = await response.text();
      // console.log(text)
      console.log(`응답왔음${text}`)
			setFileURL(text)
			setIsPlaying(true)

		}catch(error){
			console.log(`분할 에러${error}`)
		}
		// navigate('/imageProcessingResult');
	}
	// {
	// 	"projectId": "b1ad7d6a-d40b-4eca-85e6-42d4f736c76d",
	// 	"segments": [
	// 		{"start": "0", "end": "10", "detect": false},
	// 		{"start": "10", "end": "30", "detect": true},
	//         {"start": "30", "end": "60", "detect": false}
	//     ]
	// }
	const imageSplit = async() => {
		try{
			
			const response = await fetch(`${BASE_URL}/api/frame/original/${projectId}/download`, {
        method: 'GET',
        // body: formData,
        headers:{}
        // headers: { access: `${accessToken}` },
      },);

			const blob = await response.blob();

      // Blob URL을 만들어서 다운로드
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = '';  // 다운로드 파일 이름을 서버에서 자동으로 처리
      link.click();

      // 링크 제거
      URL.revokeObjectURL(link.href);

			// const Data = {
			// 	projectId:projectId,
			// 	segments:[
			// 		{"start": "0", "end": "3", "detect": false},
			// 		{"start": "3", "end": "5", "detect": true},
			// 		{"start": "5", "end": "8", "detect": true},
			// 	]
			// }
			// console.log(projectId)
			// // const Datas = JSON.stringify(Data)
			// // const response = await axios.post(`${BASE_URL}/api/frame/split`, Data)
			// // console.log(response)
      // const response = await fetch(`${BASE_URL}/api/frame/split`, {
      //   method: 'POST',
      //   body: Data,
			// 	headers: {
			// 		'Content-Type': 'application/json',
			// 	},
      // },);

			// console.log(response)
			// // const text = await response.text();
      // // // console.log(text)
      // // console.log(`응답왔음${text}`)
			// // setFileURL(text)
			// // setIsPlaying(true)

		}catch(error){
			console.log(`다운로드 에러${error}`)
			// console.log(`분할 에러${error}`)
		}
	}

  useEffect(() => {

    // AiResult()
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
						{ aiTime.length == 0 
						? (
							<NoReview>
								<p>탐지 내용이 없습니다</p>
							</NoReview>
							)	
						: (
								<>
								{ aiTime.map((list) => 
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
						}
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