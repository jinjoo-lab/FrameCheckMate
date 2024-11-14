import React, { useState, useEffect, useRef } from 'react'; // eslint-disable-line no-unused-vars
import { useNavigate, Link, useParams } from 'react-router-dom'; // eslint-disable-line no-unused-vars
import TopBar from "../components/TopBar";
import ReactPlayer from "react-player";
import styled from 'styled-components'
import { BASE_URL } from '../axios';

const UploadVideo = () => {

  const { projectId } = useParams();

  const navigate = useNavigate();

  const [fileURL, setFileURL] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null); // ReactPlayer에 대한 ref 생성
  const [ playTime, setPlayTime ] = useState();
  const [ totalTime, setTotalTime ] = useState(0)

  const [loading, setLoading] = useState(false); // 로딩 상태 변수 추가

  const videoPlaying = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFileURL(url);
      setIsPlaying(false); // 파일 선택 후 자동으로 재생
    }
  };

  // 동영상 총 시간 계산
  const goDuration = (a) => {
    setPlayTime(a);
    console.log(`총 시간${a}`);
    const timeCheck = Math.floor(a)
    setTotalTime(timeCheck)
  };

  const closeButton = () => {
    navigate('/mainHomePage');
  }

  const uploadButton = async () => {
    setLoading(true); // 로딩 시작
    try {
      const responses = await fetch(fileURL);
      const blob = await responses.blob();
  
      const formData = new FormData();
      formData.append('file', blob, 'video.mp4');
      
      const response = await fetch(`${BASE_URL}/api/frame/original/${projectId}`, {
        method: 'POST',
        body: formData,
      });
  
      const text = await response.json();
      console.log(text)
      console.log(`응답왔음${text.fileUrl}`)
      navigate(`/imageProcessing/${projectId}`, { state: { totalTime } });
    }catch(error){
      console.log(`전송에러${error}`)
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  useEffect(() => {
    console.log(`프로젝트 아이디${projectId}`)
  })
  return(
    <div>
      <TopBar title='영상 처리' logoutView={true}/>
      <RowContainer>
        <div>영상 업로드</div>
        { fileURL 
        ? (
          <>
            <div style={{ marginTop: "20px", }}>
              <ReactPlayer
                url={fileURL}
                playing={isPlaying} // 재생 여부
                controls={true}
                width="100%"
                ref={playerRef} // 여기서 ref 사용
                onDuration={goDuration}
              />
            </div>
            {loading ? (
              <LoadingMessage>분석 중...</LoadingMessage> // 로딩 메시지 표시
            ) : (
              <WorkingButton onClick={uploadButton}>
                분석하기
              </WorkingButton>
            )}
            <WorkingCloseButton onClick={closeButton}>
              닫기
            </WorkingCloseButton>
          </>
        ) 
        : (
          <>
            <UploadStyle>
              +
            <input 
              type="file" 
              accept="video/*" 
              style={{ display: "none" }} 
              onChange={videoPlaying} />
            </UploadStyle>
            <WorkingCloseButton onClick={closeButton}>
              닫기
            </WorkingCloseButton>
          </>
        )}
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
const UploadStyle = styled.label`
  cursor:pointer;
  display:block;
  border:2px solid black;
  padding:100px 120px;
  margin:10px 10px;
  font-size:80px;
  font-weight:bold;
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
const WorkingCloseButton = styled.button`
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
const LoadingMessage = styled.div`
  font-size:18px;
  font-weight:bold;
  color:gray;
  margin-top:10px;
`
export default UploadVideo