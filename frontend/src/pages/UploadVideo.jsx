import React, { useState, useEffect, useRef } from 'react'; // eslint-disable-line no-unused-vars
import { useNavigate, Link } from 'react-router-dom'; // eslint-disable-line no-unused-vars
import TopBar from "../components/TopBar";
import ReactPlayer from "react-player";
import styled from 'styled-components'
import { axiosClient } from '../axios';

const UploadVideo = () => {

  const navigate = useNavigate();

  const [fileURL, setFileURL] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null); // ReactPlayer에 대한 ref 생성
  const [playTime, setPlayTime] = useState();

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
  };

  const closeButton = () => {
    navigate('/mainWorkPage');
  }

  const uploadButton = () => {
      navigate('/imageProcessing')
  }
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
            <WorkingButton onClick={uploadButton}>
              분석하기
            </WorkingButton>
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
export default UploadVideo