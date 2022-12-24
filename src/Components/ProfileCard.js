import "./styles/ProfileCard.css";
import ProfilePic from "../Images/profilePic.jpg";
import { Button } from "@mui/material";

const ProfileCard = (props) =>
{
    const profileCardContainer = {
        display: "flex",
        paddingLeft: props.paddingLeft? props.paddingLeft : "10%",
        paddingBottom:props.paddingBottom?props.paddingBottom:0,
        alignItems:"center"
    }

    const profileCardPic = {
        padding: "2px",
        objectFit: "contain",
        width: props.profileCardPicWidth? props.profileCardPicWidth : "20%",
        borderRadius: '50%',
        border: '3px solid var(--primary)'
    }

    return (
        <div className="profileCardContainer" style={profileCardContainer}>
            <img className="profileCardPic" style={profileCardPic} src={ProfilePic} alt="profile pic" />
            <div>
                <p className="profileCardName">{`${props.first_name} ${props.last_name}`}</p>
                <p className="profileCardSubname">{`@${props.first_name}`}</p>
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