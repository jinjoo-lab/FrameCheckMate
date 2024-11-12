import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoVideo } from "react-icons/go";
import TopBar from "../components/TopBar";
import Modal from 'react-modal';
import styled from 'styled-components';
import { axiosClient } from '../axios';
import { viewProject, createProject } from '../api';
import { BASE_URL } from '../axios';
import { USER_URL } from '../axios';


const MainHomePage = () => {

  const navigate = useNavigate();

  // 프로젝트 이름 입력값
  const [groupName, setGroupName] = useState('')

  // 프로젝트 목록
  const [groupList, setGroupList] = useState([])

  // 프로젝트 생성 실행
  const makeGroup = async (event) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    try{
      const formData = new FormData();
      formData.append('projectName', groupName);
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${USER_URL}/api/project`, {
        method: 'POST',
        body: formData,
        headers: { access: `${accessToken}` },
      });
      console.log(response)
      if (response.ok){
        alert('프로젝트 생성이 완료되었습니다')

      }
      groupImport()

    }catch(error){
      console.log(`그룹 생성 실패:${error}`)
    }
  }

  // !!!!! 최종 영상 생성
  const resultView = (event, projectId) => {
    navigate(`/resultWork/${projectId}`);
  }

  /* 모달 작동 - true면 실행 false면 닫기 */
  const [modalIsOpen, setIsOpen] = useState(false);

  // 모달 상태 true로 변경
  function openModal() {
    setIsOpen(true);
  }

  // 모달 상태 false로 변경
  function closeModal() {
    setIsOpen(false);
  }

  // 모달 스타일 
  const customStyles = {
    overlay: {
      top:0,
      left:0,
      right:0,
      bottom:0,
      position:'fixed',
      backgroundColor:'rgba(0,0,0,0.6)',
      zIndex:10
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor:'white',
      borderRadius:'20px',
      border:'1px solid black'
    },
  };

  // 메인 작업페이지 이동
  const workView = (event, projectId, projectName, managerId, isFinished) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    localStorage.setItem('managerId', managerId);
    localStorage.setItem('isFinished', isFinished);
    navigate(`/mainWorkPage/${projectId}`);
  }

  // 멤버 관리 페이지 이동
  const memberView = (event, projectId) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    navigate(`/manageMember/${projectId}`);
  }

  // 프로젝트 목록 조회
  const groupImport = async() => {
    try{
      const response = await viewProject()
      const groupData = response.data
      console.log(groupData)
      setGroupList(groupData)
    }catch(error){
      console.log(`그룹조회 에러 ${error}`)
    }
  }
  
  /* 처음 접속 시 현재 있는 프로젝트 불러오기 */
  useEffect(() => {

    groupImport()

  },[])

  return(
    <div>
      <TopBar title={'그룹 리스트'} logoutView={true}/>
      <RowContainer> 
        {/* 그룹 목록 */}
        <GroupScroll>
          { groupList.length == 0
          ? <div>그룹 정보가 없습니다</div>
          : (
            <>
              { groupList.map((list) => 
                <GroupView key={list.projectId}>
                  <GroupText onClick={(event) => {workView(event, list.projectId, list.name, list.managerId, list.isFinished)}}>{list.name}</GroupText>
                  {/* <GroupText onClick={(event) => {workView(event, list.projectId)}}>{list.name}</GroupText> */}
                  { list.isFinished == true ? 
                    <PlayButton onClick={(event) => {resultView(event, list.projectId)}}> 
                      <GoVideo size={50} /> 
                    </PlayButton>
                    : null
                  }
                </GroupView>
              )}
            </>
            )
          }

        </GroupScroll>
        <ModalClick onClick={openModal}>그룹 생성</ModalClick>
      </RowContainer>

      {/* 모달 */}
      <Modal
        isOpen={modalIsOpen}
        ariaHideApp={false} 
        style={customStyles}>
        <ModalContainer> 
          <h2>그룹 생성</h2>
          <ModalContent>
            <h3>그룹 이름</h3>
            <GroupInput type="text" onChange={(event) => setGroupName(event.target.value)} />
            <ButtonAlignBox>
              <GroupButton onClick={makeGroup}>그룹 만들기</GroupButton>
              <ModalClose onClick={closeModal}>닫기</ModalClose>
            </ButtonAlignBox>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </div>
  )
};

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
const GroupScroll = styled.div`
  width:80%;
  height:300px;
  overflow-y:auto;
  margin:40px 20px;
  display:flex;
  flex-direction:column;
  align-items:center;
`
const GroupView = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  border-bottom:3px solid black;
  margin:15px 0px;
  width:80%;
`
const GroupText = styled.p`
  font-size:25px;
  font-weight:bold;
  margin:0;
  cursor:pointer;
`
const PlayButton = styled.button`
  border:none;
  outline:none;
  background-color:inherit;
  cursor:pointer;
`
const ModalClick = styled.button`
  width:150px;
  border:none;
  border-radius:5px;
  padding:5px 10px;
  background-color:black;
  color:white;
  font-weight:bold;
  cursor:pointer;
`
const ModalContainer= styled.div`
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  padding:0px 30px 40px 40px;
`
const ModalContent = styled.div`
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:flex-start;
  margin:10px 0px
`
const ButtonAlignBox = styled.div`
  display:flex;
  flex-direction:row;
`
const GroupButton = styled.button`
  width:150px;
  border:none;
  border-radius:5px;
  padding:10px 20px;
  background-color:black;
  margin:5px;
  color:white;
  font-weight:bold;
  cursor:pointer;
`
const ModalClose = styled.button`
  width:150px;
  border:none;
  border-radius:5px;
  padding:10px 20px;
  background-color:gray;
  margin:5px;
  color:white;
  font-weight:bold;
  cursor:pointer;
`
const GroupInput = styled.input`
  border:1px solid gray;
  border-radius:10px;
  margin:10px 0px;
  height:30px;
  width:300px;
`
export default MainHomePage