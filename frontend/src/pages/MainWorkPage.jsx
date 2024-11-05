import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft } from "react-icons/fa";
import styled from 'styled-components';
import TopBar from "../components/TopBar";
import { axiosClient } from '../axios';

const MainWorkPage = () => {

  const navigate = useNavigate();

  /* 임시 카드리스트 */
  const [cardList, setCardList] = useState([
    {number:1, type:'a', content:'영상1', time:'00:01:00~00:02:00'},
    {number:2, type:'b', content:'영상2', time:'00:02:00~00:03:00'},
    {number:3, type:'c', content:'영상3', time:'00:03:00~00:06:00'},
    {number:4, type:'d', content:'영상4', time:'00:06:00~00:10:00'},
    {number:5, type:'a', content:'영상5', time:'00:10:00~00:12:00'},
    {number:6, type:'c', content:'영상6', time:'00:12:00~00:13:00'},
    {number:7, type:'c', content:'영상7', time:'00:13:00~00:14:00'},
    {number:8, type:'b', content:'영상8', time:'00:14:00~00:17:00'},
    {number:9, type:'b', content:'영상9', time:'00:17:00~00:18:00'},
    {number:10, type:'d', content:'영상10', time:'00:18:00~00:30:00'},
    {number:11, type:'d', content:'영상11', time:'00:18:00~00:30:00'},
    {number:12, type:'a', content:'영상12', time:'00:18:00~00:30:00'},
    {number:13, type:'a', content:'영상13', time:'00:18:00~00:30:00'},
  ])
    
  /* 카드 컨테이너 - 작업전 & 진행중 & 컨펌 & 완료  */
  const [ beforeList, setBeforeList ] = useState([])
  const [ workingList, setWorkingList ] = useState([])
  const [ confirmList, setConfirmList ] = useState([])
  const [ finishList, setFinishList ] = useState([])

  /* 버튼 이동 - 작업 전 → 작업 중 */
  const firstMove = (event, card) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    event.stopPropagation()
    setCardList(prev => {
      return prev.map(list => list.number === card.number ? {...list, type:'b'} : list)
    })
  }

  /* 버튼 이동 - 작업  중 → 컨펌 */
  const secondMove = (event, card) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    event.stopPropagation()
    setCardList(prev => {
      return prev.map(list => list.number === card.number ? {...list, type:'c'} : list)
    })
  }

  /* 버튼 이동 - 작업 중 → 작업 전 */
  const secondBackMove = (event, card) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    event.stopPropagation()
    setCardList(prev => {
      return prev.map(list => list.number === card.number ? {...list, type:'a'} : list)
    })
  }

  /* 버튼 이동 - 컨펌 → 완료 */
  const thirdMove = (event, card) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    event.stopPropagation()
    setCardList(prev => {
      return prev.map(list => list.number === card.number ? {...list, type:'d'} : list)
    })
  }

  /* 버튼 이동 - 컨펌 → 작업 중 */
  const thirdBackMove = (event, card) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    event.stopPropagation()
    setCardList(prev => {
      return prev.map(list => list.number === card.number ? {...list, type:'b'} : list)
    })
  }

  /* 페이지 이동 */
  const memberCheck = () => {
    navigate('/manageMember');
  }
  const videoAdd = () => {
    navigate('/uploadVideo');
  }
  const resultPage = () => {
    navigate('/resultWork')
  }

  /* 카드 분배 - 진행 상황 속성에 따라 카드 컨테이너에 넣기 */
  const cardSort = () => {
    const listA = []
    const listB = []
    const listC = []
    const listD = []

    cardList.forEach(card => {
      if (card.type == 'a') {
        listA.push(card)
      } else if (card.type == 'b') {
        listB.push(card)
      } else if (card.type == 'c') {
        listC.push(card)
      } else if (card.type == 'd') {
        listD.push(card)
      }
    })
    setBeforeList(listA)
    setWorkingList(listB)
    setConfirmList(listC)
    setFinishList(listD)
  }

  /* 카드 리스트 변화 있을 때 재렌더링 */
  useEffect(() => {
    cardSort();
  }, [cardList]); 
    
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
              to='/beforeWork'
              key={card.number} 
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
                <MoveButton onClick={(event) => {firstMove(event, card)}}>
                  <FaRegArrowAltCircleRight size={25} />
                </MoveButton>
              </MoveButtonContainer>
              <CardView>
                {card.content}
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
                      to='/working'
                      key={card.number} 
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
                        <MoveButton onClick={(event)=>{secondBackMove(event, card)}}>
                          <FaRegArrowAltCircleLeft size={25} />
                        </MoveButton>
                        <MoveButton onClick={(event) => {secondMove(event, card)}}>
                          <FaRegArrowAltCircleRight size={25} />
                        </MoveButton>
                      </MoveButtonContainer>
                      <CardView>
                        {card.content}
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
                    to='/confirmWorking'
                    key={card.number} 
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
                      <MoveButton onClick={(event)=>{thirdBackMove(event, card)}}>
                        <FaRegArrowAltCircleLeft size={25} />
                      </MoveButton>
                      <MoveButton onClick={(event) => {thirdMove(event, card)}}>
                        <FaRegArrowAltCircleRight size={25} />
                      </MoveButton>
                    </MoveButtonContainer>
                    <CardView>
                      {card.content}
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
                    to='/doneWork'
                    key={card.number} 
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
                      {card.content}
                    </CardView>
                  </Link>
                  )
                }
              </CardScroll>
            )
          }
          <MakeButton onClick={resultPage}>
            최종 생성
          </MakeButton>
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