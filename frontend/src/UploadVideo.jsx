import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import TopBar from "./TopBar";
import ReactPlayer from "react-player";
import styled from 'styled-components'

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
          setIsPlaying(true); // 파일 선택 후 자동으로 재생
        }
      };

    // 동영상 총 시간 계산
    const goDuration = (a) => {
        setPlayTime(a);
        console.log(`총 시간${a}`);
    };

    const closeButton = () => {
        // 닫기 (프로젝트 상세 페이지로)
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
            <UploadStyle>
                +
              <input 
                type="file" 
                accept="video/*" 
                style={{ display: "none" }} 
                onChange={videoPlaying} />
            </UploadStyle>
          <div>
            <WorkingButton 
              onClick={uploadButton}>
              분석하기
            </WorkingButton>
            <WorkingCloseButton 
              onClick={closeButton}>
              닫기
            </WorkingCloseButton>
          </div>
          {fileURL && (
            <div style={{ marginTop: "20px" }}>
              <ReactPlayer
                url={fileURL}
                playing={isPlaying} // 재생 여부
                controls={true}
                width="100%"
                ref={playerRef} // 여기서 ref 사용
                onDuration={goDuration}
              />
            </div>
          )}
        </RowContainer>
      </div>
    )
}

const RowContainer = styled.div`
    border:4px dashed black; width:90%; padding:60px 10px; height:100%; display:flex; justify-content:center; align-items:center; margin:0 auto; flex-direction:column;
`
const UploadStyle = styled.label`
  cursor:pointer; display:block; border:2px solid black; padding:100px 120px; margin:10px 10px; font-size:80px; font-weight:bold;
`
const WorkingButton = styled.button`
    width:150px; border:none; border-radius:5px; padding:10px 20px; margin:10px 5px; background-color:black; color:white; fontWeight:bold; cursor:pointer;
`
const WorkingCloseButton = styled.button`
    width:150px; border:none; border-radius:5px; padding:10px 20px; margin:10px 5px; background-color:gray; color:white; fontWeight:bold; cursor:pointer;
`
export default UploadVideo