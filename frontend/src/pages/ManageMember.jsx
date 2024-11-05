import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from "../components/TopBar";
import styled from 'styled-components'
import { axiosClient } from '../axios';

const ManageMember = () => {

  const navigate = useNavigate();

  const [name, setName] = useState('') // 입력한 이름
  const [nameData, setNameData] = useState([]) // 직원 이름 목록
  const [nameSearchData, setNameSearchData] = useState([]) // 검색 결과 이름 목록
  const [memberData, setMemberData] = useState([]) // 현재 그룹의 멤버 목록
  const [inviteData, setInviteData] = useState([]) // 초대 요청 보낼 목록
  const [wordView, setWordView] = useState('') // 검색 결과 없을 때 보여줄 텍스트

  /* 이름 검색하기 */
  const nameSearch = (event) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    const updateList = nameData.filter(member => member.name === name);
    if (updateList.length == 0) {
      setWordView('검색 결과가 없습니다')
    }
    setNameSearchData(updateList)
  }

  /* 이름 검색 결과 → 초대 목록 이동 */
  const addList = (event, list) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    setInviteData(prev => [...prev, list])
    setNameData(prev => prev.filter(data => data.number !== list.number))
    setNameSearchData(prev => prev.filter(data => data.number !== list.number))
  }

  /* 초대 목록에서 제거 */
  const removeList = (event, list) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    setInviteData(prev => prev.filter(data => data.number !== list.number))
    setNameData(prev => [...prev, list])
    setNameSearchData(prev => prev.concat(list.name === name ? [list] : []))
  }

  /* 초대 요청 보내기 */
  const inviteRequest = (event) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    // ★요청★
    console.log(inviteData)
  }

  /* 그룹에서 멤버 제거 */
  const removeMember = (event, list) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    // ★요청★ 
    setMemberData(prev => {
      return prev.filter(data => data.number !== list.number);
    });
  }

  /* 현재 속한 그룹의 멤버 목록 불러오기 */
  const memberImport = () => {
    // ★요청★
    const response = [
      {number:1, name:'김김김', depart:'개발부', email:'abcdefghtllkknl@naver.com'},
      {number:2, name:'이이이', depart:'사업부', email:'abcdefghtllkknl@naver.com'},
      {number:3, name:'박박박', depart:'기획부', email:'abcdefghtllkknl@naver.com'}
    ]
    setMemberData(response)
  }

  /* 직원 이름 목록 불러오기 */
  const nameImport = () => {
    // ★요청★
    const response = [
      {number:4, name:'aaa', depart:'개발부', email:'abcdefghtllkknl@naver.com'},
      {number:5, name:'bbb', depart:'개발부', email:'abcdefghtllkknl@naver.com'},
      {number:6, name:'ccc', depart:'개발부', email:'abcdefghtllkknl@naver.com'},
      {number:7, name:'aaa', depart:'기획부', email:'abcdefghtllkknl@naver.com'},
    ]
    setNameData(response)
  }

  useEffect(()=> {
    /* 처음에 그룹 멤버 목록, 직원 목록 불러오기 */
    memberImport()
    nameImport()
  }, [])

  const closeButton = () => {
    navigate('/mainWorkPage');
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
                검색하기
              </SearchButton>
            </InputBox>
            { nameSearchData.length == 0
              ? (<NotView>{wordView}</NotView>)
              : (
                <MemberScroll>
                  { nameSearchData.map((list) => 
                    <MemberList key={list.number}>
                      <MemberContent>
                        <MemberText>{list.name}</MemberText>
                        <MemberText>{list.depart}</MemberText>
                        <MemberText>{list.email}</MemberText>
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
                    <MemberList key={list.number}>
                      <MemberContent>
                        <MemberText>{list.name}</MemberText>
                        <MemberText>{list.depart}</MemberText>
                        <MemberText>{list.email}</MemberText>
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
                    <MemberList key={list.number}>
                      <MemberContent>
                        <MemberText>{list.name}</MemberText>
                        <MemberText>{list.depart}</MemberText>
                        <MemberText>{list.email}</MemberText>
                      </MemberContent>
                      <MemberButton onClick = {(event) => {removeMember(event,list)}}>
                        추방
                      </MemberButton>
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
  border:4px dashed black;
  width:90%;
  padding: 10px;
  height:100%;
  display:flex;
  justify-content:center;
  align-items:center;
  margin:0 auto;
  flex-direction:column;
`
const MemberContainer = styled.div`
  width:100%;
  display:flex;
  justify-content:center;
  align-items:center;
  margin:0 auto;
`
const MemberColumnContainer = styled.div`
  border:1px solid black;
  width:30%;
  margin:5px;
  height:400px;
`
const MemberTitle = styled.div`
  font-size:20px;
  font-weight:bold;
  width:100%;
  margin:15px 5px;
  text-align:center;
`
const MemberScroll = styled.div`
  border:1px solid black;
  width:80%;
  height:200px;
  overflow-y:auto;
  margin:0 auto;
  padding:0px 10px;
  display:flex;
  flex-direction:column;
  align-items:center;
`
const MemberList = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin:15px 0px;
  width:90%;
  padding:0px 5px;
`
const MemberContent = styled.div`
  border-bottom:2px solid black;
  width:85%;
  display:flex;
  flex-direction:row;
  justify-content:space-between;
`
const MemberText = styled.div`
  font-size:12px;
  font-weight:bold;
  width:33%;
  white-space:normal;
  overflow-wrap:break-word;
`
const MemberButton = styled.button`
  width:150px;
  outline:none;
  border:none;
  border-radius:10px;
  padding:5px 10px;
  margin:10px 5px;
  background-color:black;
  text-align:center;
  color:white;
  font-weight:bold;
  font-size:10px;
  cursor:pointer;
  text-align:center;
`
const InputBox = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:center;
  align-items:center;
`
const SearchInput = styled.input`
  border:1px solid gray;
  border-radius:10px;
  width:60%;
  height:30px;
  margin:10px 5px;
`
const SearchButton = styled.div`
  width:20%;
  border:none;
  border-radius:5px;
  padding:10px 5px;
  margin:10px 5px;
  background-color:black;
  font-size:10px;
  color:white;
  font-weight:bold;
  text-align:center;
  cursor:pointer;
`
const RequestButton = styled.div`
  width:150px;
  border:none;
  border-radius:5px;
  padding:10px 20px;
  background-color:black;
  color:white;
  font-weight:bold;
  text-align:center;
  cursor:pointer;
`
const ClosingButton = styled.div`
  width:150px;
  border:none;
  border-radius:5px;
  padding:10px 20px;
  background-color:gray;
  color:white;
  font-weight:bold;
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