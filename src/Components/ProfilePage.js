import ProfileCard from "./ProfileCard";
import PostCard from "./PostCard";
import "./styles/ProfilePage.css";
import { useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useEffect, useState } from "react";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { TextField } from "@mui/material";


const ProfilePage = () =>
{
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius:4,
        boxShadow: 24,
        backdropFilter: "blur(4px)",
        p: 4,
    };

    const location = useLocation();
    const { userId } = location.state;
    
    const [user,setUser] = useState();
    const [open,setOpen] = useState(false);
    const [friendStatus, setFriendStatus] = useState("Send Friend Request");
    const [description,setDescription] = useState("");
    const [friendsList,setFriendsList] = useState([]);
    const [feed,setFeed] = useState([]);
    const [uploadProfilePicButtonText,setUploadProfilePicButtonText] = useState("Upload Profile Picture"); 

    const loggedInUser =JSON.parse(sessionStorage.getItem("user"));

    const fetchUserPostedFeed = async () =>
    {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}/posts/userPosts`,
        {
            method:'GET',
            credentials: 'include',
            withCredentials:true
        });
        const responseData = await response.json();
        setFeed(responseData.posts);
    }

    useEffect(()=>
    {
        async function fecthProfileData()
        {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`,{credentials:"include"});
            const responseData = await response.json();
            setUser(responseData.user);
            setDescription(responseData.user.description);
            setFriendsList(responseData.user.friends);
            setFriendStatus("Send Friend Request");

            responseData.user.friendRequests.forEach((friendReq) =>
            {
                if(friendReq._id === loggedInUser._id)
                {
                    setFriendStatus("Friend Request Sent");
                }
            });
            loggedInUser.friendRequests.forEach((friendReq) =>
            {
                if(friendReq._id === responseData.user._id)
                {
                    setFriendStatus("Friend Request Recieved");
                }
            });
            responseData.user.friends.forEach((friend) =>
            {
                if(friend._id === loggedInUser._id)
                {
                    setFriendStatus("Friends already");
                }
            });            
        }
        fecthProfileData();
        fetchUserPostedFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[userId])

    const OnEditUserSubmit = async (event) =>
    {
        event.preventDefault();
        setOpen(false);
        const profilePhotoInput = document.getElementById("profilePhotoInput");

        let formData = new FormData();
        formData.append("profilePic",profilePhotoInput.files[0]);
        formData.append("description",description);

        let response = await fetch(`${process.env.REACT_APP_API_URL}/users/${loggedInUser._id}`,
        {
            method:'PUT',
            credentials: 'include',
            withCredentials:true,
            body:formData
        })
        let responseData = await response.json();
        if(responseData.user)
        {
            setUser(responseData.user);
            setDescription(responseData.user.description);
        }
    }

    const onSendFriendReqClick = async () =>
    {
        if(friendStatus === "Send Friend Request")
        {
            await fetch(`${process.env.REACT_APP_API_URL}/users/${loggedInUser._id}/${user._id}/friendRequest`,
            {
                method:"PUT",
                credentials: 'include',
                withCredentials:true,
            })
            setFriendStatus("Friend Request Sent");
        }
    }

    return (
        <div>
            <div id="profileContainer">
                <div id="profileAndFriendsListContainer">
                    <div>
                        <ProfileCard profileCardPicWidth="30%" paddingTop="25px" paddingLeft="4%" profileCardNameFontSize="1.5em"
                        firstName={user?user.firstName:undefined} lastName={user?user.lastName:undefined}
                        userId={user?user._id:undefined} photoUrl={user?user.photoUrl?user.photoUrl:undefined:undefined} withEditProfilePicOption/>
                        {
                            loggedInUser._id !== userId?
                            <Button  variant="contained" disabled={friendStatus !== "Send Friend Request"? true:false}
                            onClick={() => onSendFriendReqClick()}
                            sx={{
                                textTransform:"none",
                                padding: 1,
                                margin:1.5,
                                marginLeft:3,
                                marginTop:4
                            }}>{friendStatus}</Button> : null
                        }
                    </div>
                    <div id="profileFriendsListContainer">
                        <p id="profileFriendsListContainerHeading">Friends</p>
                        <div id="profileFriendsListCards">
                            {
                                friendsList.map((friend) =>
                                {
                                    return <ProfileCard profileCardPicWidth="10%" paddingLeft="2%" paddingBottom="1%" paddingTop="1%" firstName={friend.firstName}
                                    firstNameOnly userId={friend._id} lastName={friend.lastName} key={friend._id}/>
                                })
                            }
                        </div>
                        
                    </div>
                </div>
                <div id="aboutMeContainer">
                    <div id="aboutMeHeading">
                        <p id="aboutMe">About Me</p>
                        {
                            user && userId === loggedInUser._id ?
                            <IconButton onClick={()=> setOpen(true)}>
                                <EditIcon sx={{ color:"white"}}/>
                            </IconButton>:null
                        }

                        <Modal open={open} onClose={() => setOpen(false)}>
                        <Box sx={style}>
                            <p id="EditDetails">Edit Details</p>
                            <form method="POST" encType="multipart/form-data" onSubmit={OnEditUserSubmit}>
                                <Button color="primary" size="small" id="profilePicEditOption"
                                        component='label' variant="contained"
                                        sx={{
                                            zIndex:0, 
                                            textTransform:'none',
                                            marginLeft:1
                                        }}>
                                        <EditIcon sx={{margin:1}}/>
                                        {uploadProfilePicButtonText}
                                        <input hidden accept="image/*" type="file" id="profilePhotoInput"
                                         onChange={(e) => setUploadProfilePicButtonText(e.target.value.substring(12))}/>
                                </Button>

                                <TextField variant="outlined" label="About Me" placeholder="About me" multiline rows={3} fullWidth required
                                sx={{
                                    margin:1,
                                    marginTop:1.5
                                }} value={description} onChange={(e) => setDescription(e.target.value)}/>

                                <Button type="submit" variant="contained"
                                sx={{
                                    textTransform:"none",
                                    marginTop:1.5,
                                    margin:1
                                }}>
                                    Submit
                                </Button>
                            </form>
                        </Box>
                        </Modal>
                    </div>
                    <p id="description">{user?user.description:undefined}</p>
                </div>
            </div>

            {
                feed.length!==0?
                feed.map((post) =>
                {
                    return <PostCard key={post._id} post ={post} fetchFeedData = {fetchUserPostedFeed}/>
                }) : null
            }
        </div>
    )
}
export default ProfilePage;