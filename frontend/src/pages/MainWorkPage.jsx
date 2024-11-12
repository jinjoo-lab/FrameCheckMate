import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft } from "react-icons/fa";
import styled from 'styled-components';
import TopBar from "../components/TopBar";
import { axiosClient } from '../axios';
import { allCardView, toDoChange, workingChange, confirmChange, resultChange, videoMerge } from '../api';
import { BASE_URL, USER_URL } from '../axios';

const MainWorkPage = () => {

  const { projectId, projectName } = useParams();

  const navigate = useNavigate();
    
  /* 카드 컨테이너 - 작업전 & 진행중 & 컨펌 & 완료  */
  const [ beforeList, setBeforeList ] = useState([])
  const [ workingList, setWorkingList ] = useState([])
  const [ confirmList, setConfirmList ] = useState([])
  const [ finishList, setFinishList ] = useState([])

  /* 최종 작업 완료 버튼 - true면 보여주기 */
  const [ finalCreate, setFinalCreate ] = useState(false)

  const [ memberData, setMemberData ] = useState([])

  /* toDo로 상태 변경 */
  const toDoMove = async (event, card) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    event.stopPropagation()
    try{
      const cardId = card.cardId
      // 1번
      const response = await fetch(`${BASE_URL}/api/card/${cardId}/toDo`, {
        method: 'PATCH', 
        withCredentials: true,
      });
      // 2번
      // const response = await toDoChange(cardId)
      const answer = await response.json()
      cardSort()
    }catch(error){
      console.log(error)
    }
  }

  /* 작업중으로 상태 변경 */
  const inProgressMove = async (event, card) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    event.stopPropagation() // 버튼만 클릭되도록

    // !!!!! 버튼 이동 요청 성공하는 방식으로 나머지도 다 변경해야함
    try{
      const cardId = card.cardId
      // 1번
      const response = await fetch(`${BASE_URL}/api/card/${cardId}/inProgress`, {
        method: 'PATCH', 
        // credentials: 'include',
        headers: {
          'Access-Control-Allow-Methods':'PATCH',
        },
      // withCredentials: true,
      });
      // 2번
      // const response = await workingChange(cardId)
      const answer = await response.json()

      cardSort()
    }catch(error){
      console.log(error)
    }
  }

  /* 컨펌으로 상태 변경 */
  const confirmMove = async (event, card) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    event.stopPropagation()
    try{
      const cardId = card.cardId
      // 1번
      const response = await fetch(`${BASE_URL}/api/card/${cardId}/confirm`, {
        method: 'PATCH', 
        // withCredentials: true,
        headers: {
          'Access-Control-Allow-Methods':'PATCH',
        },
      });
      // 2번
      // const response = await confirmChange(cardId)
      // const answer = await response.json()
      // console.log(answer)
      const answer = await response.json()
      cardSort()
    }catch(error){
      console.log(error)
    }
  }


  /* 완료로 상태 변경 */
  const completionMove = async (event, card) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    event.stopPropagation()
    try{
      const cardId = card.cardId
      // 1번
      const response = await fetch(`${BASE_URL}/api/card/${cardId}/completion`, {
        method: 'PATCH', 
        withCredentials: true,
      });
      // 2번
      // const response = await resultChange(cardId)
      const answer = await response.json()
      cardSort()
    }catch(error){
      console.log(error)
    }
  }

  // /* 버튼 이동 - 컨펌 → 작업 중 */
  // const thirdBackMove = async (event, card) => {
  //   event.preventDefault(); // 페이지 새로 고침 방지
  //   event.stopPropagation()
  //   try{
  //     const cardId = card.cardId
  //     // 1번
  //     const response = await fetch(`http://k11a607.p.ssafy.io:8080/api/card/${cardId}/inProgress`, {
  //     // const response = await fetch(`${BASE_URL}/api/card/${cardId}/inProgress`, {
  //       method: 'PATCH', 
  //       withCredentials: true,
  //     });
  //     // 2번
  //     // const response = await workingChange(cardId)
  //     // const answer = await response.json()
  //     cardSort()
  //   }catch(error){
  //     console.log(error)
  //   }
  // }

  /* 페이지 이동 */
  const memberCheck = () => {
    navigate(`/manageMember/${projectId}/${projectName}`);
  }


  const videoAdd = () => {
    navigate(`/uploadVideo/${projectId}`);
  }

  // 최종 작업 페이지
  const resultPage = async () => {
    try{
      //1번
      // const accessToken = localStorage.getItem('accessToken');
      console.log('영상만들어요')
      
      const response = await fetch(`${BASE_URL}/api/frame/merge/${projectId}`, {
        method: 'POST',
        // headers: { access: `${accessToken}` },
      });
      // 2번
      // const response = await videoMerge(projectId)
      // const text = await response.json();
      console.log(response)
      alert('병합한 영상 생성이 완료되었습니다')
      navigate(`/resultWork/${projectId}`)
    }catch(error){
      alert('영상 병합에 실패했습니다')
      console.log(`최종 영상 생성 실패:${error}`)
    }
  }

  /* 카드 분배 - 진행 상황 속성에 따라 카드 컨테이너에 넣기 */
  const cardSort = async() => {
    // const testId = '123e4567-e89b-12d3-a456-426614174002'
    // !!!!! projectCompleted: false -> true일 때 전체 생성 버튼
    setBeforeList([])
    setWorkingList([])
    setConfirmList([])
    setFinishList([])
    try{
      const response = await fetch(`${BASE_URL}/api/card/${projectId}`, {
        method: 'GET',
        withCredentials: true,
      });
      const answer = await response.json()
      console.log(answer)
      if (answer && answer.cardsByStatus && answer.cardsByStatus.TODO) {
        setBeforeList(answer.cardsByStatus.TODO);
      }
      if (answer && answer.cardsByStatus && answer.cardsByStatus.IN_PROGRESS) {
        setWorkingList(answer.cardsByStatus.IN_PROGRESS);
      }
      if (answer && answer.cardsByStatus && answer.cardsByStatus.PENDING_CONFIRMATION) {
        setConfirmList(answer.cardsByStatus.PENDING_CONFIRMATION);
      }
      if (answer && answer.cardsByStatus && answer.cardsByStatus.COMPLETED) {
        setFinishList(answer.cardsByStatus.COMPLETED);
      }
      if (answer && answer.projectCompleted) {
        setFinalCreate(answer.projectCompleted)
      }
    }catch(error){
      console.log(`카드 요청 조회 문제 ${error}`)
    }
  }

    /* 현재 속한 프로젝트의 멤버 목록 불러오기 */
    const memberImport = async() => {
      try{
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(`${USER_URL}/api/project/${projectId}/members`, {
          method: 'GET',
          headers: { access: `${accessToken}` },
        });
        const members = await response.json()
        console.log(members)
        const emailCheck = localStorage.getItem('myEmail')
        const idCheck = members.find(data => data.email === emailCheck);
        const idInfo = (idCheck.memberId)
        localStorage.setItem('myId', idInfo);
        // setMemberData(members)
      }catch(error){
        console.log(error)
      }
    }

  /* 처음 접속 시 전체 카드 목록 불러오기 */
  useEffect(() => {
    cardSort();
    console.log(projectId)
    const abc = localStorage.getItem('managerId')
    console.log(`관리자 아이디 : ${abc}`)
    const def = localStorage.getItem('isFinished') // string type으로 확인 필요
    console.log(`작업 완료?: ${def}`)
    console.log(typeof def)
    memberImport()
  }, []); 
    
  return(
    <div>
      <TopBar logoutView={true}/>
      <TitleContainer>
        <BigTextGroupName>그룹 이름</BigTextGroupName>
        <Block>
          <BigText onClick={memberCheck}>멤버 관리</BigText>
          <BigText onClick={videoAdd}>영상 분석</BigText>
        </Block>
      </TitleContainer>
      <BigContainer>
        {/* 작업 전 목록 */}
        <CardContainer>
          <div>작업 전</div>
          { beforeList.length == 0 
          ? ( <NoCardView>분할 된 영상이 없습니다</NoCardView> )
          : (
          <CardScroll>
            { beforeList.map(card => 
            <Link 
              to={`/beforeWork/${card.projectId}/${card.cardId}`}
              key={card.frameId} 
              style={{
                color:'inherit',
                textDecoration:'none',
                width:'200px',
                padding:"15px 10px",
                height:'100px', 
                border:"1px solid black",
                margin:"5px 0px",
                justifyContent:"center",
                alignItems:"center"
              }}>
              <MoveButtonContainer>
                <MoveButton onClick={(event) => {inProgressMove(event, card)}}>
                  <FaRegArrowAltCircleRight size={25} />
                </MoveButton>
              </MoveButtonContainer>
              <CardView>
                {/* {card.order} 작업 */}
                { card.workerId == null 
                  ? (<>작업자 미배정</>)
                  : (<>작업자 : {card.workerId}</>)}
              </CardView>
            </Link>
            )}
          </CardScroll>
          )}
          <div>분할 완료</div>
        </CardContainer>

        {/* 작업 중 목록 */}
        <CardContainer>
          <div>작업중</div>
            { workingList.length == 0 
              ? ( <NoCardView>작업 중인 영상이 없습니다</NoCardView> )
              : (
                <CardScroll>
                  { workingList.map(card => 
                    <Link
                      to={`/working/${card.projectId}/${card.cardId}`}
                      key={card.frameId} 
                      style={{
                        color:'inherit',
                        textDecoration:'none',
                        width:'200px',
                        padding:"15px 10px",
                        height:'100px',
                        border:"1px solid black",
                        margin:"5px 0px",
                        justifyContent:"center",
                        alignItems:"center"
                      }}>                        
                      <MoveButtonContainer>
                        <MoveButton onClick={(event)=>{toDoMove(event, card)}}>
                          <FaRegArrowAltCircleLeft size={25} />
                        </MoveButton>
                        <MoveButton onClick={(event) => {confirmMove(event, card)}}>
                          <FaRegArrowAltCircleRight size={25} />
                        </MoveButton>
                      </MoveButtonContainer>
                      <CardView>
                        {/* {card.order}번 작업 */}
                        { card.workerId == null 
                        ? (<>작업자 미배정</>)
                        : (<>작업자 : {card.workerId}</>)}
                      </CardView>
                    </Link>
                    )
                  }
                </CardScroll>
              )
            }
          <div>작업 전/후</div>
        </CardContainer>

        {/* 컨펌 목록 */}
        <CardContainer>
          <div>컨펌</div>
          { confirmList.length == 0 
            ? ( <NoCardView>컨펌 대상 영상이 없습니다</NoCardView> )
            : (
              <CardScroll>
                { confirmList.map(card => 
                
                  <Link
                    to={`/confirmWorking/${card.projectId}/${card.cardId}`}
                    key={card.frameId} 
                    style={{
                      color:'inherit',
                      textDecoration:'none',
                      width:'200px',
                      padding:"15px 10px",
                      height:'100px', 
                      border:"1px solid black",
                      margin:"5px 0px",
                      justifyContent:"center",
                      alignItems:"center"
                    }}>
                    <MoveButtonContainer>
                      <MoveButton onClick={(event)=>{inProgressMove(event, card)}}>
                        <FaRegArrowAltCircleLeft size={25} />
                      </MoveButton>
                      <MoveButton onClick={(event) => {completionMove(event, card)}}>
                        <FaRegArrowAltCircleRight size={25} />
                      </MoveButton>
                    </MoveButtonContainer>
                    <CardView>
                      {/* {card.order}번 작업 */}
                      { card.workerId == null 
                        ? (<>작업자 미배정</>)
                        : (<>작업자 : {card.workerId}</>)}
                    </CardView>
                  </Link>
                  )
                }
              </CardScroll>
            )
          }
          <div>컨펌 필요</div>
        </CardContainer>

        {/* 완료 목록 */}
        <CardContainer>
          <div>완료</div>
          { finishList.length == 0 
            ? ( <NoCardView>컨펌 완료 된 영상이 없습니다</NoCardView> )
            : (
              <CardScroll>
                { finishList.map(card => 
                  <Link 
                    to={`/doneWork/${card.projectId}/${card.cardId}`}
                    key={card.frameId} 
                    style={{
                      color:'inherit',
                      textDecoration:'none',
                      width:'200px',
                      padding:"15px 10px",
                      height:'100px', 
                      border:"1px solid black",
                      margin:"5px 0px",
                      justifyContent:"center",
                      alignItems:"center"
                    }}>
                    <CardView>
                      {/* {card.order}번 작업 */}
                      { card.workerId == null 
                        ? (<>작업자 미배정</>)
                        : (<>작업자 : {card.workerId}</>)}
                    </CardView>
                  </Link>
                  )
                }
              </CardScroll>
            )
          }
          { finalCreate == true
          ? 
          <MakeButton onClick={resultPage}>
            최종 생성
          </MakeButton>
          : null
          }

        </CardContainer>
      </BigContainer>
    </div>
  )
}

