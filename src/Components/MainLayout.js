import { useEffect, useRef, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import "./styles/MainLayout.css";
import { Button} from "@mui/material";
import { styled } from "@mui/system";
import HomeIcon from '@mui/icons-material/Home';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PersonIcon from '@mui/icons-material/Person';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ProfileCard from "./ProfileCard";
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import Fab from '@mui/material/Fab';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Appbar from "./Appbar";
import ListModal from "./ListModal";
import { useNavigate } from "react-router-dom";


const MainLayout =()=>
{
    const MenuButton = styled(Button)({
        textTransform:"none",
        justifyContent:"flex-start",
        paddingLeft:40,
        fontSize:15,
        paddingBottom:12,
        paddingTop:12,
        color:"#BDBDBD",
        "&:hover":
        {
            color:"#434E71",
            boxShadow:"0px 0.3px 13px #dfdfdf, 0px -0.3px 13px #dfdfdf"
        },
        "&:focus":
        {
            color:"#434E71"
        },

    })

    const navigate = useNavigate();
    const user =JSON.parse(sessionStorage.getItem("user"));

    const [showListModal,setShowListModal] = useState(false);
    const [showListModal2,setShowListModal2] = useState(false);
    const [showListModal3,setShowListModal3] = useState(false);

    const [listModalList,setListModalList] = useState([]);
    const [listModalList2,setListModalList2] = useState();
    const [listModalList3,setListModalList3] = useState();

    const menuElement = useRef();
    const appbarMenuOverlayElement = useRef();

    useEffect(()=>
    {
        setListModalList2(user.friendRequests);
        setListModalList3(user.friends);
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    async function fetchData()
    {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users`,{credentials:"include"});
        const responseData = await response.json();
        if(responseData.msg === "You must login first")
        {
            navigate("/login");
        }
        return responseData;
    }

    const onAppBarMenuButtonClick =() =>
    {
        menuElement.current.classList.add("active");
        appbarMenuOverlayElement.current.classList.add("active");
    }

    const CloseAppBarMenu = () =>
    {
        menuElement.current.classList.remove("active");
        appbarMenuOverlayElement.current.classList.remove("active");
    }

    const onSearchButtonClick = async () =>
    {
        setShowListModal(true);
        setListModalList(await fetchData());
    }

    const onFriendReqSeeAllButtonClick = () =>
    {
        setShowListModal2(true);
        setListModalList2(user.friendRequests);
    }

    const onFriendsSeelAllButtonClick = () =>
    {
        setShowListModal3(true);
        setListModalList3(user.friends);
    }

    const onLogoutButtonClick = async () =>
    {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/logout`,
        {
            method: 'POST',
            credentials: 'include',
            withCredentials:true,
        });
        const responseData = await response.json();
        if(responseData.msg === "Logged out successfully")
        {
            navigate("/login");
        }
    }

    if(sessionStorage.getItem("user") === null)
    {
        return <Navigate to="/login"></Navigate>
    }
    return (
        <div id="mainLayout">
            <Appbar onAppBarMenuButtonClick={onAppBarMenuButtonClick}/>   
            <ListModal showListModal={showListModal} setShowListModal ={setShowListModal} listModalList={listModalList} noAdditionalOps/>
            <ListModal showListModal={showListModal2} setShowListModal ={setShowListModal2} listModalList={listModalList2} 
            withAccept withReject setFriendRequestsList={setListModalList2} setFriendsList={setListModalList3} />
            <ListModal showListModal={showListModal3} setShowListModal ={setShowListModal3} listModalList={listModalList3} noAdditionalOps/>
            <div id="appbarMenuOverlay" ref={appbarMenuOverlayElement} onClick={()=> CloseAppBarMenu()}></div>
            <div id="menu" ref={menuElement}>
                <div id="menuChild">
                    <p id="menuShareSpace">ShareSpace</p>
                    <p id="menuHeading">Menu</p>
                    <div onClick={()=> CloseAppBarMenu()}>
                        <MenuButton variant="text" id="menuSearchField"
                        sx={{
                            display:"none",
                            "@media screen and (max-width:1050px)":
                            {
                                "display":"block"
                            },
                        }}
                        startIcon={<SearchIcon
                        sx={{
                            width:30,
                            height:30,
                            paddingRight:2,
                            color:"#A975FF"
                        }}/>} fullWidth
                        onClick ={() => onSearchButtonClick()}
                        >Search</MenuButton>

                        <MenuButton variant="text"
                        startIcon={<HomeIcon
                        sx={{
                            width:30,
                            height:30,
                            paddingRight:2,
                            color:"#A975FF"
                        }}/>} fullWidth
                        onClick={() => navigate("/home")}
                        >Home</MenuButton>

                        <MenuButton variant="text" color="secondary"
                        startIcon={<PersonIcon color="primary"
                        sx={{
                            width:30,
                            height:30,
                            paddingRight:2,
                            color:"#A975FF"
                        }}/>} fullWidth
                        onClick={() => navigate("/profile",{state:{userId:user._id}})}
                        >Profile</MenuButton>

                        <MenuButton variant="text" color="secondary"
                        startIcon={<ChatBubbleIcon color="primary"
                        sx={{
                            width:30,
                            height:30,
                            paddingRight:2,
                            color:"#A975FF"
                        }}/>} fullWidth
                        >Messages</MenuButton>
                        
                        <MenuButton variant="text" color="secondary"
                        startIcon={<BookmarkIcon color="primary"
                        sx={{
                            width:30,
                            height:30,
                            paddingRight:2,
                            color:"#A975FF"
                        }}/>} fullWidth
                        onClick={() => navigate("/savedPosts")}
                        >Saved Posts</MenuButton>

                        <MenuButton variant="text" color="secondary" id="menuFriends" onClick={() => onFriendsSeelAllButtonClick()}
                        startIcon={<GroupIcon color="primary"
                        sx={{
                            width:30,
                            height:30,
                            paddingRight:2,
                            color:"#A975FF"
                        }}/>} fullWidth
                        >Friends</MenuButton>

                        <MenuButton variant="text" color="secondary" id="menuFriendRequests" onClick={() => onFriendReqSeeAllButtonClick()}
                        startIcon={<PersonAddIcon color="primary"
                        sx={{
                            width:30,
                            height:30,
                            paddingRight:2,
                            color:"#A975FF"
                        }}/>} fullWidth
                        >Friend Requests</MenuButton>
                    </div>
                    <p id="accountHeading">Account</p>
                    <ProfileCard id="accountMenu" firstName={user.firstName} lastName={user.lastName} userId={user._id} photoUrl={user.photoUrl? 
                        user.photoUrl:undefined}/>
                    <MenuButton variant="text" color="secondary" id="menuLogout" onClick ={() => onLogoutButtonClick()}
                        startIcon={<LogoutIcon color="primary" onClick={()=> CloseAppBarMenu()}
                        sx={{
                            width:30,
                            height:30,
                            paddingRight:2,
                            color:"#A975FF"
                        }}/>} fullWidth
                        >Logout</MenuButton>
                </div>
            </div>
            <div id="mainDiv">
                <Outlet/>
            </div>

            
            <div id="sideDiv">
                <div id="sideDivChild">
                    <div id="searchFieldAndLogoutContainer">
                        <Button id="searchField" variant="outlined" startIcon={<SearchIcon color="primary"/>}
                        sx={{
                            width:"65%",
                            textTransform:"none",
                            justifyContent:"flex-start",
                            fontSize:17
                        }}
                        onClick={() => onSearchButtonClick()}>Search</Button>

                        <Fab color="primary" onClick={() => onLogoutButtonClick()}
                        sx={{
                            zIndex:0
                        }}>
                            <LogoutIcon />
                        </Fab>

                    </div>
                    <div id="friendsWithProfileCardContainer">

                        <div className="friendsContainer">
                            <p>Friends</p>
                            {
                                listModalList3 && listModalList3.length !==0?
                                <Button variant="text" onClick={() => onFriendsSeelAllButtonClick()}
                                sx={{
                                    textTransform:"none"
                                }}>See All</Button>:null
                            }
                        </div>
                        {
                            listModalList3?
                            listModalList3.map((el,index) =>
                            {
                                if(index < 3)
                                {
                                    return <ProfileCard paddingLeft="5%" paddingBottom = "6px" profileCardPicWidth="17%" firstName={el.firstName}
                                    lastName={el.lastName} userId={el._id} key={el._id}/>
                                }
                                else
                                {
                                    return null;
                                }
                            }):null
                        }
                        {
                            listModalList3 && listModalList3.length===0? <p id="noFriendRequests">No friends yet.</p> : null
                        }
                    </div>
                    
                    
                    <div className="friendsContainer">
                        <p>Friend Requests</p>
                        {
                            listModalList2 && listModalList2.length!==0?
                            <Button variant="text" onClick={() =>onFriendReqSeeAllButtonClick()}
                            sx={{
                                textTransform:"none"
                            }}>See All</Button>:null
                        }
                    </div>
                    {
                        listModalList2?
                        listModalList2.map((el,index) =>
                        {
                            if(index < 3)
                            {
                                return <ProfileCard paddingLeft="5%" paddingBottom = "6px" profileCardPicWidth="17%" firstName={el.firstName}
                                lastName={el.lastName} userId={el._id} withAcceptButton={true} setFriendRequestsList={setListModalList2}
                                setFriendsList={setListModalList3} key={el._id}/>
                            }
                            else
                            {
                                return null;
                            }
                        }):null
                    }
                    {
                        listModalList2 && listModalList2.length===0? <p id="noFriendRequests">No friend requests.</p> : null
                    }
                </div>
            </div>
        </div>
    )
}

export default MainLayout;