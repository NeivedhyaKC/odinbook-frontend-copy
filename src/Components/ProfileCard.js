import "./styles/ProfileCard.css";
import ProfilePic from "../Images/profilePic.jpg";
import { Button } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from "react";

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
        overflow:"hidden",
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

    return (
        <div className="profileCardContainer" style={profileCardContainer}>
            <img className="profileCardPic" style={profileCardPic} src={ProfilePic} alt="profile pic" />
            <div className="profileCardNameContainer">
                <p className="profileCardName" style={profileCardName}>
                    {`${props.firstName} ${props.lastName}`}
                    {
                        props.postedAt? <span className="postedAt">  posted on  
                        {
                            ` ${DateTime.fromJSDate(new Date(props.postedAt)).toLocaleString(DateTime.DATE_MED)}`
                        }</span> : null
                    }
                </p>
                {
                    !props.comment?<p className="profileCardSubname" style={profileCardSubname}>
                        {`@${props.firstName}`}</p> : 
                        <p className="profileCardComment"> {props.comment}</p>
                }
            </div>
            
            {
                props.withAcceptButton ? <Button variant="contained" color="primary"
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
                props.withDeleteButton ? 
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
                    <MenuItem onClick={() => onDeleteButtonClick()}>Delete</MenuItem>
                    <MenuItem onClick={() => setAnchorEl(null)}>Save</MenuItem>
                </Menu>
                </div>
                 : null
            }
            
        </div>
    )
}

export default ProfileCard;