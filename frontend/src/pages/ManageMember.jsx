import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from "../components/TopBar";
import styled from 'styled-components'
import { inviteProject } from '../api';
import { USER_URL } from '../axios';
import { IoMdSearch } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const ManageMember = () => {

  const navigate = useNavigate();

  const { projectId, projectName } = useParams();

  const [name, setName] = useState('') // 입력한 이름
  const [nameSearchData, setNameSearchData] = useState([]) // 검색 결과 이름 목록
  const [memberData, setMemberData] = useState([]) // 현재 프로젝트의 멤버 목록
  const [inviteData, setInviteData] = useState([]) // 초대 요청 보낼 목록
  const [wordView, setWordView] = useState('') // 검색 결과 없을 때 보여줄 텍스트

  /* 이름 검색하기 */
  const nameSearch = async (event) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    try{
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${USER_URL}/api/member/find/${name}`, {
        method: 'GET',
        headers: { access: `${accessToken}` },
      });
      // ★★★★★★★★★★★★★★★★★★★★★★★
			if (response.status === 401 || response.status === 500) {
				console.log('???');
				// alert('로그인이 만료되었습니다')
				navigate('/loginSignup')
			}
      const names = await response.json()
      if (names.length == 0){
        setWordView('검색 결과가 없습니다')
        setNameSearchData([])
      } else{
        setNameSearchData(names)
      }
    }catch(error){
      setWordView('검색 결과가 없습니다')
    }
  }

  /* 이름 검색 결과 → 초대 목록 이동 */
  const addList = (event, search) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    const inviteAdded = inviteData.some(data => data.email === search.email); // 초대 목록에서 중복 있는지 확인
    const memberAdded = memberData.some(data => data.email === search.email); // 현재 프로젝트 멤버에서 중복 있는지 확인
    if (!inviteAdded && !memberAdded) {
      setInviteData(prev => [...prev, search]); // 초대 리스트에 추가
      setNameSearchData(prev => prev.filter(data => data.email !== search.email)); // 검색 결과에서 해당 회원 제거
    } else {
      if (inviteAdded){
        // toast.warning(`이미 초대 목록에 추가된 이메일입니다`)
        alert(`이미 초대 목록에 추가된 이메일입니다`)
      }
      if (memberAdded){
        // toast.warning(`이미 프로젝트에 있는 멤버입니다.`)
        alert(`이미 프로젝트에 있는 멤버입니다.`)
      }
    }
  };

  /* 초대 목록에서 제거 */
  const removeList = (event, list) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    setInviteData(prev => prev.filter(data => data.email !== list.email))
    // setNameSearchData(prev => prev.concat(list.name === name ? [list] : []))
  }

  /* 프로젝트 초대 요청 보내기 */
  const inviteRequest = async (event) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    try{
      const datas = inviteData
      const Data = {
        'projectId':projectId,
        'members':datas
      }
      
      const response = await inviteProject(Data)

      // ★★★★★★★★★★★★★★★★★★★★★★★
			if (response.status === 401 || response.status === 500) {
				console.log('???');
				// alert('로그인이 만료되었습니다')
				navigate('/loginSignup')
			}
      // toast.success(`초대가 완료되었습니다`);
      alert(`초대가 완료되었습니다`)
      setInviteData([])

      memberImport()
      // navigate(`/mainWorkPage/${projectId}`);
      
    }catch(error){
      console.log(`초대 에러${error}`)
    }
  }

  // !!!!! 프로젝트 멤버 삭제 (추후 구현 예정)
  const removeMember = (event, list) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    // setMemberData(prev => {
    //   return prev.filter(data => data.number !== list.number);
    // });
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
      setMemberData(members)
    }catch(error){
      console.log(error)
    }
  }

  /* 처음 접속 시 현재 프로젝트 멤버 불러오기 */
  useEffect(()=> {
    memberImport()
  }, [])

  // 닫기 버튼
  const closeButton = () => {
    navigate(`/mainWorkPage/${projectId}`);
  }

  return(
    <div>
      <TopBar title={'멤버 관리'} logoutView={true}/>
      <RowContainer>
        <MemberContainer> 
          {/* 검색 목록 */}
          <MemberColumnContainer>
            <MemberTitle>
              이름 검색
            </MemberTitle>
            <InputBox>
              <SearchInput type="text" onChange={(event) => setName(event.target.value)} />
              <SearchButton onClick={(event) => nameSearch(event)}>
              <IoMdSearch size={15}/>
            </SearchButton>
            </InputBox>
            { nameSearchData.length == 0
              ? (<NotView>{wordView}</NotView>)
              : (
                <MemberScroll>
                  { nameSearchData.map((list) => 
                    <MemberList key={list.email}>
                      <MemberContent>
                      <div style={{ display:"flex", alignItems:"center", margin:"0px 10px"}}>
                        <FaUserCircle size={25}/>
                      </div>
                      <div style={{display:"flex", flexDirection:"column"}}>
                        <MemberText>{list.name}</MemberText>
                        <MemberText>{list.email}</MemberText>
                      </div>
                      </MemberContent>
                      <MemberButton onClick={(event) => addList(event, list)}>
                        추가
                      </MemberButton>
                    </MemberList>
                    )
                  }
                </MemberScroll>
              )
            }
          </MemberColumnContainer>

          {/* 초대 목록 */}
          <MemberColumnContainer>
            <MemberTitle>
              초대 목록
            </MemberTitle>
            { inviteData.length == 0
              ? (<NotView>초대할 멤버를 추가해주세요</NotView>)
              : (
                <MemberScroll>
                  { inviteData.map((list) => 
                    <MemberList key={list.email}>
                      <MemberContent>
                        <div style={{ display:"flex", alignItems:"center", margin:"0px 10px"}}>
                          <FaUserCircle size={25}/>
                        </div>
                        <div style={{display:"flex", flexDirection:"column"}}>
                          <MemberText>{list.name}</MemberText>
                          <MemberText>{list.email}</MemberText>
                        </div>
                      </MemberContent>
                      <MemberButton onClick={(event) => removeList(event, list)}>
                        취소
                      </MemberButton>
                    </MemberList>
                    )
                  }
                </MemberScroll>
              )
            }

            <ButtonBox>
              <RequestButton onClick={(event) => inviteRequest(event)}>
                초대하기
              </RequestButton>
            </ButtonBox>
          </MemberColumnContainer>
                
          {/* 멤버 목록 */}
          <MemberColumnContainer>
            <MemberTitle>
              멤버 목록
            </MemberTitle>
            { memberData.length == 0 
              ? (<NotView>현재 멤버가 없습니다</NotView>)
              : (
                <MemberScroll>
                  { memberData.map((list) => 
                    <MemberList key={list.email}>
                      <MemberContent>
                        <div style={{ display:"flex", alignItems:"center", margin:"0px 10px"}}>
                          <FaUserCircle size={25}/>
                        </div>
                        <div style={{display:"flex", flexDirection:"column", padding:"5px 0px"}}>
                          <MemberText>{list.name}</MemberText>
                          <MemberText>{list.email}</MemberText>
                        </div>
                      </MemberContent>
                      {/* <MemberButton onClick = {(event) => {removeMember(event,list)}}>
                        추방
                      </MemberButton> */}
                    </MemberList>
                    )
                  }
                </MemberScroll> 
              )
            }
          </MemberColumnContainer>
        </MemberContainer>
        <ButtonBox>
          <ClosingButton onClick={closeButton}>
            닫기
          </ClosingButton>
        </ButtonBox>
      </RowContainer>
    </div>
  )
}

const RowContainer = styled.div`
	width:90%; 
	padding:60px 10px; 
	height:100%; 
	display:flex; 
	justify-content:center; 
	align-items:center; 
	margin:0 auto; 
	flex-direction:column;
	// border:1px solid #ccc;
	// box-shadow:0px 8px 7px rgba(0, 0, 0, 0.4);
  border-radius:10px;
  // background-color:#f5f5f5
`
const MemberContainer = styled.div`
  width:100%;
  display:flex;
  justify-content:center;
  align-items:center;
  margin:0 auto;
`
const MemberColumnContainer = styled.div`
  // border:1px solid black;
	box-shadow:0 3px 6px rgba(0, 0, 62, 0.3);
  border-radius:10px;
  width:30%;
  margin:10px;
  height:400px;
  // *****
  display:flex;
  flex-direction:column;
  align-items:center;
  background-color:white;
`
const MemberTitle = styled.div`
  font-size:20px;
  font-weight:bold;
  width:100%;
  margin:15px 5px;
  text-align:center;
`
const MemberScroll = styled.div`
  // border:1px solid gray;
  background-color:#e0e6eb;
	box-shadow:0 3px 3px rgba(0, 0, 0, 0.1);
  width:70%;
  height:200px;
  overflow-y:auto;
  margin:0 auto;
  padding:0px 10px;
  display:flex;
  flex-direction:column;
  // background:white;
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
const MemberList = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin:15px 0px;
  width:90%;
  padding:0px 5px;
  background-color:white;
  box-shadow:0 3px 3px rgba(0, 0, 0, 0.1);
  border:1px solid #e6e6e6;
`
const MemberContent = styled.div`
  // border-bottom:2px solid black;
  width:30%;
  display:flex;
  flex-direction:row;
  justify-content:space-between;
`
const MemberText = styled.div`
  font-size:12px;
  font-weight:bold;
  width:100%;
  white-space:normal;
  overflow-wrap:break-word;
`
const MemberButton = styled.button`
  width:50px;
  outline:none;
  border:none;
  // border-radius:10px;
  padding:5px 10px;
  margin:10px 5px;
  background-color:inherit;
  text-align:center;
  color:#444;
  font-weight:bold;
  font-size:11px;
  cursor:pointer;
  text-align:center;
`
const InputBox = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:center;
  align-items:center;
  position:relative;
  width:80%;
`
const SearchInput = styled.input`
  border:1px solid gray;
  border-radius:20px;
  width:60%;
  height:30px;
  margin:10px 5px;
  padding:20px 40px 20px 20px;
  box-sizing: border-box;
`
const SearchButton = styled.div`
  width:20%;
  border:none;
  border-radius:0px 15px 15px 0px;
  padding:8px 0px;
  margin:10px 5px;
  font-size:10px;
  color:black;
  font-weight:bold;
  text-align:center;
  cursor:pointer;
  position:absolute;
  right: 50px;
`
const RequestButton = styled.div`
  width:130px;
  border:none;
  border-radius:20px;
  padding:10px 20px;
  background-color:black;
  color:white;
  // font-weight:bold;
  text-align:center;
  cursor:pointer;
`
const ClosingButton = styled.div`
  width:100px;
  border:none;
  border-radius:20px;
  padding:10px 20px;
  background-color:gray;
  color:white;
  // font-weight:bold;
  text-align:center;
  cursor:pointer;
`
const ButtonBox = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  margin:10px;
`
const NotView = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  height:50%;
`
export default ManageMember