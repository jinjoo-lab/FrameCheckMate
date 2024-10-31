import React, { useState, useEffect } from 'react';
import TopBar from "./TopBar";
import { useNavigate, Link } from 'react-router-dom';
import FeedbackAllocateWork from './FeedbackAllocateWork';
import styled from 'styled-components'

const DoneWork = () => {

    const navigate = useNavigate();

    const closeButton = () => {
        navigate('/mainWorkPage');
      }

    const uploadButton = () => {
        navigate('/mainWorkPage')
    }

    return(
        <div>
            <TopBar title='작업 완료 영상' logoutView={true}/>
            <DoneContainer>
                <FeedbackAllocateWork confirmView={true} confirmTitle='작업 재요청' commentView={false} workingBefore={false} uploadView={false}/>
                <ButtonsAlign>
                    <DoneCloseButton onClick={closeButton}>닫기</DoneCloseButton>
                </ButtonsAlign>
            </DoneContainer>
        </div>
    )
}

const DoneContainer = styled.div`
    border:4px dashed black; width:90%; padding:10px; height:100%; display:flex; justify-content:center; align-items:center; margin:0 auto; flex-direction:column;
`
const ButtonsAlign = styled.div`
    display:flex; justify-content:center; flex-direction:row;  
`
const DoneCloseButton = styled.div`
    width:150px; border:none; border-radius:5px; padding:10px 20px; margin:10px 5px; background-color:gray; text-align:center; color:white; font-weight:bold;
`

export default DoneWork