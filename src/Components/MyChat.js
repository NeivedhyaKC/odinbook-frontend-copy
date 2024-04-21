import { useEffect } from "react";
import ProfileCard from "./ProfileCard";
import { useNavigate } from "react-router-dom";
import Store from "../Stores/Store";
import { chatsSet, messagesSet, selectedChatSet } from "../Stores/MyChatsSlice";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";


const MyChat = () =>
{
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem("user"));

    const MyChatDiv = 
    {
        backgrondColor: "white",
        border: "none",
        borderRadius: "20px",
        margin : "4%"
    }

    const chats = useSelector((state) =>
    {
        return state.myChats.chats;
    })

    async function fetchChats()
    {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}/chats/`,{credentials:"include"});
        const responseData = await response.json();
        if (responseData.msg === "You must login first")
        {
            navigate("/login");
        }
        Store.dispatch(chatsSet({ chats: responseData }));
        return responseData;
    }

    const OnChatSelected = async (chat) =>
    {
        const user = JSON.parse(sessionStorage.getItem("user"));
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}/messages/${chat._id}`, { credentials: "include" });
        const responseData = await response.json();
        Store.dispatch(selectedChatSet({ chatSelected: chat }));
        Store.dispatch(messagesSet({ messages: responseData }));
    }
  
    useEffect( () =>
    {
        fetchChats();
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            <div style= {MyChatDiv}>
            {
                chats?.map((el) =>
                {
                    if (!el.isGroupChat)
                    {
                        return (
                                    <Button
                                    color="tertiary"
                                    sx={{
                                        textTransform: "none",
                                        width : '100%',
                                        textAlign:"left"
                                    }}
                                    key={el._id} 
                                    onClick={() => { OnChatSelected(el)}}
                                >                
                                    <ProfileCard
                                        paddingLeft="1%"
                                        paddingBottom="6px"
                                        profileCardPicWidth="45px"
                                        firstName={el.users[0]._id === user._id? el.users[1].firstName : el.users[0].firstName }
                                        lastName={el.users[0]._id === user._id? el.users[1].lastName : el.users[0].lastName }
                                        userId={el.users[0]._id === user._id? el.users[1]._id : el.users[0]._id }
                                        key={el.users[0]._id === user._id? el.users[1]._id : el.users[0]._id } 
                                        profileCardNameFontSize="20px"
                                        profileCardSubnamePaddingLeft="2%"
                                        profileCardNamePaddingLeft="2%"
                                        profileCardContainerWidth="95%"
                                        commentHeight = "25px"
                                        comment={el.latestMessage ? el.latestMessage.sender._id === user._id ? el.latestMessage.content : 
                                            `${el.latestMessage.sender.firstName} : ${el.latestMessage.content}`: ""}
                                        disableLink
                                    />  
                                </Button>
                                    
                            ); 
                    }
                    return(
                    <div key={el._id} >
                                    <Button
                                    color="tertiary"
                                    sx={{
                                        textTransform: "none",
                                        width : '100%',
                                        textAlign:"left"
                                    }}
                                    key={el._id} 
                                    onClick={() => { OnChatSelected(el)}}
                                >                
                                    <ProfileCard
                                        paddingLeft="1%"
                                        paddingBottom="6px"
                                        profileCardPicWidth="45px"
                                        firstName={el.chatName}
                                        lastName={""}
                                        profileCardNameFontSize="20px"
                                        profileCardSubnamePaddingLeft="2%"
                                        profileCardNamePaddingLeft="2%"
                                        profileCardContainerWidth="95%"
                                        commentHeight = "25px"
                                        comment={el.latestMessage ? el.latestMessage.sender._id === user._id ? el.latestMessage.content : 
                                            `${el.latestMessage.sender.firstName} : ${el.latestMessage.content}`: ""}
                                        disableLink
                                    />  
                                </Button>
                    </div>)
                })
            }
            </div>
        </div>
    );
}

export default MyChat;