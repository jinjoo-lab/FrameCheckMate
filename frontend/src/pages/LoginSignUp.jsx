import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TopBar from "../components/TopBar";

const LoginSignUp = () => {

  // 로그인
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");

  // 회원가입
  const [signId, setSignId] = useState("");
  const [signPw, setSignPw] = useState("");
  const [signRePw, setSignRePw] = useState("");
  const [signName, setSignName] = useState("");

  // 현재 보여줄 페이지 - true면 login화면 false면 signup화면
  const [nowView, setNowView] = useState(true);

  const navigate = useNavigate();

  // 토글 - 클릭 시 로그인 화면
  const loginView = () => {
    setNowView(true);
  };

  // 토글 - 클릭 시 회원가입 화면
  const signupView = () => {
    setNowView(false);
  };

  const loginConfirm = (event) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    navigate('/mainHomePage');
  };
  const signupConfirm = (event) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    navigate('/mainHomePage');
  };
  
  return (
    <div>
      <TopBar logoutView={false} />

      {/* 클릭에 따라 로그인 / 회원가입 화면 전환 */}
      <ToggleContainer>
        <LoginToggle 
          nowView={nowView} 
          onClick={loginView}>
          Login
        </LoginToggle>
        <p style={{ fontSize: "30px" }}> | </p>
        <SignupToggle 
          nowView={nowView}
          onClick={signupView}>
          Signup
        </SignupToggle>
      </ToggleContainer>

      { nowView ? (
        /* 로그인 화면 */
        <ContainerAlign>
          <FormStyle onSubmit={loginConfirm}>

            <LabelText>아이디</LabelText>
            <InputStyle 
              type="text" 
              onChange={(event) => setLoginId(event.target.value)} />

            <LabelText>비밀번호</LabelText>
            <InputStyle
              type="password" 
              onChange={(event) => setLoginPw(event.target.value)}/>

            <ButtonsAligns>
              <SubmitButton type="submit">
                로그인
              </SubmitButton>
            </ButtonsAligns>

          </FormStyle>
        </ContainerAlign>
      ) : (
        /* 회원가입 화면 */
        <ContainerAlign>
          <FormStyle onSubmit={signupConfirm}>

            <LabelText>아이디</LabelText>
            <InputStyle
              type="text"
              onChange={(event) => setSignId(event.target.value)}/>

            <LabelText>비밀번호</LabelText>
            <InputStyle
              type="password"
              onChange={(event) => setSignPw(event.target.value)} />

            <LabelText>비밀번호 확인</LabelText>
            <InputStyle
              type="password"
              onChange={(event) => setSignRePw(event.target.value)}/>

            <LabelText>이름</LabelText>
            <InputStyle
              type="password"
              onChange={(event) => setSignName(event.target.value)} />

            <ButtonsAligns> 
              <SubmitButton type="submit">
                회원가입
              </SubmitButton>
            </ButtonsAligns>

          </FormStyle>
        </ContainerAlign>
      )}
    </div>
  );
};

const ToggleContainer = styled.div`
  height:100px; margin:15px 0px; display:flex; justify-content:center; align-items:center;
`
const SignupToggle = styled.p`
  font-size: 30px; font-weight: bold; margin: 0px 10px; cursor: pointer; color: ${props => (props.nowView ? 'gray' : 'black')};
`;
const LoginToggle = styled.p`
  font-size: 30px; font-weight: bold; margin: 0px 10px; cursor: pointer; color: ${props => (props.nowView ? 'black' : 'gray')};
`;
const ContainerAlign = styled.div`
  display:flex; justify-content:center; align-items:center;
`
const FormStyle = styled.form`
  width: 400px; display:flex; flex-direction:column; padding:50px 150px; border:4px dashed black; border-radius:20px; justify-content:center; align-items:center;
`
const LabelText = styled.label`
  text-align:left; width:300px; font-weight:bold;
`
const InputStyle = styled.input`
  border:1px solid gray; border-radius:10px; margin:10px 0px; height:30px; width:300px;
`
const ButtonsAligns = styled.div`
  display:flex; justify-content:center; align-items:center; margin-top:30px;
`
const SubmitButton = styled.button`
  width:150px; border:none; border-radius:5px; padding:10px 20px; background-color:black; color:white; font-weight:bold; cursor:pointer;
`
export default LoginSignUp;
