import React, { useState, useEffect, useRef } from 'react'; 
import TopBar from "../components/TopBar";
import { useNavigate, useParams } from 'react-router-dom'; 
import ReactPlayer from "react-player";
import styled from 'styled-components'
import { BASE_URL } from '../axios';
import logo from '../assets/images/logo.png'

const ResultWork = () => {

  const navigate = useNavigate();

  const { projectId } = useParams();

  const [fileURL, setFileURL] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null); // ReactPlayer에 대한 ref 생성
  const [playTime, setPlayTime] = useState();

  const closeButton = () => {
    navigate(`/mainWorkPage/${projectId}`);
  }

  /* 병합 영상 다운로드 */
  const downloadVideo = async() => {
    try{
			const response = await fetch(`${BASE_URL}/api/frame/merged/${projectId}/download`, {
        method: 'GET',
        headers:{},
        // headers: { access: `${accessToken}` },
        // withCredentials: true,
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
      console.log(`에러 ${error}`)
    }
  }

  /* 병합 영상 조회 */
  const videoImport = async() => {
		try{
      const response = await fetch(`${BASE_URL}/api/frame/merged/${projectId}`, {
        method: 'GET',
        withCredentials: true,
      });
      // ★★★★★★★★★★★★★★★★★★★★★★★
			if (response.status === 401 || response.status === 500) {
				console.log('???');
				// alert('로그인이 만료되었습니다')
				navigate('/loginSignup')
			}
      const answer = await response.text()
			setFileURL(answer)
			setIsPlaying(true)
    }catch(error){
      console.log(`에러 ${error}`)
    }
	}

  /* 처음 접속 시 병합 영상 불러오기 */
  useEffect(() => {
    videoImport()
  },[])

  return(
    <div>
      <TopBar title='최종 생성 영상 확인' logoutView={true}/>
      <RowContainer>
        <img src={logo} alt="카드 이미지" style={{width:'30%', height:'200px',margin:'0px'}}/>
        {fileURL
          ? (
          <ReactPlayer
            url={fileURL}
            playing={isPlaying} // 재생 여부
            controls={true}
            width="60%"
            ref={playerRef}
            style={{width:"250px", 
              position: "relative",  
              boxShadow: "0 0 0 3px rgba(0, 0, 0, 0.3), 0 0 0 6px rgba(0, 0, 0, 0.6)",  }}
          />)
          : <div style={{ padding:'180px', border:'1px solid black'}}>
              영상 확인 중입니다
            </div>
        }
        <ButtonContainer>
          <WorkingButton onClick={downloadVideo}>
            다운로드
          </WorkingButton>
          <CloseButton onClick={closeButton}>
            닫기
          </CloseButton>
        </ButtonContainer>
      </RowContainer>
			<div style={{margin:"30px 0px"}} />
    </div>
  )
}

const RowContainer = styled.div`
	width:50%; 
	padding:0px 10px; 
	height:100%; 
	display:flex; 
	justify-content:center; 
	align-items:center; 
	margin:30px auto; 
	flex-direction:column;
	border:1px solid #FAF9F6;
	box-shadow:0px 8px 7px rgba(0, 0, 0, 0.4);
  border-radius:10px;
  background-color:#FAF9F6;
`
const CloseButton = styled.button`
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
const ButtonContainer = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:center;
  margin:25px 0px 10px 0px;
`
export default ResultWork