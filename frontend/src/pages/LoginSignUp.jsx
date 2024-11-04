import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import TopBar from "../components/TopBar";

const LoginSignUp = () => {

  const navigate = useNavigate();

  // 현재 보여줄 페이지 - true면 login화면 false면 signup화면
  const [nowView, setNowView] = useState(true);

  // 토글 - 클릭 시 로그인 화면
  const loginView = () => {
    setNowView(true);
  };

  // 토글 - 클릭 시 회원가입 화면
  const signupView = () => {
    setNowView(false);
  };

  /* 로그인 */

  // 로그인 입력값
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");

  // 로그인 검증 - false면 경고문 보여줌
  const [loginCheck, setLoginCheck] = useState(null)

  // ★ 함수 추가 - 로그인 실행함수
  const loginConfirm = (event) => {
    event.preventDefault(); // 페이지 새로 고침 방지
    navigate('/mainHomePage');
  };


  /* 회원가입 */

  // 회원가입 입력값
  const [signId, setSignId] = useState("");
  const [signPw, setSignPw] = useState("");
  const [signRePw, setSignRePw] = useState("");
  const [signName, setSignName] = useState("");

  // 회원가입 검증 - false면 경고문 보여줌
  const [idCheck, setIdCheck] = useState(null)
  const [pwCheck, setPwCheck] = useState(null)
  const [pwReCheck, setPwReCheck] = useState(null)
  const [nameCheck, setNameCheck] = useState(null)

  // 이메일 정규식
  const emailRegex = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

  // 비밀번호 정규식 6자 이상 12자 이하 특수문자 영문 숫자 포함
  const passwordRegEx = /^(?=.*[A-Za-z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{6,12}$/;
  
  // 회원가입 실행함수
  const signupConfirm = async (event) => {
    event.preventDefault(); // 페이지 새로 고침 방지

    const pwReTest = signPw === signRePw;
    const idTest = emailRegex.test(signId);
    const pwTest = passwordRegEx.test(signPw);
    const nameTest = signName.length > 0;

    setPwReCheck(pwReTest);
    setIdCheck(idTest);
    setPwCheck(pwTest);
    setNameCheck(nameTest);

    if ( idTest && pwTest && pwReTest && nameTest ) {
      const signupData = {
        Id:signId,
        password:signPw,
        name:signName
      }
      // try{
      //   const response = await axiosClient.post('/member/signup', signupData);
      //   console.log(response)
      // } catch(error) {
      //   console.log(`회원가입 에러 ${error}`)
      // }
    }
  };
  
  return (
    <>
      <TopBar logoutView={false} />

      {/* 클릭에 따라 로그인 / 회원가입 화면 전환 */}
      <ToggleContainer>
        <LoginToggle 
          $nowView={nowView} 
          onClick={loginView}>
          Login
        </LoginToggle>
        <p style={{ fontSize: "30px" }}> | </p>
        <SignupToggle 
          $nowView={nowView}
          onClick={signupView}>
          Signup
        </SignupToggle>
      </ToggleContainer>

      { nowView ? (
        /* 로그인 화면 */
        <FormContainer>
          <FormStyle onSubmit={loginConfirm}>
            <LabelText>아이디</LabelText>
            <InputStyle 
              type="text" 
              onChange={(event) => setLoginId(event.target.value)} />
            <LabelText>비밀번호</LabelText>
            <InputStyle
              type="password" 
              onChange={(event) => setLoginPw(event.target.value)}/>
            { loginCheck === false && (<Warning>로그인 정보를 다시 확인해주세요.</Warning>)}
            <ButtonsAligns>
              <SubmitButton type="submit">
                로그인
              </SubmitButton>
            </ButtonsAligns>
          </FormStyle>
        </FormContainer>
      ) : (
        /* 회원가입 화면 */
        <FormContainer>
          <FormStyle onSubmit={signupConfirm}>
            <LabelText>아이디</LabelText>
            <InputStyle
              type="text"
              onChange={(event) => setSignId(event.target.value)}/>
            { idCheck === false && (<Warning>이메일 형식으로 입력해주세요.</Warning>)}
            <LabelText>비밀번호</LabelText>
            <InputStyle
              type="password"
              onChange={(event) => setSignPw(event.target.value)} />
            { pwCheck === false && (<Warning>비밀번호는 6자~12자로 특수문자와 영문, 숫자를 포함해야 합니다.</Warning>)}
            <LabelText>비밀번호 확인</LabelText>
            <InputStyle
              type="password"
              onChange={(event) => setSignRePw(event.target.value)}/>
            { pwReCheck === false && (<Warning>처음 입력한 비밀번호와 일치하지 않습니다.</Warning>)}
            <LabelText>이름</LabelText>
            <InputStyle
              type="text"
              onChange={(event) => setSignName(event.target.value)} />
            { nameCheck === false && (<Warning>이름을 입력해주세요.</Warning>)}
            <ButtonsAligns> 
              <SubmitButton type="submit">
                회원가입
              </SubmitButton>
            </ButtonsAligns>
          </FormStyle>
        </FormContainer>
      )}
    </>
  );
};

const ToggleContainer = styled.div`
  height:100px; margin:15px 0px; display:flex; justify-content:center; align-items:center;
`
const SignupToggle = styled.p`
  font-size: 30px; font-weight: bold; margin: 0px 10px; cursor: pointer; color: ${props => (props.$nowView ? 'gray' : 'black')};
`;
const LoginToggle = styled.p`
  font-size: 30px; font-weight: bold; margin: 0px 10px; cursor: pointer; color: ${props => (props.$nowView ? 'black' : 'gray')};
`;
const FormContainer = styled.div`
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
const Warning = styled.div`
  width:300px; margin:5px; color:red; font-size:12px; white-space:normal;
`
export default LoginSignUp;