const TitleContainer = styled.div`
  color: black;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Block = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`
const BigText = styled.div`
  width:150px;
  border:none;
  border-radius:5px;
  font-size:25px;
  padding:10px 10px;
  background-color:black;
  color:white;
  font-weight:bold;
  font-weight: bold;
  font-size: 30px;
  cursor:pointer;
  text-align:center;
  border: 1px solid black;
  margin: 0px 10px;
`
const BigTextGroupName = styled.div`
  font-weight: bold;
  font-size: 30px;
  cursor:default;
  margin left: 20px
`
const BigContainer = styled.div`
  color: black;
  height: 700px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin:0px 20px;
`
const CardContainer = styled.div`
  display:flex;
  flex-direction:column;
  font-weight: bold;
  align-items:center;
  justify-content:space-between;
  font-size: 30px;
  margin: 0px 5px;
  padding:30px;
  border:1px solid black;
  width:300px;
  height:600px;
`
const NoCardView = styled.div`
  height:70%;
  display:flex;
  font-size:15px;
  align-items:center;
  justify-content:center;
`
const CardScroll = styled.div`
  height:60%;
  display:flex;
  font-size:15px;
  align-items:center;
  flex-direction:column;
  overflow-y: auto;
  margin:20px 0px;
`
const MoveButtonContainer = styled.div`
  display:flex;
  justify-content:flex-end;
`
const MoveButton = styled.button`
  border:none;
  outline:none;
  background-color:inherit;
  cursor:pointer;
`
const CardView = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
`
const MakeButton = styled.button`
  width:150px;
  border:none;
  border-radius:5px;
  font-size:25px;
  padding:10px 20px;
  background-color:black;
  color:white;
  font-weight:bold;
  text-align:center;
  cursor:pointer;
`

export default MainWorkPage