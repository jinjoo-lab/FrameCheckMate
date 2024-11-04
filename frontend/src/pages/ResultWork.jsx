import React, { useState, useEffect, useRef } from 'react'; // eslint-disable-line no-unused-vars
import TopBar from "../components/TopBar";
import { useNavigate, Link } from 'react-router-dom'; // eslint-disable-line no-unused-vars
import ReactPlayer from "react-player";
import styled from 'styled-components'

const ResultWork = () => {

  const navigate = useNavigate();

  const [fileURL, setFileURL] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null); // ReactPlayer에 대한 ref 생성
  const [playTime, setPlayTime] = useState();

  const closeButton = () => {
    navigate('/mainWorkPage');
  }

  const uploadButton = () => {
    navigate('/imageProcessing')
  }

  const videoImport = () => {
    const response = [{fileUrl:'', fileName:'이름'}]
    setFileURL(response.fileURL)
  }

  useEffect(() => {
    videoImport()
  },[])

  return(
    <div>
      <TopBar title='최종 생성 영상 확인' logoutView={true}/>
      <RowContainer>
        {fileURL
          ? (
          <ReactPlayer
            url={fileURL}
            playing={isPlaying} // 재생 여부
            controls={true}
            width="60%"
            ref={playerRef} // 여기서 ref 사용
            style={{width:"300px", border:"1px solid black"}}
          />)
          : <div style={{ padding:'200px', border:'1px solid black'}}>
              영상 확인 중입니다
            </div>
        }
        <ButtonContainer>
          <WorkingButton onClick={uploadButton}>
            다운로드
          </WorkingButton>
          <CloseButton onClick={closeButton}>
            닫기
          </CloseButton>
        </ButtonContainer>
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
const CloseButton = styled.button`
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
const ButtonContainer = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:center;
`
export default ResultWork