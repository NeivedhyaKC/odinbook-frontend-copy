import "./styles/ProfileCard.css";
import ProfilePic from "../Images/profilePic.jpg";
import { Button } from "@mui/material";

const ProfileCard = (props) =>
{
    const profileCardContainer = {
        display: "flex",
        paddingLeft: props.paddingLeft? props.paddingLeft : "10%",
        paddingBottom:props.paddingBottom?props.paddingBottom:0,
        alignItems:"center",
        backgroundColor:props.backgroundColor?props.backgroundColor: "",
        borderRadius:props.borderRadius? props.borderRadius:"0px",
        borderBottom: props.borderBottom? props.borderBottom : "",
    }

    const profileCardPic = {
        padding: "2px",
        objectFit: "contain",
        width: props.profileCardPicWidth? props.profileCardPicWidth : "20%",
        borderRadius: '50%',
        border: '3px solid var(--primary)'
    }

    const profileCardName = {
        paddingLeft: props.profileCardNamePaddingLeft? props.profileCardNamePaddingLeft:"8%"
    }

    const profileCardSubname = {
        paddingLeft: props.profileCardSubnamePaddingLeft? props.profileCardSubnamePaddingLeft:"8%",
        paddingTop: props.profileCardSubnamePaddingTop? props.profileCardSubnamePaddingTop:"2%"
    }

    return (
        <div className="profileCardContainer" style={profileCardContainer}>
            <img className="profileCardPic" style={profileCardPic} src={ProfilePic} alt="profile pic" />
            <div>
                <p className="profileCardName" style={profileCardName}>{`${props.firstName} ${props.lastName}`}</p>
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
            
        </div>
    )
}

export default ProfileCard;