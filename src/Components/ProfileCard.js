import "./styles/ProfileCard.css";
import ProfilePic from "../Images/profilePic.jpg";
import { Button } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from "react";
import {Link} from 'react-router-dom';

const { DateTime } = require("luxon");


const ProfileCard = (props) =>
{
    const [anchorEl,setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const profileCardContainer = {
        display: "flex",
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

    const oldUser =JSON.parse(sessionStorage.getItem("user"));

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
                    <Link to="/profile" state={{userId:props.userId}}>
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
                        <p className="profileCardComment"> {props.comment}</p>
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
                    <MenuItem onClick={() => setAnchorEl(null)}>Save</MenuItem>
                </Menu>
                </div>
                 : null
            }
            
        </div>
    )
}

export default ProfileCard;