import { useEffect, useRef } from "react";
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
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import LogoutIcon from '@mui/icons-material/Logout';
import Fab from '@mui/material/Fab';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Appbar from "./Appbar";

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

    const menuElement = useRef();
    const appbarMenuOverlayElement = useRef();

    useEffect(() => 
    {
        async function fetchData()
        {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users`,{credentials:"include"});
            const responseData = await response.json();
            console.log(responseData);
        }
        fetchData();
    },[])

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
    if(sessionStorage.getItem("user") === null)
    {
        return <Navigate to="/login"></Navigate>
    }
    return (
        <div id="mainLayout">
            <Appbar onAppBarMenuButtonClick={onAppBarMenuButtonClick}/>   
            <div id="appbarMenuOverlay" ref={appbarMenuOverlayElement} onClick={()=> CloseAppBarMenu()}></div>
            <div id="menu" ref={menuElement}>
                <p id="menuShareSpace">ShareSpace</p>
                <p id="menuHeading">Menu</p>
                <div onClick={()=> CloseAppBarMenu()}>
                    <TextField id="menuSearchField" placeholder="Search" variant="outlined"
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="primary"/>
                                </InputAdornment>
                                ),
                            }}
                            sx={{
                                padding:1,
                                display:"none",
                                "@media screen and (max-width:1050px)":
                                {
                                    "display":"block"
                                }
                            }}></TextField>

                    <MenuButton variant="text"
                    startIcon={<HomeIcon
                    sx={{
                        width:30,
                        height:30,
                        paddingRight:2,
                        color:"#A975FF"
                    }}/>} fullWidth
                    onClick={() => console.log("hello")}
                    >Home</MenuButton>

                    <MenuButton variant="text" color="secondary"
                    startIcon={<PersonIcon color="primary"
                    sx={{
                        width:30,
                        height:30,
                        paddingRight:2,
                        color:"#A975FF"
                    }}/>} fullWidth
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
                    >Saved Posts</MenuButton>

                    <MenuButton variant="text" color="secondary" id="menuFriends"
                    startIcon={<GroupIcon color="primary"
                    sx={{
                        width:30,
                        height:30,
                        paddingRight:2,
                        color:"#A975FF"
                    }}/>} fullWidth
                    >Friends</MenuButton>

                    <MenuButton variant="text" color="secondary" id="menuFriendRequests"
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
                <ProfileCard id="accountMenu" firstName="John" lastName="Conner"/>
                <MenuButton variant="text" color="secondary" id="menuLogout"
                    startIcon={<LogoutIcon color="primary" onClick={()=> CloseAppBarMenu()}
                    sx={{
                        width:30,
                        height:30,
                        paddingRight:2,
                        color:"#A975FF"
                    }}/>} fullWidth
                    >Logout</MenuButton>
            </div>
            <div id="mainDiv">
                <Outlet/>
            </div>

            
            <div id="sideDiv">
                <div id="sideDivChild">
                    <div id="searchFieldAndLogoutContainer">
                        <TextField id="searchField" placeholder="Search" variant="outlined"
                        InputProps={{
                            startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="primary"/>
                            </InputAdornment>
                            ),
                        }}
                        sx={{
                            width:"65%",
                        }}></TextField>

                        <Fab color="primary">
                            <LogoutIcon/>
                        </Fab>

                    </div>
                    <div id="friendsWithProfileCardContainer">

                        <div className="friendsContainer">
                            <p>Friends</p>
                            <Button variant="text"
                            sx={{
                                textTransform:"none"
                            }}>See All</Button>
                        </div>
                        <ProfileCard paddingLeft="5%" paddingBottom = "6px" profileCardPicWidth="17%"/>
                        <ProfileCard paddingLeft="5%" paddingBottom = "6px" profileCardPicWidth="17%"/>
                        <ProfileCard paddingLeft="5%" paddingBottom = "6px" profileCardPicWidth="17%"/>
                    </div>
                    
                    
                    <div className="friendsContainer">
                        <p>Friend Requests</p>
                        <Button variant="text"
                        sx={{
                            textTransform:"none"
                        }}>See All</Button>
                    </div>
                    <ProfileCard paddingLeft="5%" paddingBottom = "6px" profileCardPicWidth="17%" withAcceptButton={true}/>
                    <ProfileCard paddingLeft="5%" paddingBottom = "6px" profileCardPicWidth="17%" withAcceptButton={true}/>
                </div>
            </div>
        </div>
    )
}

export default MainLayout;