import "./styles/PostCard.css";
import ProfileCard from "./ProfileCard";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import {Button} from "@mui/material";
import ModeCommentIcon from '@mui/icons-material/ModeComment';
// import samplePostImage from "../Images/samplePostImage.jpg";
import Collapse from '@mui/material/Collapse';
import { v4 as uuidv4 } from 'uuid';



const PostCard = (props) =>
{
    const [likeColor,setLikeColor] = useState(false);
    const [showCommentCard,setShowCommentCard] = useState(false);
    const [comment,setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [likes,setLikes] = useState(0);

    useEffect(() =>
    {
        const user =JSON.parse(sessionStorage.getItem("user"));
        setComments(props.post.comments);
        setLikes(props.post.likes.length);
        props.post.likes.forEach(userId => 
        {
            if(userId === user._id)
            {
                setLikeColor(!likeColor);
                return;
            }    
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const onLikeButtonClick = async () =>
    {
        setLikeColor(!likeColor);
        const user =JSON.parse(sessionStorage.getItem("user"));
        let data;
        if(!likeColor)
        {
            data = {userId: user._id, operation: 'add'};
        }
        else
        {
            data = {userId: user._id, operation: 'remove'};
        }
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}/posts/${props.post._id}/like`,{
            method: 'PUT',
            credentials: 'include',
            withCredentials:true,
            headers:
            {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data)
        })
        const responseData = await response.json();

        setLikes(responseData.post.likes.length);
    }

    const onCommentButtonClick =() =>
    {
        setShowCommentCard(!showCommentCard);
    }

    const onPostCommentClick = async (event) =>
    {
        event.preventDefault();
        const user =JSON.parse(sessionStorage.getItem("user"));
        // let formData = new FormData();
        // formData.append("comment", comment);
        const data = {comment:comment, userId : user._id};
        
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}/posts/${props.post._id}/comment`,{
            method: 'PUT',
            credentials: 'include',
            withCredentials:true,
            headers:
            {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data)
        })
        const responseData = await response.json();
        setComments(responseData.post.comments);
        setComment("");
    }
    return (
        <div className="postCard">
            <ProfileCard profileCardPicWidth="8%" paddingLeft="2%" profileCardNamePaddingLeft="2%"
            profileCardSubnamePaddingLeft="2%" profileCardSubnamePaddingTop ="1%" profileCardNameFontSize={20}
            postedAt={props.post.postedAt} firstName={props.post.userId.firstName}
            lastName={props.post.userId.lastName} postId={props.post._id} fetchFeedData ={props.fetchFeedData}
            withDeleteButton/>
            <p className="postContent">{props.post.content}</p>
            <img src={`${process.env.REACT_APP_API_URL}/users/${props.post.userId._id}/posts/${props.post._id}/image`}
                alt="postImage" className="postImage"/>
            <div className="postFeedback">
                <Button color={likeColor?"red":"tertiary"} onClick={() => onLikeButtonClick()}
                sx={{
                    fontSize:23
                }}>
                    <FavoriteIcon sx={{
                    fontSize:30
                }}/>
                <p className="noOfLikes">{likes}</p>
                </Button>

                <Button color="tertiary" onClick={() =>onCommentButtonClick()}
                sx={{
                    textTransform:"none",
                    fontSize:23
                }}>
                    <ModeCommentIcon sx={{
                    fontSize:30,
                }}/>
                <p className="noOfComments">{comments.length} {
                    comments.length === 1?<span>Comment</span> :<span>Comments</span>}</p>
                </Button>
            </div>
            <Collapse in ={showCommentCard} timeout="auto" sx={{
                backgrounfColor:"#e2e2e2"
            }}>
                <div className="commentCard">
                    <div className="commentCardChild">
                        {
                            comments? comments.map((commentFromCommentsArray) =>
                            {
                                return <ProfileCard profileCardPicWidth="7%" profileCardSubnamePaddingTop="1%"
                                profileCardSubnamePaddingLeft="2%" profileCardNamePaddingLeft="2%"
                                paddingLeft="1%" borderBottom="2px solid #e2e2e2" paddingBottom="8px"
                                borderRadius="15px 15px 0 0 "
                                comment={commentFromCommentsArray.comment} firstName={commentFromCommentsArray.userId.firstName}
                                lastName={commentFromCommentsArray.userId.lastName} key={uuidv4()}/>
                            }) : null
                        }
                    </div>
                    <form id="commentField" onSubmit={onPostCommentClick}>
                        <TextField variant="standard" multiline placeholder="Comment here ..."
                            rows={2} value={comment} onChange={e => setComment(e.target.value)}
                            sx={{
                                width:'100%'
                            }}/>
                        <div id="commentFieldButtons">
                            <Button variant="contained" color="primary" type="submit"
                                sx={{
                                    textTransform:"none",
                                }}>Comment
                            </Button>
                        </div>
                    </form>
                </div>
            </Collapse>
            
            
        </div>
    )
}

export default PostCard;