import "./styles/PostCard.css";
import ProfileCard from "./ProfileCard";
import { IconButton } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from "react";
import TextField from "@mui/material/TextField";
import {Button} from "@mui/material";
import ModeCommentIcon from '@mui/icons-material/ModeComment';
// import samplePostImage from "../Images/samplePostImage.jpg";
import Collapse from '@mui/material/Collapse';


const PostCard = (props) =>
{
    const [likeColor,setLikeColor] = useState(false);
    const [showCommentCard,setShowCommentCard] = useState(false);

    const onLikeButtonClick =() =>
    {
        setLikeColor(!likeColor);
    }

    const onCommentButtonClick =() =>
    {
        setShowCommentCard(!showCommentCard);
    }
    return (
        <div className="postCard">
            <ProfileCard profileCardPicWidth="8%" paddingLeft="2%" profileCardNamePaddingLeft="3%"
            profileCardSubnamePaddingLeft="3%"/>
            <p className="postContent">{props.post.content}</p>
            <img src={`${process.env.REACT_APP_API_URL}/users/${props.post.userId._id}/posts/${props.post._id}/image`}
                alt="postImage" className="postImage"/>
            <div className="postFeedback">
                <IconButton color={likeColor?"red":"tertiary"} onClick={() => onLikeButtonClick()}>
                    <FavoriteIcon sx={{
                    fontSize:30
                }}/>
                <p className="noOfLikes">{props.post.likes}</p>
                </IconButton>

                <IconButton color="tertiary" onClick={() =>onCommentButtonClick()}>
                    <ModeCommentIcon sx={{
                    fontSize:30
                }}/>
                <p className="noOfComments">{props.post.comments.length} {
                    props.post.comments.length === 1?<span>Comment</span> :<span>Comments</span>}</p>
                </IconButton>
            </div>
            <Collapse in ={showCommentCard} timeout="auto" sx={{
                backgrounfColor:"#e2e2e2"
            }}>
                <div className="commentCard">
                    <div className="commentCardChild">
                        <ProfileCard profileCardPicWidth="7%" profileCardSubnamePaddingTop="1%"
                        profileCardSubnamePaddingLeft="2%" profileCardNamePaddingLeft="2%"
                        paddingLeft="1%" borderBottom="2px solid #e2e2e2" paddingBottom="8px"
                        borderRadius="15px 15px 0 0 "
                        comment="awdoqiwnd oqwidnqow inqowdi nqwodinqwdo inqwodi nqowdn wfqoi uqwodiq oqwid qw dio
                        qw douiwd qio qwdo iqwd oiqwd oqiwd qowdqi noqwdink oqwidn qowdi nqwodi nqwd 
                        qwd oqwidn qwodin oqiwdn oiengqpeifn"/>
                        <ProfileCard profileCardPicWidth="7%" profileCardSubnamePaddingTop="1%"
                        profileCardSubnamePaddingLeft="2%" profileCardNamePaddingLeft="2%"
                        paddingLeft="1%" borderBottom="2px solid #e2e2e2" paddingBottom="8px"
                        borderRadius="15px 15px 0 0 "
                        comment="awdoqiwnd oqwidnqow inqowdi nqwodinqwdo inqwodi nqowdn wfqoi uqwodiq oqwid qw dio
                        qw douiwd qio qwdo iqwd oiqwd oqiwd qowdqi noqwdink oqwidn qowdi nqwodi nqwd 
                        qwd oqwidn qwodin oqiwdn oiengqpeifn"/>
                    </div>
                    <div id="commentField">
                        <TextField variant="standard" multiline placeholder="Comment here ..."
                            rows={2}
                            sx={{
                                width:'100%'
                            }}/>
                        <div id="commentFieldButtons">
                            <Button variant="contained" color="primary"
                                sx={{
                                    textTransform:"none",
                                }}>Comment
                            </Button>
                        </div>
                    </div>
                </div>
            </Collapse>
            
            
        </div>
    )
}

export default PostCard;