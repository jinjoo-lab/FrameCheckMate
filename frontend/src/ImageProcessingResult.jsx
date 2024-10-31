import React, { useState, useEffect, useRef } from 'react';
import TopBar from "./TopBar";
import { useNavigate, Link } from 'react-router-dom';
import ReactPlayer from "react-player";
import styled from 'styled-components'

const ImageProcessingResult = () => {

    const navigate = useNavigate();

    const [fileURL, setFileURL] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const playerRef = useRef(null); // ReactPlayer에 대한 ref 생성
    const [playTime, setPlayTime] = useState();

    const videoPlaying = (event) => {
        const file = event.target.files[0];
        if (file) {
          const url = URL.createObjectURL(file);
          console.log(url);
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

    const mainButton = () => {
        navigate('/mainWorkPage');
      }

    const [cardList, setCardList] = useState([
        {number:1, type:'a', content:'영상1', time:'00:01:00~00:02:00'},
        {number:2, type:'b', content:'영상2', time:'00:02:00~00:03:00'},
        {number:3, type:'c', content:'영상3', time:'00:03:00~00:06:00'},
        {number:4, type:'d', content:'영상4', time:'00:06:00~00:10:00'},
        {number:5, type:'a', content:'영상5', time:'00:10:00~00:12:00'},
        {number:6, type:'c', content:'영상6', time:'00:12:00~00:13:00'},
        {number:7, type:'c', content:'영상7', time:'00:13:00~00:14:00'},
        {number:8, type:'b', content:'영상8', time:'00:14:00~00:17:00'},
        {number:9, type:'b', content:'영상9', time:'00:17:00~00:18:00'},
        {number:10, type:'a', content:'영상10', time:'00:18:00~00:30:00'},
    ])

    const [videoView, setVideoView] = useState([])

    useEffect (() => {
        setVideoView(cardList)
    }, [])

    return(
      <div>
        <TopBar title='최종 분할 결과' logoutView={true}/>
        <RowContainer>
        <VideoScroll>
         {videoView.map((list) => 
          <VideoBox key={list.number}>
            <VideoList>
                <VideoContents>{list.content}</VideoContents>
                <VideoContents>{list.time}</VideoContents>
            </VideoList>
          </VideoBox>
        )}
        </VideoScroll>
            <WorkingButton 
              onClick={mainButton}>작업페이지 이동
            </WorkingButton>
        </RowContainer>
      </div>
    )
}

const RowContainer = styled.div`
    border:4px dashed black; width:90%; padding:60px 10px; height:100%; display:flex; justify-content:center; align-items:center; margin:0 auto; flex-direction:column;
`
const VideoScroll = styled.div`
  border:1px solid black; width:90%; height:300px; margin:5px; padding:0px 10px; display:flex; flex-direction:column; overflow-y:auto;
`
const WorkingButton = styled.button`
    width:150px; border:none; border-radius:5px; padding:10px 20px; margin:10px 5px; background-color:black; color:white; fontWeight:bold; cursor:pointer;
`
const VideoBox = styled.div`
  display:flex; justify-content:center; align-items:center; margin:15px 0px; width:90%; padding:0px 5px;
`
const VideoList = styled.div`
border-bottom:2px solid black; width:85%; display:flex; flex-direction:row; justify-content:space-between; align-items:center;
`
const VideoContents = styled.div`
  font-size:12px; font-weight:bold; white-space:normal
`
export default ImageProcessingResult