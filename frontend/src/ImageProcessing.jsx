import React, { useState, useEffect, useRef } from 'react';
import TopBar from "./TopBar";
import { useNavigate, Link } from 'react-router-dom';
import ReactPlayer from "react-player";
import styled from 'styled-components'
const ImageProcessing = () => {

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
    
      const seekToFiveSeconds = () => {
        if (playerRef.current) {
          playerRef.current.seekTo(8); // 5초로 이동
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

    const imageResult = () => {
        navigate('/imageProcessingResult');
      }

    return(
        <div>
          <TopBar title='영상 분석 점검' logoutView={true}/>
          <ColumnContainer>
              <WorkingBox>
                  <div>AI 분석 결과</div>
                  <div>동영상</div>
                  <div>타임스탬프</div>
              </WorkingBox>
              <WorkingBox>
                  <div>타임스탬프 생성</div>
                  <div>생성칸</div>
                  <div>추가버튼</div>
                  <WorkingButton 
                    onClick={imageResult}>
                    영상 분할하기
                  </WorkingButton>
              </WorkingBox>
          </ColumnContainer>
        </div>
    )
}

const ColumnContainer = styled.div`
    border:4px dashed black; width:90%; padding:60px 10px; height:100%; display:flex; justify-content:center; align-items:center; margin:0 auto;
`
const WorkingBox = styled.div`
  display:flex; flex-direction:column; font-weight:bold; align-items:center; font-size:30px; margin:0px 5px; padding:30px; border:1px solid black; width:40%; height:600px;
`
const WorkingButton = styled.button`
    width:150px; border:none; border-radius:5px; padding:10px 20px; margin:10px 5px; background-color:black; color:white; fontWeight:bold; cursor:pointer;
`
export default ImageProcessing