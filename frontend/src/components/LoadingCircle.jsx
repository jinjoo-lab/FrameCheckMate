import React from "react";
import styled from 'styled-components'
import spinner from '../assets/images/spinner.gif'
const LoadingCircle = () => {

  return (
    <div
      style={{
        position:'fixed',
        top:'0',
        left:'0',
        width:'100%',
        height:'100%',
        backgroundColor:'rgba(0,0,0,0.7)',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        zIndex:'99',

      }}>
        <div style={{
          display:'flex',
          flexDirection:'column',
          textAlign:'center'
        }}>
          <div 
            style={{ 
              color:'white', 
              fontWeight:'bold',
              textShadow: '2px 2px 5px rgba(0, 0, 0, 0.7)', 
              fontSize:'27px'}}> 
              작업 진행 중입니다.</div>
          <img src={spinner} alt='로딩' />
        </div>
    </div>
  )
};


export default LoadingCircle;
