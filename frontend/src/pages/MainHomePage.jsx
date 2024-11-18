import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoVideo } from "react-icons/go";
import TopBar from "../components/TopBar";
import Modal from 'react-modal';
import styled from 'styled-components';
import { viewProject } from '../api';
import { USER_URL } from '../axios';
import { FcVideoFile } from "react-icons/fc";
import { toast } from "react-toastify";

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
      // ★★★★★★★★★★★★★★★★★★★★★★★
			if (response.status === 401 || response.status === 500) {
				console.log('???');
				// alert('로그인이 만료되었습니다')
				navigate('/loginSignup')
			}
      if (response.ok){
        // toast.success(`프로젝트 생성이 완료되었습니다`);
        alert(`프로젝트 생성이 완료되었습니다`)
        setIsOpen(false);
      }
      groupImport()

    }catch(error){
      alert(`프로젝트 생성에 실패했습니다`)
      setIsOpen(false);
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
    localStorage.setItem('projectName', projectName)
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
      // ★★★★★★★★★★★★★★★★★★★★★★★
			if (response.status === 401 || response.status === 500) {
				// alert('로그인이 만료되었습니다')
				navigate('/loginSignup')
			}
      const groupData = response.data
      setGroupList(groupData)
    }catch(error){
      console.log(`그룹조회 에러 ${error}`)
			navigate('/loginSignup')
    }
  }
  
  /* 처음 접속 시 현재 있는 프로젝트 불러오기 */
  useEffect(() => {

    groupImport()

  },[])

  return(
    <div>
      <TopBar title={'프로젝트 리스트'} logoutView={true}/>
      <RowContainer> 
        {/* 그룹 목록 */}
        <GroupScroll>
          { groupList.length == 0
          ? <div>그룹 정보가 없습니다</div>
          : (
            <>
              { groupList.map((list) => 
                <GroupView  key={list.projectId}
                            onClick={(event) => {workView(event, list.projectId, list.name, list.managerId, list.isFinished)}}>
                  &nbsp;&nbsp;<FcVideoFile size={30} />&nbsp;&nbsp;&nbsp;
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
        <ModalClick onClick={openModal}>프로젝트 생성</ModalClick>
      </RowContainer>

      {/* 모달 */}
      <Modal
        isOpen={modalIsOpen}
        ariaHideApp={false} 
        style={customStyles}>
        <ModalContainer> 
          <h2>프로젝트 생성</h2>
          <ModalContent>
            <div style={{margin:"5px 15px", width:'90%'}}>프로젝트 이름</div>
            <GroupInput type="text" onChange={(event) => setGroupName(event.target.value)} />
            <ButtonAlignBox>
              <GroupButton onClick={makeGroup}>생성하기</GroupButton>
              <ModalClose onClick={closeModal}>닫기</ModalClose>
            </ButtonAlignBox>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </div>
  )
};

const RowContainer = styled.div`
  width:50%;
  padding:60px 10px;
  height:100%;
  display:flex;
  justify-content:center;
  align-items:center;
  margin:20px auto;
  flex-direction:column;
	border:1px solid #ccc;
	box-shadow:0px 8px 7px rgba(0, 0, 0, 0.4);
  border-radius:10px;
  background-color: rgba(50, 50, 120, 0.03); 
`
const GroupScroll = styled.div`
  width:80%;
  height:300px;
  overflow-y:auto;
  margin:40px 20px;
  display:flex;
  flex-direction:column;
  align-items:center;
  &::-webkit-scrollbar {
	padding:10px 5px;
  border-radius: 10px;
	width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #ccc;
  }
`
const GroupView = styled.div`
	// border:1px solid #333; 
	border-radius:10px;
  background-color:white;
	box-shadow:0 5px 6px rgba(0, 0, 100, 0.23);
	width:75%;
  margin:10px 0px;
	padding:20px 20px; 
	display:flex; 
	flex-direction:row; 
  cursor:pointer;
`
const GroupText = styled.p`
  font-size:20px;
  font-weight:bold;
  margin:0px 10px;
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
  border-radius:20px;
  padding:10px 20px;
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
  padding:0px 50px 30px 40px;
`
const ModalContent = styled.div`
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  margin:10px 0px;
  padding:30px 30px 10px 30px;
`
const ButtonAlignBox = styled.div`
  display:flex;
  flex-direction:row;
  margin-top:40px; 
`
const GroupButton = styled.button`
  width:100px;
  border:none;
  border-radius:20px;
  padding:0px 0px;
  background-color:black;
  margin:5px 10px;
  color:white;
  font-weight:bold;
  font-size:12px;
  cursor:pointer;
`
const ModalClose = styled.button`
  width:100px;
  border:none;
  border-radius:20px;
  padding:10px;
  background-color:gray;
  margin:5px;
  color:white;
  font-weight:bold;
  font-size:12px;
  cursor:pointer;
`
const GroupInput = styled.input`
  border:1px solid gray;
  border-radius:10px;
  margin:10px 0px;
  padding:0px 10px;
  height:30px;
  width:90%;
`
export default MainHomePage