import "./styles/ProfileCard.css";
import ProfilePic from "../Images/profilePic.jpg";
import { Button } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from "react";
import {Link} from 'react-router-dom';
import Store from "../Stores/Store";
import { chatAdded } from "../Stores/MyChatsSlice";

const { DateTime } = require("luxon");


const ProfileCard = (props) =>
{
    const oldUser =JSON.parse(sessionStorage.getItem("user"));

    const [anchorEl,setAnchorEl] = useState(null);
    let [postSaved,setPostSaved] = useState(false);
    const open = Boolean(anchorEl);
    
    useEffect(() =>
    {
        for(let post of oldUser.savedPosts)
        {
            if(post._id === props.postId)
            {
                setPostSaved(true);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const profileCardContainer = {
        display: "flex",
        width: props.profileCardContainerWidth ? props.profileCardContainerWidth : "",
        height : props.profileCardContainerHeight ? props.profileCardContainerHeight : "",
        paddingLeft: props.paddingLeft? props.paddingLeft : "10%",
        paddingBottom:props.paddingBottom?props.paddingBottom:0,
        alignItems:"center",
        backgroundColor:props.backgroundColor?props.backgroundColor: "",
        borderRadius:props.borderRadius? props.borderRadius:"0px",
        borderBottom: props.borderBottom? props.borderBottom : "",
        marginBottom: props.marginBottom? props.marginBottom:"",
        borderTop: props.borderTop? props.borderTop:"",
        paddingTop:props.paddingTop?props.paddingTop:"",
        overflow:"hidden",
        position:"relative"
    }

    const profileCardPic = {
        padding: "2px",
        objectFit: "contain",
        width: props.profileCardPicWidth? props.profileCardPicWidth : "20%",
        borderRadius: '50%',
        border: '3px solid var(--primary)'
    }

    // const profileCardNameContainer = 
    // {
    //     flex:props.postedAt? 0 : 1,
    //     minWidth: props.postedAt ?200 : null
    // };

    const profileCardName = {
        paddingLeft: props.profileCardNamePaddingLeft? props.profileCardNamePaddingLeft:"8%",
        fontSize: props.profileCardNameFontSize ? props.profileCardNameFontSize: ""
    }

    const profileCardSubname = {
        paddingLeft: props.profileCardSubnamePaddingLeft? props.profileCardSubnamePaddingLeft:"8%",
        paddingTop: props.profileCardSubnamePaddingTop? props.profileCardSubnamePaddingTop:"2%"
    }

    const onDeleteButtonClick = async () =>
    {
        setAnchorEl(null);

        const user =JSON.parse(sessionStorage.getItem("user"));

        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}/posts/${props.postId}`,
        {
            method: 'DELETE',
            credentials: 'include',
            withCredentials:true,
        });
        await response.json();
        props.fetchFeedData();
    }

    const onAcceptButtonClick =async () =>
    {
        const user =JSON.parse(sessionStorage.getItem("user"));

        let response = await fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}/${props.userId}/addFriend`,
        {
            method:'PUT',
            credentials: 'include',
            withCredentials:true,
        });
        let responseData = await response.json();
        props.setFriendRequestsList(responseData.user.friendRequests);
        props.setFriendsList(responseData.user.friends);
        user.friendRequests = responseData.user.friendRequests;
        user.friends = responseData.user.friends;
        sessionStorage.setItem("user",JSON.stringify(user));
    }

    const onChatButtonClick = async () =>
    {
        const user = JSON.parse(sessionStorage.getItem("user"));
        const data = { userId: props.userId };
        let response = await fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}/chats/`,
        {
            method:'POST',
            credentials: 'include',
            withCredentials: true,
            headers:
            {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data)
        });
        let responseData = await response.json();
        Store.dispatch(chatAdded({ chatAdded: responseData }));
    }

    const onRejectButtonClick = async () =>
    {
        const user =JSON.parse(sessionStorage.getItem("user"));
        let response = await fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}/${props.userId}/removeFriendRequest`,
        {
            method:'PUT',
            credentials: 'include',
            withCredentials:true,
        });
        let responseData = await response.json();
        props.setFriendRequestsList(responseData.user.friendRequests);
        user.friendRequests = responseData.user.friendRequests;
        sessionStorage.setItem("user",JSON.stringify(user));
    }
    const onSaveButtonClick = async (savePost) =>
    {
        setAnchorEl(null);
        const user =JSON.parse(sessionStorage.getItem("user"));
        let data;

        if(savePost)
        {
            data = {operation: "add"};
        }
        else
        {
            data = {operation: "remove"};
        }

        let response = await fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}/${props.postId}/savePost`,
        {
            method:'PUT',
            credentials: 'include',
            withCredentials:true,
            headers:
            {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data)
        });
        const responseData = await response.json();

        if(props.fetchFeedData)
        {
            props.fetchFeedData();
        }
        setPostSaved(false);
        for(let post of responseData.user.savedPosts)
        {
            if(post._id === props.postId)
            {
                setPostSaved(true);
            }
        }
    }

    return (
        <div className="profileCardContainer" style={profileCardContainer}>
            {
                props.userId || props.photoUrl?
                    props.userId && props.photoUrl?
                    <img className="profileCardPic" style={profileCardPic} src={`${process.env.REACT_APP_API_URL}/users/${props.userId}/image/${props.photoUrl}`}
                     alt="profile pic" /> :
                    <img className="profileCardPic" style={profileCardPic} src={`${process.env.REACT_APP_API_URL}/users/${props.userId}/image`} 
                    alt="profile pic" /> :
                    <img className="profileCardPic" style={profileCardPic} src={ProfilePic} alt="profile pic" />
            }
            <div className="profileCardNameContainer">
                <p className="profileCardName" style={profileCardName}>
                    <Link to={props.disableLink ? "#" :"/profile"} state={{userId:props.userId}}>
                        {`${props.firstName} ${props.lastName}`}</Link>
                    {
                        props.postedAt? <span className="postedAt">  posted on  
                        {
                            ` ${DateTime.fromJSDate(new Date(props.postedAt)).toLocaleString(DateTime.DATE_MED)}`
                        }</span> : null
                    }
                </p>
                {
                    props.firstNameOnly?null:
                    !props.comment?<p className="profileCardSubname" style={profileCardSubname}>
                        {`@${props.firstName}`}</p> : 
                        <p className="profileCardComment" style={{height : props.commentHeight? props.commentHeight : ""}}> {props.comment}</p>
                }
            </div>

            {
                props.withRejectButton ? <Button variant="contained" color="error" onClick = {() => onRejectButtonClick()}
                sx={{
                    padding:0,
                    height:30,
                    fontSize:13,
                    textTransform:"none",
                    marginRight:2,
                    marginLeft:1
                }}>Reject</Button> : null
            }
            
            {
                props.withAcceptButton ? <Button variant="contained" color="primary" onClick={()=> onAcceptButtonClick()}
                sx={{
                    padding:0,
                    height:30,
                    fontSize:13,
                    textTransform:"none",
                    marginRight:2,
                    marginLeft:1
                }}>Accept</Button> : null
            }
            {
                props.withChatButton ? <Button variant="contained" color="primary" onClick={()=> onChatButtonClick()}
                sx={{
                    padding:0,
                    height:30,
                    fontSize:13,
                    textTransform:"none",
                    marginRight:2,
                    marginLeft:1
                }}>Chat</Button> : null
            }

            {
                props.withDeleteButton || props.withSaveButton? 
                <div>
                    <IconButton color="secondary" size="large" onClick={(e) =>setAnchorEl(e.currentTarget)}>
                        <MoreVertIcon/>
                    </IconButton>
                    <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => setAnchorEl(null)}
                    MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    }}>
                    {
                        oldUser._id === props.userId?
                        <MenuItem onClick={() => onDeleteButtonClick()}>Delete</MenuItem> : null
                    }
                    {
                        postSaved?
                        <MenuItem onClick={() => onSaveButtonClick(false)}>Unsave</MenuItem>:
                        <MenuItem onClick={() => onSaveButtonClick(true)}>Save</MenuItem>
                    }
                </Menu>
                </div>
                 : null
            }
            
        </div>
    )
}

export default ProfileCard;