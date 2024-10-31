import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { ko } from "date-fns/locale";
import styled from 'styled-components';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AllocateWork = ({ workingBefore, uploadView }) => {

    const navigate = useNavigate();

    // 작업자 
    const [ workContent, setWorkContet ] = useState('')
    const [ worker, setWorker ] = useState('')

    // 작업 기간 - 시작 날짜 & 종료 날짜
    const [ startDate, setStartDate ] = useState(null);
    const [ endDate, setEndDate ] = useState(null);

    const uploadVideo = () => {
        
    }

    const downloadVideo = () => {

    }

    return(
        <div>
            <div>작업자 배정</div>
            <WorkerInput 
                type="text" 
                onChange={(event) => setWorker(event.target.value)}/>
                
            <div>작업 내용</div>
            <WorkerInput
              type="text" 
              onChange={(event) => setWorkContet(event.target.value)}/>

            <div>작업 기간</div>
            <div style={{ display: "flex", alignItems:"center", margin:"10px 0px"}}>
                <DateStyle />
                <DatePicker
                    selected={startDate}
                    onChange={(date) => {
                        if (endDate && endDate < date) {
                            setEndDate(null); // 시작 날짜가 종료 날짜 이후로 선택되면 종료 날짜 초기화 시키기
                        }
                        setStartDate(date);
                    }}
                    selectsStart
                    startDate={startDate}
                    minDate={new Date()}
                    endDate={endDate}
                    locale={ko}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="시작 날짜"
                    isClearable
                    onKeyDown={(event) => event.preventDefault()}
                />
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate} // 시작 날짜 이후로만 선택하도록 하기
                    locale={ko}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="종료 날짜"
                    isClearable
                    onKeyDown={(event) => event.preventDefault()}
                    disabled={!startDate}
                />
            </div>

            <div>작업 영상</div>
            <div style={{ width:'100%', height:'100px', border:'1px solid black', margin:"10px 0px" }}>해당 영상 플레이어 넣기</div>
            { workingBefore ? null : (
                <div style={{ display:"flex", flexDirection:"row", justifyContent:'center' }}>
                    <DownloadButton onClick={downloadVideo}>
                        다운로드
                    </DownloadButton>
                    { uploadView ?
                    <UploadButton onClick={uploadVideo}>
                        업로드
                    </UploadButton> : null}
                </div>
            )}
        </div>
    )
}

const WorkerInput = styled.input`
    border: 1px solid gray; border-radius: 10px; margin: 10px 0px; height: 30px; width: 350px;
`

const DateStyle = createGlobalStyle`
    .react-datepicker__input-container input {
        border: 1px solid gray;
        border-radius: 10px;
        margin: 3px 2px;
        padding: 5px 5px;
        text-align: center;
        cursor: pointer;
        caret-color: transparent;
    }
    .react-datepicker__input-container input:disabled {
        background-color: #f0f0f0; 
        color: #a9a9a9; 
    }
`

const DownloadButton = styled.button`
    width:150px; border:none; border-radius:5px; padding:10px 20px; margin:10px 5px; background-color:black; color:white; font-weight:bold; cursor:pointer;
`

const UploadButton = styled.button`
    width:150px; border:none; border-radius:5px; padding:10px 20px; margin:10px 5px; background-color:gray; color:white; font-weight:bold; cursor:pointer;
`



export default AllocateWork