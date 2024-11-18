import React from "react";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components'
import { BiDoorOpen } from "react-icons/bi";
import { toast } from "react-toastify";

const TopBar = ({ title, logoutView }) => {
  
  // 페이지에 따라 로그아웃 & 제목 보여주기

  const navigate = useNavigate();

  const mainGo = (event) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    navigate("/mainHomePage");
  }
  const logoutTry = (event) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    localStorage.removeItem('accessToken')
    localStorage.removeItem('myEmail')
    localStorage.removeItem('myId')
    localStorage.removeItem('managerId')
    // toast.success(`로그아웃이 완료되었습니다`);
    alert(`로그아웃이 완료되었습니다`)
    navigate("/loginSignup");
  };


  return (
    <div>
      {/* 상단 검은 배너 */}
      <Banner>
        <TitleStyle
          onClick={mainGo}>
          Frame Checkmate
        </TitleStyle>
        { logoutView && (
          <LogoutButton
            onClick={logoutTry}>
            <BiDoorOpen size={25}/>
            &nbsp;
            로그아웃
          </LogoutButton>
        )}
      </Banner>

      {/* 중앙 제목 텍스트 */}
      { title && (
        <Header>
          <HeaderText>
            {title}
          </HeaderText>
        </Header>
      )}
    </div>
  );
};

const Banner = styled.div`
  background-color:black; 
  color:white; 
  height:60px; 
  display:flex; 
  justify-content:space-between; 
  align-items:center;
`
const TitleStyle = styled.a`
  font-weight:bold; 
  font-size:25px; 
  margin-left:15px; 
  cursor:pointer;
`
const LogoutButton = styled.button`
  display:flex;
  align-items:center;
  margin-right: 15px; 
  font-weight: bold; 
  background: none; 
  border: none; 
  padding: 0; 
  color: inherit; 
  cursor:pointer;
  font-size:13px;
`
const Header = styled.div`
  height:70px; 
  justify-content:center; 
  align-items:center; 
  display:flex;
  background-color:#EEEEEE;
  border-bottom:1px solid #CCCCCC;
`
const HeaderText = styled.div`
  font-size:25px; 
  font-weight:bold; 
  text-align:center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.12) ;
`
export default TopBar;
