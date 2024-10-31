import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from "./TopBar";
import styled from 'styled-components'

const ManageMember = () => {

  const navigate = useNavigate();

  const [name, setName] = useState('')

  const nameSearch = () => {
    // 이름 검색 후 밑의 목록에 보여주기
  }

  const inviteRequest = () => {
    // 초대 요청 보내기
  }

  const closeButton = () => {
    navigate('/mainWorkPage');
  }

  const addList = () => {
    // 이름 초대 목록 리스트에 추가하기
  }

  const removeList = () => {
    // 이름 초대 목록 리스트에서 제거하기
  }

  const removeMember = () => {
    // 멤버 프로젝트에서 제거하기
  }

  const [nameData, setNameData] = useState([
        {number:1, name:'영상 수정', confirm:false, email:'abcdefghtllkknl@naver.com'},
        {number:2, name:'드라마 편집', confirm:true, email:'abcdefghtllkknl@naver.com'},
        {number:3, name:'모자이크 처리', confirm:true, email:'abcdefghtllkknl@naver.com'},
        {number:4, name:'확인 처리', confirm:true, email:'abcdefghtllkknl@naver.com'},
        {number:5, name:'확인 처리', confirm:true, email:'abcdefghtllkknl@naver.com'},
    ])

  const [inviteData, setInviteData] = useState([
        {number:1, name:'영상 수정', confirm:false, email:'abcdefghtllkknl@naver.com'},
        {number:2, name:'드라마 편집', confirm:true, email:'abcdefghtllkknl@naver.com'},
        {number:3, name:'모자이크 처리', confirm:true, email:'abcdefghtllkknl@naver.com'},
        {number:4, name:'확인 처리', confirm:true, email:'abcdefghtllkknl@naver.com'},
        {number:5, name:'확인 처리', confirm:true, email:'abcdefghtllkknl@naver.com'},
    ])

  const [memberData, setMemberData] = useState([
        {number:1, name:'영상 수정', confirm:false, email:'abcdefghtllkknl@naver.com'},
        {number:2, name:'드라마 편집', confirm:true, email:'abcdefghtllkknl@naver.com'},
        {number:3, name:'모자이크 처리', confirm:true, email:'abcdefghtllkknl@naver.com'},
        {number:4, name:'확인 처리', confirm:true, email:'abcdefghtllkknl@naver.com'},
        {number:5, name:'확인 처리', confirm:true, email:'abcdefghtllkknl@naver.com'},
    ])

  return(
      <div>
          <TopBar title={'멤버 관리'} logoutView={true}/>
          <RowContainer>
            <MemberContainer> 
                {/* 검색 목록 */}
                <MemberColumnContainer>
                    <MemberTitle>이름 검색</MemberTitle>
                    <InputBox>
                      <SearchInput type="text" onChange={(event) => setName(event.target.value)} />
                      <SearchButton onClick={nameSearch}>검색하기</SearchButton>
                    </InputBox>

                    <MemberScroll>
                      { nameData.map((list) => 
                        <MemberList key={list.number}>
                          <MemberContent>
                            <MemberText>{list.name}</MemberText>
                            <MemberText>{list.name}</MemberText>
                            <MemberText>{list.email}</MemberText>
                          </MemberContent>
                          <MemberButton onClick={addList}>추가</MemberButton>
                        </MemberList>
                      )}
                    </MemberScroll>
                </MemberColumnContainer>

                {/* 초대 목록 */}
                <MemberColumnContainer>
                    <MemberTitle>초대 목록</MemberTitle>
                    <MemberScroll>
                      { inviteData.map((list) => 
                        <MemberList key={list.number}>
                          <MemberContent>
                            <MemberText>{list.name}</MemberText>
                            <MemberText>{list.name}</MemberText>
                            <MemberText>{list.email}</MemberText>
                          </MemberContent>
                          <MemberButton onClick={removeList}>취소</MemberButton>
                        </MemberList>
                      )}
                    </MemberScroll>
                    <ButtonBox>
                      <RequestButton onClick={inviteRequest}>초대하기</RequestButton>
                    </ButtonBox>
                </MemberColumnContainer>
                
                {/* 멤버 목록 */}
                <MemberColumnContainer>
                    <MemberTitle>멤버 목록</MemberTitle>
                    <MemberScroll>
                      { memberData.map((list) => 
                        <MemberList key={list.number}>
                          <MemberContent>
                            <MemberText>{list.name}</MemberText>
                            <MemberText>{list.name}</MemberText>
                            <MemberText>{list.email}</MemberText>
                          </MemberContent>
                          <MemberButton onClick = {removeMember}>추방</MemberButton>
                        </MemberList>
                      )}
                    </MemberScroll> 
                </MemberColumnContainer>
            </MemberContainer>
            <ButtonBox>
                <ClosingButton onClick={closeButton}>닫기</ClosingButton>
            </ButtonBox>
          </RowContainer>
      </div>
  )
}

const RowContainer = styled.div`
  border:4px dashed black; width:90%; padding: 10px; height:100%; display:flex; justify-content:center; align-items:center; margin:0 auto; flex-direction:column;
`
const MemberContainer = styled.div`
  width:100%; display:flex; justify-content:center; align-items:center; margin:0 auto;
`
const MemberColumnContainer = styled.div`
  border:1px solid black; width:30%; margin:5px; height:400px;
`
const MemberTitle = styled.div`
  font-size:20px; font-weight:bold; width:100%; margin:15px 5px; text-align:center;
`
const MemberScroll = styled.div`
  border:1px solid black; width:80%; height:200px; overflow-y:auto; margin:0 auto; padding:0px 10px; display:flex; flex-direction:column; align-items:center;
`
const MemberList = styled.div`
  display:flex; justify-content:space-between; align-items:center; margin:15px 0px; width:90%; padding:0px 5px;
`
const MemberContent = styled.div`
  border-bottom:2px solid black; width:85%; display:flex; flex-direction:row; justify-content:space-between;
`
const MemberText = styled.div`
  font-size:12px; font-weight:bold; width:33%; white-space:normal; overflow-wrap:break-word;
`
const MemberButton = styled.button`
 width:150px; outline:none; border:none; border-radius:10px; padding:5px 10px; margin:10px 5px; background-color:black; text-align:center; color:white; font-weight:bold; font-size:10px; cursor:pointer; text-align:center;
`
const InputBox = styled.div`
  display:flex; flex-direction:row; justify-content:center; align-items:center;
`
const SearchInput = styled.input`
  border:1px solid gray; border-radius:10px; width:150px; height:30px; margin:10px 5px;
`
const SearchButton = styled.div`
    width:50px; border:none; border-radius:5px; padding:5px 10px; background-color:black; font-size:10px; color:white; font-weight:bold; text-align:center;
`
const RequestButton = styled.div`
    width:150px; border:none; border-radius:5px; padding:10px 20px; background-color:black; color:white; font-weight:bold; text-align:center;
`
const ClosingButton = styled.div`
    width:150px; border:none; border-radius:5px; padding:10px 20px; background-color:gray; color:white; font-weight:bold; text-align:center;
`
const ButtonBox = styled.div`
  display:flex; justify-content:center; align-items:center; margin:10px;
`
export default ManageMember