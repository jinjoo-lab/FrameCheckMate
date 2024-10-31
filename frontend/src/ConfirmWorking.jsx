import React, { useState, useEffect } from 'react';
import TopBar from "./TopBar";
import { useNavigate, Link } from 'react-router-dom';
import FeedbackAllocateWork from './FeedbackAllocateWork';
import styled from 'styled-components'

const ConfirmWorking = () => {

    const navigate = useNavigate();

    const closeButton = () => {
        navigate('/mainWorkPage');
      }

    const uploadButton = () => {
        navigate('/mainWorkPage')
    }
    return(
        <div>
            <TopBar title='컨펌' logoutView={true}/>
            <RowContainer>
                <FeedbackAllocateWork confirmView={true} confirmTitle='컨펌 취소하기' commentView={false} workingBefore={false} uploadView={true}/>
                <ButtonAlign>
                    <ConfirmButton onClick={uploadButton}>컨펌 완료</ConfirmButton>
                    <ConfirmCloseButton onClick={closeButton}>닫기</ConfirmCloseButton>
                </ButtonAlign>
            </RowContainer>
        </div>
    )
}

const RowContainer = styled.div`
    border:4px dashed black; width:90%; padding:60px 10px; height:100%; display:flex; justify-content:center; align-items:center; margin:0 auto; flex-direction:column;
`
const ButtonAlign = styled.div`
    width:100%; display:flex; justify-content:center; flex-direction:row;  
`
const ConfirmButton = styled.div`
    width:150px; border:none; border-radius:5px; padding:10px 20px; margin:10px 5px; background-color:black; text-align:center; color:white; font-weight:bold;
`
const ConfirmCloseButton = styled.div`
    width:150px; border:none; border-radius:5px; padding:10px 20px; margin:10px 5px; background-color:gray; text-align:center; color:white; font-weight:bold;
`
export default ConfirmWorking