import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import TopBar from "../components/TopBar";
import { BASE_URL, USER_URL } from '../axios';
import { FaUserCircle } from "react-icons/fa";
import { IoMdArrowDroprightCircle } from "react-icons/io";
import { IoMdArrowDropleftCircle } from "react-icons/io";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import { toast } from "react-toastify";
import { MdLocalMovies } from "react-icons/md";
import LoadingCircle from '../components/LoadingCircle';

const MainWorkPage = () => {

  const { projectId } = useParams();

  const navigate = useNavigate();
    
  /* 카드 컨테이너 - 작업전 & 진행중 & 컨펌 & 완료  */
  const [ beforeList, setBeforeList ] = useState([])
  const [ workingList, setWorkingList ] = useState([])
  const [ confirmList, setConfirmList ] = useState([])
  const [ finishList, setFinishList ] = useState([])

  /* 최종 작업 완료 버튼 - true면 보여주기 */
  const [ finalCreate, setFinalCreate ] = useState(false)

  const [ memberData, setMemberData ] = useState([])

  /* 관리자 아이디 체크 */
  const [ managerCheck, setManagerCheck ] = useState('what')

  /* 내 아이디 체크 */
  const [ myUUID, setMyUUID ] = useState('')

  const [ pjName, setPjName ] = useState('')

  const [ finalStatus, setFinalStatus ] = useState('')

  const [ videoUploadView, setVideoUploadView ] = useState(false)

  const [loading, setLoading] = useState(false); // 로딩 상태 변수 추가

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
    // ★★★★★★★★★★★★★★★★★★★★★★★
    if (response.status === 401 || response.status === 500) {
      console.log('???');
      // alert('로그인이 만료되었습니다')
      navigate('/loginSignup')
    }
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

      // ★★★★★★★★★★★★★★★★★★★★★★★
      if (response.status === 401 || response.status === 500) {
        console.log('???');
        // alert('로그인이 만료되었습니다')
        navigate('/loginSignup')
      }
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
      // ★★★★★★★★★★★★★★★★★★★★★★★
    if (response.status === 401 || response.status === 500) {
      console.log('???');
      // alert('로그인이 만료되었습니다')
      navigate('/loginSignup')
    }
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
      // ★★★★★★★★★★★★★★★★★★★★★★★
      if (response.status === 401 || response.status === 500) {
        console.log('???');
        // alert('로그인이 만료되었습니다')
        navigate('/loginSignup')
      }
      const answer = await response.json()
      cardSort()
    }catch(error){
      console.log(error)
    }
  }

  /* 페이지 이동 */
  const memberCheck = () => {
    navigate(`/manageMember/${projectId}`);
  }

  const videoAdd = () => {
    navigate(`/uploadVideo/${projectId}`);
  }

  const resultVideoPage = () => {
    navigate(`/resultWork/${projectId}`)
  }

  // 최종 작업 페이지
  const resultPage = async () => {
    setLoading(true); // 로딩 시작
    try{
      //1번
      // const accessToken = localStorage.getItem('accessToken');
      console.log('영상만들어요')
      
      const response = await fetch(`${BASE_URL}/api/frame/merge/${projectId}`, {
        method: 'POST',
        // headers: { access: `${accessToken}` },
      });
      // ★★★★★★★★★★★★★★★★★★★★★★★
      if (response.status === 401 || response.status === 500) {
        console.log('???');
        // alert('로그인이 만료되었습니다')
        navigate('/loginSignup')
      }
      if (response.ok){
        setLoading(false); 
        alert(`영상 병합이 완료되었습니다`)
        navigate(`/resultWork/${projectId}`)
      }else{
        setLoading(false); 
        alert(`영상 병합에 실패했습니다`)
      }
    }catch(error){
      setLoading(false); 
      alert(`영상 병합에 실패했습니다`)
      console.log(`최종 영상 생성 실패:${error}`)
    }
  }

  /* 카드 분배 - 진행 상황 속성에 따라 카드 컨테이너에 넣기 */
  const cardSort = async() => {
    // !!!!! projectCompleted: false -> true일 때 전체 생성 버튼
    setBeforeList([])
    setWorkingList([])
    setConfirmList([])
    setFinishList([])
    // const accessToken = localStorage.getItem('accessToken');
    try{
      const response = await fetch(`${BASE_URL}/api/card/${projectId}`, {
        method: 'GET',
        // withCredentials: true,
        // headers: { access: `${accessToken}` },
      });
      // ★★★★★★★★★★★★★★★★★★★★★★★
      if (response.status === 401 || response.status === 500) {
        console.log('???');
        // alert('로그인이 만료되었습니다')
        navigate('/loginSignup')
      }
        
      const answer = await response.json()

      if (Object.keys(answer.cardsByStatus).length == 0){
        setVideoUploadView(true)
      } else{
        setVideoUploadView(false)
      }
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

        // ★★★★★★★★★★★★★★★★★★★★★★★
        if (response.status === 401 || response.status === 500) {
          console.log('???');
          // alert('로그인이 만료되었습니다')
          navigate('/loginSignup')
        }
        const members = await response.json()
        const emailCheck = localStorage.getItem('myEmail')
        const idCheck = members.find(data => data.email === emailCheck);
        const idInfo = (idCheck.memberId)
        localStorage.setItem('myId', idInfo);
        const manager = localStorage.getItem('managerId')
        setMyUUID(idInfo)
        if (manager == idInfo) {
          setManagerCheck('ok')
        } else{
          setManagerCheck('false')
        }
        setMemberData(members)
        // alert(`내가 매니저인가요/ ${managerCheck} / 내 아이디 ${idInfo} / 매니저 아이디 ${manager}`)
      }catch(error){
        console.log(error)
      }
    }

  /* 최종 영상 여부 확인 */
  const finalView = async() => {
		try{
      const response = await fetch(`${BASE_URL}/api/frame/merged/${projectId}`, {
        method: 'GET',
        withCredentials: true,
      });
      // ★★★★★★★★★★★★★★★★★★★★★★★
      if (response.status === 400 || response.status === 401 || response.status === 500) {
        // console.log('확인확이확인')
        // console.log('미완성입니다')
        setFinalStatus('미완성')
      } else{
        // console.log('확인확인확인')
        // console.log('완성입니다')
        setFinalStatus('완성')
      }
      // console.log('?@?>W#?RF>A0')
      // console.log(response)
      
    }catch(error){
      console.log(`최종 영상 에러 ${error}`)
    }
  }

  /* 처음 접속 시 전체 카드 목록 불러오기 */
  useEffect(() => {
    cardSort();
    const abc = localStorage.getItem('managerId')
    const def = localStorage.getItem('isFinished') // string type으로 확인 필요
    const projectName = localStorage.getItem('projectName')
    setPjName(projectName)
    memberImport()
  }, []); 

  useEffect(() => {
    finalView()
  }, [managerCheck, myUUID, finalStatus])

  const getWorkerName = (workerId) => {
    const worker = memberData.find((worker) => worker.memberId == workerId);
    return worker ? worker.name : '이름을 가져올 수 없습니다.';
  };
    
  return(
    <div>
      <TopBar logoutView={true}/>
      <TitleContainer>
        <BigTextGroupName><MdLocalMovies size={30}/>&nbsp;{pjName}</BigTextGroupName>
        <Block>
          { managerCheck== 'ok'
          ?
          (
            <>
            <BigText onClick={memberCheck}>멤버 관리</BigText>
            { videoUploadView == true
            ? <BigText onClick={videoAdd}>영상 분석</BigText>
            : null
            }
            </>
          )
          :null
          }
        </Block>
      </TitleContainer>
      <BigContainer>
        {/* 작업 전 목록 */}
        <CardContainer>

        <div style={{height:'150px', width:'100%'}}>
            <div style={{textAlign:"center"}}>
            <MdOutlineSlowMotionVideo size={30} style={{color:"gray" }}/>
            <h5>작업 전</h5>
            </div>
            <div style={{width:"100%", borderBottom:"3px solid gray", margin:"10px 0px 0px 0px"}}></div>
          </div>
          { beforeList.length == 0 
          ? ( <NoCardView>분할 된 영상이 없습니다</NoCardView> )
          : (
          <CardScroll>
            { beforeList.map(card => 
            <Link 
              // to={`/beforeWork/${card.projectId}/${card.cardId}`}
              to={`/beforeWork/${card.projectId}/${card.cardId}` }
              state={{allotId:card.workerId, 
                      allotContent:card.description, 
                      allotStart:card.startDate,
                      allotEnd:card.endDate}}
              key={card.frameId} 
              style={{
                      color:'inherit',
                      textDecoration:'none',
                      width:'200px',
                      height:'150px',
                      minHeight:'150px',
                      border:"1px solid gray",
                      borderRadius:"10px",
                      margin:"5px",
                      justifyContent:"center",
                      alignItems:"center",
                      boxShadow:"0 5px 5px rgba(0, 0, 0, 0.15)",
              }}>
              <div style={{backgroundColor:"#2a2c5d", height:"65%", borderRadius:"10px 10px 0px 0px"}}>
              <MoveButtonContainer>
                { card.workerId == null 
                  ?<></>
                  : (
                  <MoveButton onClick={(event) => {inProgressMove(event, card)}}>
                    <IoMdArrowDroprightCircle size={25} style={{color:'#dcdcdc'}}/>
                  </MoveButton>
                  )}
                </MoveButtonContainer>
                <div style={{color:"white", textAlign:"center", fontWeight:"400"}}>
                  {card.workerId == null ? <div></div> : <>{card.description}</>}
                </div>
              </div>
              <CardView>
              { card.workerId == null 
                ? (<div>작업자 미배정</div>)
                : (<>
                  <FaUserCircle size={25}/>
                  &nbsp;
                  {getWorkerName(card.workerId)}</>)}
              </CardView>
            </Link>
            )}
          </CardScroll>
          )}
          <div></div>
        </CardContainer>

        {/* 작업 중 목록 */}
        <CardContainer>
          <div style={{height:'150px', width:'100%'}}>
            <div style={{textAlign:"center"}}>
            <MdOutlineSlowMotionVideo size={30} style={{color:"green", }}/>
            <h5>작업중</h5>
            </div>
            <div style={{width:"100%", borderBottom:"3px solid green", margin:"10px 0px 0px 0px"}}></div>
          </div>
            { workingList.length == 0 
              ? ( <NoCardView>작업 중인 영상이 없습니다</NoCardView> )
              : (
                <CardScroll>
                  { workingList.map(card => 
                    <Link
                      to={`/working/${card.projectId}/${card.cardId}/${card.workerId}`}
                      key={card.frameId} 
                      style={{
                        color:'inherit',
                        textDecoration:'none',
                        width:'200px',
                        height:'150px',
                        border:"1px solid green",
                        borderRadius:"10px",
                        margin:"5px",
                        justifyContent:"center",
                        minHeight:'150px',
                        alignItems:"center",
                        boxShadow:"0 5px 5px rgba(0, 0, 0, 0.15)",
                      }}>          
                      <div style={{backgroundColor:"green", height:"65%", borderRadius:"10px 10px 0px 0px",}}>
                      {/* <div style={{backgroundColor:"#2a2c5d", height:"65%", borderRadius:"10px 10px 0px 0px"}}> */}
                      <MoveButtonContainer>
                          {card.workerId == myUUID
                          ?
                          <>
                          <MoveButton onClick={(event)=>{toDoMove(event, card)}}>
                            <IoMdArrowDropleftCircle size={25} style={{color:'#dcdcdc'}}/>
                          </MoveButton>
                          <MoveButton onClick={(event) => {confirmMove(event, card)}}>
                            <IoMdArrowDroprightCircle size={25} style={{color:'#dcdcdc'}}/>
                          </MoveButton>
                          </>
                          :
                          <div style={{height:'40px'}}></div>
                          }
                      </MoveButtonContainer>
                          <div style={{color:"white", textAlign:"center", fontWeight:"400"}}>
                          {card.workerId == null ? null : <>{card.description}</>}
                          </div>
                        </div>       
                      <CardView>
                        { card.workerId == null 
                        ? (<>작업자 미배정</>)
                        : (<>
										      <FaUserCircle size={25}/>
                          &nbsp;
                          {getWorkerName(card.workerId)}</>)}
                      </CardView>
                    </Link>
                    )
                  }
                </CardScroll>
              )
            }
            <div></div>
        </CardContainer>

        {/* 컨펌 목록 */}
        <CardContainer>
          <div style={{height:'150px', width:'100%'}}>
            <div style={{textAlign:"center"}}>
            <MdOutlineSlowMotionVideo size={30} style={{color:"#F1C232", }}/>
            <h5>컨펌</h5>
            </div>
            <div style={{width:"100%", borderBottom:"3px solid #F1C232", margin:"10px 0px 0px 0px"}}></div>
          </div>
          { confirmList.length == 0 
            ? ( <NoCardView>컨펌 대상 영상이 없습니다</NoCardView> )
            : 
            managerCheck == 'ok'
            ? (
              <CardScroll>
                { confirmList.map(card => 
                  <Link
                    to={`/confirmWorking/${card.projectId}/${card.cardId}/${card.workerId}`}
                    key={card.frameId} 
                    style={{
                      color:'inherit',
                      textDecoration:'none',
                      width:'200px',
                      height:'150px',
                      border:"1px solid gray",
                      borderRadius:"10px",
                      minHeight:'150px', 
                      margin:"5px",
                      justifyContent:"center",
                      alignItems:"center",
                      boxShadow:"0 5px 5px rgba(0, 0, 0, 0.15)",
                    }}>
                    <div style={{backgroundColor:"#F1C232", height:"65%", borderRadius:"10px 10px 0px 0px"}}>
                    <div style={{color:"white", textAlign:"center", fontWeight:"400"}}>
                    <MoveButtonContainer>
                      {/* <MoveButton onClick={(event)=>{inProgressMove(event, card)}}>
                        <FaRegArrowAltCircleLeft size={25} />
                      </MoveButton> */}
                      <MoveButton onClick={(event) => {completionMove(event, card)}}>
                        <IoMdArrowDroprightCircle size={25} style={{color:'white'}} />
                      </MoveButton>
                    </MoveButtonContainer>
                        <div style={{height:"30px",}}>
                        {card.workerId == null ? null : <>{card.description}</>}
                        </div>
                        </div>
                    </div>
                    <CardView>
                    { card.workerId == null 
                      ? (<>작업자 미배정</>)
                      : (<>
                        <FaUserCircle size={25}/>
                        &nbsp;
                        {getWorkerName(card.workerId)}</>)}
                    </CardView>
                  </Link>
                  )
                }
              </CardScroll>
            )
            : 
            (
              <CardScroll>
                { confirmList.map(card => 
                  <div
                    key={card.frameId} 
                    style={{
                      color:'inherit',
                      textDecoration:'none',
                      width:'200px',
                      height:'150px',
                      border:"1px solid #F1C232",
                      borderRadius:"10px",
                      margin:"5px",
                      justifyContent:"center",
                      minHeight:'150px',
                      alignItems:"center",
                      boxShadow:"0 5px 5px rgba(0, 0, 0, 0.15)",
                    }}>
                    <div style={{backgroundColor:"#F1C232", height:"65%", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"10px 10px 0px 0px", flexDirection: "column"}}>
                      <div style={{color:"white", textAlign:"center", fontWeight:"400",}}>
                        컨펌 대기중입니다
                        <br />
                        {card.workerId == null 
                        ? null 
                        : 
                        <>{card.description}</>
                        }
                      </div>
                    </div>
                    <CardView>
                    { card.workerId == null 
                      ? (<>작업자 미배정</>)
                      : (<>
                        <FaUserCircle size={25}/>
                        &nbsp;
                        {getWorkerName(card.workerId)}</>)}

                    </CardView>
                  </div>
                  )
                }
              </CardScroll>
            )
          }
          <div></div>
        </CardContainer>

        {/* 완료 목록 */}
        <CardContainer>
          <div style={{height:'150px', width:'100%'}}>
            <div style={{textAlign:"center"}}>
              <MdOutlineSlowMotionVideo size={30} style={{color:"#3A8DFF", }}/>
              <h5>컨펌 완료</h5>
            </div>
            <div style={{width:"100%", borderBottom:"3px solid #3A8DFF", margin:"10px 0px 0px 0px"}}></div>
          </div>
          { finishList.length == 0 
            ? ( <NoCardView>컨펌이 끝난 영상이 없습니다</NoCardView> )
            : (
              <CardScroll>
                { finishList.map(card => 
                  <Link 
                    to={`/doneWork/${card.projectId}/${card.cardId}/${card.workerId}`}
                    key={card.frameId} 
                    style={{
                      color:'inherit',
                      textDecoration:'none',
                      width:'200px',
                      height:'150px',
                      border:"1px solid gray",
                      borderRadius:"10px",
                      margin:"5px",
                      justifyContent:"center",
                      minHeight:'150px',
                      alignItems:"center",
                      boxShadow:"0 5px 5px rgba(0, 0, 0, 0.15)",
                    }}>
                    <div style={{backgroundColor:"#3A8DFF", height:"65%", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"10px 10px 0px 0px", flexDirection: "column"}}>
                      <div style={{color:"white", textAlign:"center", fontWeight:"400"}}>
                        {card.workerId == null 
                        ? null 
                        : 
                        <>{card.description}</>
                        }
                      </div>
                    </div>
                    <CardView>
                      { card.workerId == null 
                        ? (<>작업자 미배정</>)
                        : (<>
                          <FaUserCircle size={25}/>
                          &nbsp;
                          {getWorkerName(card.workerId)}</>)}
                    </CardView>
                  </Link>
                  )
                }
              </CardScroll>
            )
          }
          <div></div>
          { loading? (<><LoadingCircle /></>) : null}
          { finalCreate == true && managerCheck == 'ok' && finalStatus == '미완성'
          ? 
          <>       
            <MakeButton onClick={resultPage}>
              최종 생성
            </MakeButton>
          </>
          :null
          }
          { finalStatus == '완성'
          ?
          <>
            <MakeButton onClick={resultVideoPage}>
              영상 확인
            </MakeButton>
          </>
          :null
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
  padding:0px 200px;
  background-color:#f2f2f2;
`
const Block = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`
const BigText = styled.div`
  width:100px;
  background-color: #f1f1f1;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
  border:none;
  border-radius:25px;
  padding:10px 10px;
  background-color:white;
  color:black;
  font-weight:bold;
  font-size:15px;
  cursor:pointer;
  text-align:center;
  border: 2px solid gray;
  margin: 0px 10px;
`
const BigTextGroupName = styled.div`
  font-weight: bold;
  font-size: 22px;
  cursor: pointer;
  display: flex;
  align-items: center; 
  justify-content: center; 
  flex-direction: row; 
`
const BigContainer = styled.div`
  color: black;
  height: 850px;
  display: flex;
  justify-content: center;
  margin:0px 0px 20px 0px;
  padding-top:15px;
  background-color:#f2f2f2;
`
const CardContainer = styled.div`
  display:flex;
  flex-direction:column;
  font-weight: bold;
  align-items:center;
  justify-content:space-between;
  font-size: 20px;
  margin: 0px 10px;
  padding:30px;
  // border:1px solid gray;
  width:270px;
  height:750px;
  border-radius:10px;
	box-shadow:0 3px 8px rgba(0, 0, 122, 0.3);
  background-color:white;
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
const MoveButtonContainer = styled.div`
  display:flex;
  justify-content:flex-end;
`
const MoveButton = styled.button`
  border:none;
  outline:none;
  background-color:inherit;
  cursor:pointer;
  margin:5px 0px;
`
const CardView = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  margin-top:10px;
`
const MakeButton = styled.button`
  width:100px;
  border:none;
  border-radius:20px;
  font-size:12px;
  padding:10px 20px;
  margin:10px 0px;
  background-color:black;
  color:white;
  font-weight:bold;
  text-align:center;
  cursor:pointer;
`

export default MainWorkPage