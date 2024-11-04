import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // eslint-disable-line no-unused-vars
import AllocateWork from './AllocateWork';
import styled from 'styled-components';

const FeedbackAllocateWork = ({ confirmView, confirmTitle, commentView, workingBefore, uploadView }) => {

	const navigate = useNavigate();

	const [confirmList, setConfirmList] = useState([])
	const [commentList, setCommentList] = useState([])

	const [confirms, setConfirms] = useState('')
	const [comments, setComments] = useState('')

	const confirmSubmit = () => {

	}

	const commentSubmit = () => {

	}

	const confirmImport = () => {
		const response = [
			{number:1, name:'김김김', content:'다시 해주세요'},
			{number:2, name:'김김김', content:'다시'},
			{number:3, name:'김김김', content:'다시 수정해주세요'},
			{number:4, name:'김김김', content:'다시 수정해주세요'},
		]

		setConfirmList(response)

	}

	const commentImport = () => {
		const response = [
			{number:1, name:'김김김', content:'좋아요'},
			{number:2, name:'이이이', content:'별로'},
			{number:3, name:'박박박', content:'좋음'},
		]

		setCommentList(response)

	}

	useEffect(() => {
		/* 처음에 컨펌 목록, 코멘트 목록 불러오기 */
		confirmImport()
		commentImport()

	}, [])

	return(
		<FeedbackContainer>
			<div style={{ width:'45%' }}> 
				<AllocateWork 
					workingBefore={workingBefore} 
					uploadView={uploadView} />
			</div>
			<div style={{ width:'45%' }}>

			<div style={{ margin:'10px 5px'}}>컨펌 내용</div>
			<ReviewScroll>
				{ confirmList.length == 0 
				? (
					<NoReview>
						<p>컨펌 내용이 없습니다</p>
					</NoReview>
					)
				: (
						<>
						{ confirmList.map((list) => 
							<ReviewAlign key={list.number}>
								<ReviewStyle>
									<ReviewText>{list.name}</ReviewText>
									<ReviewText>{list.content}</ReviewText>
								</ReviewStyle>
							</ReviewAlign>
						)}
						</>
					)
				}
			</ReviewScroll>

			{ confirmView 
				? (
					<ReviewInputContainer> 
						<ReviewInput onChange={(event) => setConfirms(event.target.value)} />
						<ReviewButton onClick={confirmSubmit}>
							{confirmTitle}
						</ReviewButton>
					</ReviewInputContainer>
					)
				: null
			}

			<div style={{ margin:'10px 5px'}}>코멘트</div>
			<ReviewScroll>
				{ commentList.length == 0 
				? (
						<NoReview>
							<p>코멘트가 없습니다</p>
						</NoReview>
					)
				: (
						<>
						{ commentList.map((list) => 
							<ReviewAlign key={list.number}>
								<ReviewStyle>
									<ReviewText>{list.name}</ReviewText>
									<ReviewText>{list.content}</ReviewText>
								</ReviewStyle>
							</ReviewAlign>
						)}
						</>
					)}
			</ReviewScroll>

			{ commentView 
				? (
					<ReviewInputContainer> 
						<ReviewInput onChange={(event) => setComments(event.target.value)}/>
						<ReviewButton onClick={commentSubmit}>
							작성하기
						</ReviewButton>
					</ReviewInputContainer>
					) 
				: null
			}

			</div>
		</FeedbackContainer>
	)
}

const FeedbackContainer = styled.div`
	display:flex; 
	justify-content:space-between; 
	align-items:center;
`
const ReviewScroll = styled.div`
	border:1px solid black;
	width:90%; 
	height:200px; 
	margin:5px; 
	padding:10px; 
	display:flex; 
	flex-direction:column; 
	overflow-y:auto;
`
const ReviewStyle = styled.div`
	border-bottom:1px solid black; 
	width:85%; 
	display:flex; 
	flex-direction:row; 
	justify-content:space-between;
`
const ReviewText = styled.div`
	font-size:12px; 
	font-weight:bold; 
	white-space:normal
`
const NoReview = styled.div`
	display:flex; 
	justify-content:center; 
	align-items:center; 
	height:100vh;
`
const ReviewAlign = styled.div`
	display:flex; 
	justify-content:center; 
	align-items:center; 
	margin:15px 0px; 
	width:90%; 
	padding:0px 5px;
`
const ReviewInputContainer = styled.div`
	display:flex; 
	flex-direction:row; 
	justify-content:center;
`
const ReviewInput = styled.input`
	padding:5px 10px; 
	margin:10px 5px;
`
const ReviewButton = styled.button`
	width:150px; 
	border:none; 
	border-radius:5px; 
	padding:5px 10px; 
	margin:10px 5px; 
	background-color:black; 
	color:white; 
	font-weight:bold; 
	cursor:pointer;
`

export default FeedbackAllocateWork