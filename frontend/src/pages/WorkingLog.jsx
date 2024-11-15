import React, { useState, useEffect, useRef } from 'react'; // eslint-disable-line no-unused-vars
import TopBar from "../components/TopBar";
import { useNavigate, Link, useParams } from 'react-router-dom';
import ReactPlayer from "react-player";
import { GoVideo } from "react-icons/go";
import styled from 'styled-components';
import { axiosClient } from '../axios';
import { allowView } from '../axios';
import { BASE_URL } from '../axios';

const WorkingLog = () => {
  const { projectId, cardId } = useParams();
  const navigate = useNavigate();

  const [logList, setLogList] = useState([])
  const [fileURL, setFileURL] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null); // ReactPlayer에 대한 ref 생성
  const [playTime, setPlayTime] = useState();

  const logImport = async () => {
    // TODO response data 형식(naming) 수정 및 그에 따른 FE code 수정
    // const response = allowView(cardId)
    try{
      const response = await fetch(`${BASE_URL}/api/card/${cardId}/logs`, {
        method: 'GET',
        // withCredentials: true,
        // headers: { access: `${accessToken}` },
      
      });
      const answer = await response.json()
      setLogList(answer)

    }catch(error){
      console.log('아직 로그가 없습니다')

      setLogList([])
    }
    // const response = {
    //   "cardId": "e7db3b9a-ab91-491c-a0f5-9e5174139a60",
    //   "description": "됐나??????",
    //   "originFrame": "1_b166ba99-374e-4d84-b15e-7b9b635b8fc9-209424_small.mp4",
    //   "startDate": "2024-03-16 09:00:00",
    //   "endDate": "2024-03-20 18:00:00",
    //   "frameConfirmPairs": [
    //     {   
    //       // TODO : frame upload 시간이 추가되야 함
    //       "frame": "11964b0f-8191-41d9-96db-f2fa70734a3f-b166ba99-374e-4d84-b15e-7b9b635b8fc9-209424_small.mp4",
    //       "confirm": {
    //           "content": "확인 완료",
    //           "createdAt": "2024-11-11 15:18:33"
    //       }
    //     },
    //     {
    //       "frame": "1ca94305-2fe3-42b1-b557-4c439a017318-b166ba99-374e-4d84-b15e-7b9b635b8fc9-209424_small.mp4",
    //       "confirm": null
    //     }
    //   ]
    // }
    // setLogList(response)
  }

  const closeButton = () => {
    navigate(`/mainWorkPage/${projectId}`);
  }

  const uploadButton = (event, fileURL) => {
    event.preventDefault() // 페이지 새로 고침 방지
  }

  const playVideo = (event, file) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    setFileURL(`https://framecheckmate-bucket.s3.ap-northeast-2.amazonaws.com/${file}`)
    setIsPlaying(true)
  }

  useEffect(() => {
    logImport()
  }, [])

  return(
    <div>
      <TopBar title='작업 로그' logoutView={true}/>
      <RowContainer>
        <WorkingContainer>
          <LogContainer>
            <ListBox>
              <ListStyle key="primary-task">
                <div>{logList.startDate}</div>
                <div>{logList.description}</div>
                <PlayButton onClick={(event) => playVideo(event, logList.originFrame)}>
                  <GoVideo size={15} />
                </PlayButton>
              </ListStyle>
              {Array.isArray(logList.frameConfirmPairs) && logList.frameConfirmPairs.map((pair, index) => (
                <ListStyle key={`${index}`}>
                  {pair.confirm ? (
                    // {pair.confirm.createAt} {pair.confirm.content}
                    <>
                      <div>{pair.confirm.createdAt}</div>
                      <div>{pair.confirm.content}</div>
                    </>
                  ) : (
                    <div>확인 대기중</div>
                  )}
                  {/* TODO : pair.frame.createAt : 영상 upload 시간이 들어오면 추가할 것 */}
                  <PlayButton onClick={(event) => playVideo(event, pair.frame)}>
                    <GoVideo size={15} />
                  </PlayButton>
                </ListStyle>
              ))
              }
            </ListBox>
          </LogContainer>
          { fileURL ? (
            <LogContainer>
              <ReactPlayer
                url={fileURL}
                playing={isPlaying} // 재생 여부
                controls={true}
                width="100%"
                height="80%"
                ref={playerRef} // 여기서 ref 사용
              />
              <WorkingButton onClick={(event) => {uploadButton(event, fileURL)}}>
                다운로드
              </WorkingButton>
            </LogContainer>
            )
            : <LogContainer>확인할 영상을 선택해주세요</LogContainer>
          }
        </WorkingContainer>
        <WorkingButton onClick={closeButton}>
          닫기
        </WorkingButton>
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
const WorkingContainer = styled.div`
  display:flex;
  width:90%;
  flex-direction:row;
  justify-content:center;
  align-items:center;
`
const LogContainer = styled.div`
  border:1px solid black;
  display:flex;
  flex-direction:column;
  width:40%;
  height:300px;
  padding:10px;
  margin:5px;
  justify-content:center;
  align-items:center;
`
const ListBox = styled.div`
  width:100%;
  height:100%;
  overflow-y:auto;
  padding:5px;
  display:flex;
  align-items:center;
  flex-direction:column;
`
const ListStyle = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  border-bottom:1px solid black;
  margin:5px 0px;
  width:300px;
`
const PlayButton = styled.button`
  border:none;
  outline:none;
  background-color:inherit;
  cursor:pointer;
`
const ButtonBox = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:center;
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
export default WorkingLog