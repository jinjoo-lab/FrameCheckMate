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

	const confirmSubmit = (event, confirms) => {
    setConfirmList(prev => [...prev, {"content":confirms, "createdAt":Math.random()}])
		setConfirms('')
	}

	const commentSubmit = (event, confirms) => {
    setCommentList(prev => [...prev, {"userId":Math.random(), "content":confirms, "createdAt":Math.random()}])
		setComments('')
	}

	const confirmImport = () => {
		const response = [
			{
				"content": "이거 이상한데?",
				"createdAt": "2024-11-04T01:31:42.492"
		},
		{
				"content": "여기 고쳐줄래요?",
				"createdAt": "2024-11-04T01:31:57.018"
		},
		]

		setConfirmList(response)

	}

	const commentImport = () => {
		const response = [
			{
				"userId": "123e4567",
				"content": "좋아요",
				"createdAt": "2024-11-04T02:09:05.585"
		},
		{
				"userId": "123e4567",
				"content": "글쎄요",
				"createdAt": "2024-11-04T02:09:15.112"
		}
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
							<ReviewAlign key={list.createdAt}>
								<ReviewStyle>
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
						<ReviewInput 
							value={confirms} 
							onChange={(event) => setConfirms(event.target.value)} />
						<ReviewButton 
							onClick={(event) => confirmSubmit(event, confirms)}>
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
							<ReviewAlign key={list.createdAt}>
								<ReviewStyle>
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
						<ReviewInput 
							value={comments}
							onChange={(event) => setComments(event.target.value)}/>
						<ReviewButton 
							onClick={(event) => commentSubmit(event, comments)}>
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
	justify-content:center;
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
	width:70%;
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