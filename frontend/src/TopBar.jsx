import React from "react";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components'

const TopBar = ({ title, logoutView }) => {
  
  // 페이지에 따라 로그아웃 & 제목 보여주기

  const navigate = useNavigate();

  const logoutTry = (event) => {
    event.preventDefault(); // 페이지 새로 고침 방지

    navigate("/loginSignup");
  };
  return (
    <div>
      {/* 상단 검은 배너 */}
      <Banner>
        <TitleStyle>
          Frame Checkmate
        </TitleStyle>
        { logoutView && (
          <LogoutButton
            onClick={logoutTry}>
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
  background-color:black; color:white; height:60px; display:flex; justify-content:space-between; align-items:center;
`
const TitleStyle = styled.div`
  font-weight:bold; font-size:30px; margin-left:15px;
`
const LogoutButton = styled.button`
  margin-right: 15px; font-weight: bold; background: none; border: none; padding: 0; color: inherit;
`
const Header = styled.div`
  height:70px; margin:20px 0px; justify-content:center; align-items:center; display:flex;
`
const HeaderText = styled.div`
  font-size:30px; font-weight:bold; text-align:center;
`
export default TopBar;
