import React, { useState, useEffect, useRef } from 'react';
import TopBar from "./TopBar";
import { useNavigate, Link } from 'react-router-dom';
import ReactPlayer from "react-player";
import { GoVideo } from "react-icons/go";
import styled from 'styled-components';

const WorkingLog = () => {

    const navigate = useNavigate();

    const [titleData, setTitleData] = useState([
        {number:1, name:'영상 수정', confirm:false},{number:2, name:'드라마 편집', confirm:true},
        {number:3, name:'모자이크 처리', confirm:true}, {number:4, name:'모자이크 처리', confirm:true},
        {number:5, name:'모자이크 처리', confirm:true}, {number:6, name:'모자이크 처리', confirm:true},
        {number:7, name:'모자이크 처리', confirm:true}, {number:8, name:'모자이크 처리', confirm:true},
        {number:9, name:'모자이크 처리', confirm:true}, {number:10, name:'모자이크 처리', confirm:true},
        {number:11, name:'모자이크 처리', confirm:true}, {number:12, name:'모자이크 처리', confirm:true},
    ])
    const [fileURL, setFileURL] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const playerRef = useRef(null); // ReactPlayer에 대한 ref 생성
    const [playTime, setPlayTime] = useState();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const url = URL.createObjectURL(file);
          console.log(url);
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
        navigate('/mainWorkPage');
      }

    const uploadButton = () => {
        navigate('/imageProcessing')
    }
    return(
        <div>
            <TopBar title='작업 로그' logoutView={true}/>
            <RowContainer>
                <WorkingContainer>
                    <LogContainer>
                        <ListBox>
                            { titleData.map((list) => 
                                <ListStyle key={list.number}>
                                    <div>{list.name}</div>
                                    {list.confirm ? 
                                    <PlayButton> <GoVideo size={15} /> </PlayButton>
                                    : null
                                    }
                                </ListStyle>
                                )
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
                                onDuration={goDuration}
                            />
                            <WorkingButton onClick={uploadButton}>
                                다운로드
                            </WorkingButton>
                            </LogContainer>
                            ): 
                            <LogContainer>확인할 영상을 선택해주세요</LogContainer>
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
    border:4px dashed black; width:90%; padding:60px 10px; height:100%; display:flex; justify-content:center; align-items:center; margin:0 auto; flex-direction:column;
`
const WorkingContainer = styled.div`
    display:flex; width:90%; flex-direction:row; justify-content:center; align-items:center;
`
const LogContainer = styled.div`
    border:1px solid black; display:flex; width:40%; height:300px; padding:10px; margin:5px; justify-content:center; align-items:center;
`
const ListBox = styled.div`
    width:100%; height:100%; overflow-y:auto; padding:5px; display:flex; justify-content:center; align-items:center; flex-direction:column;
`
const ListStyle = styled.div`
    display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid black; margin:5px 0px; width:200px;
`
const PlayButton = styled.button`
    border:none; outline:none; background-color:inherit; cursor:pointer;
`
const ButtonBox = styled.div`
    display:flex; flex-direction:row; justify-content:center;
`
const WorkingButton = styled.button`
    width:150px; border:none; border-radius:5px; padding:10px 20px; margin:10px 5px; background-color:black; color:white; fontWeight:bold; cursor:pointer;
`
export default WorkingLog