import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoVideo } from "react-icons/go";
import { ko } from "date-fns/locale";
import TopBar from "../components/TopBar";
import Modal from 'react-modal';
import styled from 'styled-components';

const MainHomePage = () => {

  const navigate = useNavigate();

  const makeGroup = (event) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    navigate('/manageMember');
  }

  const resultView = () => {
    navigate('/resultWork');
  }

  /* 모달 작동 */
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  /* 모달 스타일 */
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

  const workView = (event) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    navigate('/mainWorkPage');
  }

  const [groupName, setGroupName] = useState('')

  const [groupList, setGroupList] = useState([])

  const groupImport = () => {
    const response = [
      {number:1, name:'영상 수정', confirm:false},
      {number:2, name:'드라마 편집', confirm:true},
      {number:3, name:'모자이크 처리', confirm:true},
      {number:4, name:'모자이크 처리', confirm:false},
      {number:5, name:'모자이크 처리', confirm:true},
      {number:6, name:'모자이크 처리', confirm:true}
    ]

    setGroupList(response)
  }

  useEffect(() => {
    groupImport()
  },[])

  return(
    <div>
      <TopBar title={'그룹 리스트'} logoutView={true}/>
      <RowContainer> 
        {/* 그룹 목록 */}
        <GroupScroll>
          { groupList.map((list) => 
            <GroupView key={list.number}>
              <GroupText onClick={workView}>{list.name}</GroupText>
              { list.confirm ? 
                <PlayButton onClick={resultView}> 
                  <GoVideo size={50} /> 
                </PlayButton>
                : null
              }
            </GroupView>
          )}
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