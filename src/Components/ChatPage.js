// In your React component file
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import { InputAdornment } from "@mui/material";
import { useRef } from "react";
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import ProfileCard from "./ProfileCard";
import ChatPageSideDiv from "./ChatPageSideDiv";
import { useSelector } from "react-redux";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Store from "../Stores/Store";
import { messagesAdd, selectedChatSet, pushNotification} from "../Stores/MyChatsSlice";
import Peer from "peerjs";
var socket;
const ChatPage = () => {

  const ChatPageDiv =
  {
    height: "100%",
    position: "relative",
  };

  const ChatPageHeader =
  {
    backgroundColor: "white",
    margin: "15px",
    marginTop: "25px",
    padding: "10px",
    borderRadius: "15px",
    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
    display: "flex",
    position: "absolute",
    zIndex: 2,
    width:"94%"
  };
  const HeaderButtons = 
  {
    display:"flex"
  }

  const ChatLog =
  {
    overflowY: "auto",
    width: "100%",
    position: "absolute",
    height: "100%",
    margin: "10px",
    paddingTop: "120px",
    boxSizing:"border-box"
  };

  const ChatLogDivChild =
  {
    display: "flex",
    justifyContent: 'end',
    flexDirection: "column",
    bottom: "0px",
    alignItems: "flex-end",
    padding:"0px 20px",
    paddingBottom: "80px"
  };

  const MessageBox = {
    position: 'relative',
    backgroundColor: 'var(--primary)',
    borderRadius: '8px',
    color: "white",
    textShadow: " 2px 2px 10px #333",
    width: "60%",
    padding: "5px 5px",
    margin: "10px 0px",
    boxShadow: "rgba(100, 100, 111, 0.1) 0px 7px 29px 0px",
  };
  const MessageBoxOther = {
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: '8px',
    color: "var(--primary)",
    width: "60%",
    padding: "5px 5px",
    margin: "10px 0px",
    alignSelf: "flex-start",
    boxShadow: "rgba(100, 100, 111, 0.1) 0px 7px 29px 0px",
    
  };
  const Arrow = {
    content: '',
    position: 'absolute',
    top: '100%',
    right: '10px', // Adjust this value to position the pointy end horizontally
    borderWidth: '7px',
    borderStyle: 'solid',
    borderColor: 'var(--primary) var(--primary) transparent transparent',
  };
  const ArrowOther = {
    content: '',
    position: 'absolute',
    top: '100%',
    left: '10px', // Adjust this value to position the pointy end horizontally
    borderWidth: '7px',
    borderStyle: 'solid',
    borderColor: 'white transparent transparent white',
  };

  const user = JSON.parse(sessionStorage.getItem("user"));
  const messagesEndRef = useRef(null);
  const [inputFieldMsg, setInputFieldMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const peerRef = useRef(null);
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);

  const chatSelected = useSelector( (state) =>
  {
    return state.myChats.chatSelected
  })

  const log = useSelector((state) =>
  {
    return state.myChats.messages;
  })

  useEffect(() => {
      socket = io(`${process.env.REACT_APP_API_URL}`, {
      withCredentials: true,
    });
    socket.emit("setup", user);
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {

    const peer = new Peer(`${user._id}`, {debug:3});

    peer.on('open', event => console.log('PeerJS open', event));
    peer.on('error', err => console.log('PeerJS error', err));
    peer.on('connection', conn => console.log('PeerJS connection', conn));
    peer.on('close', () => console.log('PeerJS close'));
    peer.on("call", (call) => {
      var getUserMedia = navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mediaDevices.getUserMedia ||
      navigator.msGetUserMedia;
      getUserMedia(
        { video:true ,audio: true },
        (stream) => {
          call.answer(stream); // Answer the call with an A/V stream.
          call.on("stream", (remoteStream) => {
            // Show stream in some <video> element.
            videoRef1.current.srcObject = stream;
            videoRef1.current.addEventListener("loadedmetadata", () => videoRef1.current.play());
            videoRef2.current.srcObject = remoteStream;
            videoRef2.current.addEventListener("loadedmetadata", () => videoRef2.current.play());
            console.log(remoteStream);
          });
        },
        (err) => {
          console.error("Failed to get local stream", err);
        },
      );
    });                 
    
    peerRef.current = peer;
    return () =>
    {
      peer.destroy();  
    }
  }, [user._id]);

  useEffect(() =>
  { 
    if (chatSelected !== null)
    {
      socket.emit("join chat", chatSelected._id); 
    }
  }, [chatSelected])

  useEffect(() =>
  {
    socket.on("message recieved", (newMessageRecieved) =>
    {
      if (chatSelected?._id === newMessageRecieved.chat._id)
      {
        Store.dispatch(messagesAdd({ message: newMessageRecieved }));
      }
      else
      {
        Store.dispatch(pushNotification({latestMessage : newMessageRecieved}))
      }
    })
  });

  useEffect(() =>
  {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log])
  
  const ConnectAudioCall = async () =>
  {
    var getUserMedia = navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mediaDevices.getUserMedia ||
      navigator.msGetUserMedia;
    getUserMedia(
      { video:true, audio: true },
      (stream) => {
        for (const chatUser of chatSelected.users)
        {
          if (chatUser._id === user._id)
          {
            continue;
          }
          
          const call = peerRef.current?.call(`${chatUser._id}`, stream);
          call.on("stream", (remoteStream) => {
            // Show stream in some <video> element.   
            videoRef1.current.srcObject = stream;
            videoRef1.current.addEventListener("loadedmetadata", () => videoRef1.current.play());
            videoRef2.current.srcObject = remoteStream;
            videoRef2.current.addEventListener("loadedmetadata", () => videoRef2.current.play());
          });
        }
        
      },
      (err) => {
        console.error("Failed to get local stream", err);
      },
    );
  }

  const OnSubmit = async (e) =>
  {
    e.preventDefault();
    setInputFieldMsg("");

    const message = 
    {
      content: inputFieldMsg,
      chatId : chatSelected._id
    }
    const response =await fetch(process.env.REACT_APP_API_URL + `/users/${user._id}/messages/`,{
        method: 'POST',
        credentials: 'include',
        withCredentials:true,
        headers:
        {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(message)
        // mode:"cors"
    })
    const responseData = await response.json();
    Store.dispatch(messagesAdd({ message: responseData }));
    socket.emit("new message", responseData);
  }

  return (
    <div style={ChatPageDiv}>
      <style>
        {`#ChatPageDivStyle
        {
          display : none;
        }
        @media screen and (max-width:1050px)
        {
          #ChatPageDivStyle
          {
            display: block;
          }
        }
        `}
      </style>
      <div id="ChatPageDivStyle">
        {
          chatSelected? null : <ChatPageSideDiv/>
        }
      </div>
      <div style={ChatPageHeader}>
        {
          !chatSelected ?
            <div style={{ padding: "15px", margin: " auto", fontSize: "20px" }}>
              No Chat Selected
            </div> : 
            <div style={{ display: "flex", width: "100%" }}>
              <IconButton sx={{ width: 60, color: "#A975FF" }} onClick={() => Store.dispatch(selectedChatSet({ chatSelected: null }))}>
                <ArrowBackIcon/>
              </IconButton>
              <ProfileCard
                paddingLeft="3%"
                paddingBottom="6px"
                profileCardPicWidth="45px"
                firstName={chatSelected.isGroupChat ? chatSelected.chatName : chatSelected.users[0]._id === user._id? chatSelected.users[1].firstName : chatSelected.users[0].firstName}
                lastName={chatSelected.isGroupChat ? "" : chatSelected.users[0]._id === user._id? chatSelected.users[1].lastName : chatSelected.users[0].lastName }
                comment = {chatSelected.isGroupChat? " " : ""}
                userId={chatSelected.isGroupChat ? "" : chatSelected.users[0]._id === user._id? chatSelected.users[1]._id : chatSelected.users[0]._id}
                key={chatSelected.isGroupChat ? "" : chatSelected.users[0]._id === user._id? chatSelected.users[1]._id : chatSelected.users[0]._id}
                profileCardNameFontSize="20px"
                profileCardSubnamePaddingLeft = "2%"
                profileCardNamePaddingLeft="2%"
                profileCardContainerWidth = "95%"
              />
          <div style={HeaderButtons}>
                <IconButton sx={{ width: 60, color: "#A975FF" }} onClick={() => ConnectAudioCall()}>
              <CallIcon/>
            </IconButton>
            <IconButton sx={{width : 60,color: "#A975FF"}}>
              <VideocamIcon/>
            </IconButton>
          </div>
        </div>
        }        
      </div>
      
      {
        chatSelected ?
          <div  >
              <div style={ChatLog}  id="ChatLog">
                <div style={ChatLogDivChild} >
                  {
                    log.map((obj, index) =>
                      obj.sender._id === user._id ?
                        <div style={MessageBox} key={index}>
                          <div style={Arrow}></div>
                          <p style={{paddingLeft :"2%" , fontWeight:"700"}}>{obj.sender.firstName}</p>
                          <p style={{paddingLeft:"2%", margin:""}}>{obj.content}</p>
                        </div> :
                          <div style={MessageBoxOther} key={index}>
                          <div style={ArrowOther}></div>
                          <p style={{paddingLeft :"2%",fontWeight:"700"}}>{obj.sender.firstName}</p>
                          <p style={{paddingLeft:"2%", margin:""}}>{obj.content}</p>
                          </div> 
                    )
                }
              </div>
              <video ref={videoRef1}></video>
              <video ref={videoRef2}></video>
                <div ref={messagesEndRef} style={{height:"60px"}}></div>                 
              </div>
              <form onSubmit={OnSubmit}>
                <TextField sx={{ 
                  width: "94%",
                  margin: "0 3%",
                  backgroundColor: "white",
                  borderRadius: "15px",
                  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                  position: "absolute",
                  bottom:"20px",
                  '& fieldset': {
                    borderRadius: '15px', // You can set the desired border radius for the fieldset
                  },
                  '@media (max-width: 725px)':
                  {
                    bottom: "80px"
                  }
                  }} variant="outlined" size="large"
                  placeholder="Type here..."  
                  InputProps={{
                  endAdornment:
                        <InputAdornment position="end">
                          <IconButton onClick = {(e) => OnSubmit(e)}>
                            <SendIcon sx ={{color:"var(--primary)"}} ></SendIcon>
                          </IconButton>
                        </InputAdornment>
                  }}  
                  value={inputFieldMsg} onChange={e =>setInputFieldMsg(e.target.value)}/>
              </form>
          </div> : null
      }
      
    </div>
  )
};

export default ChatPage;
