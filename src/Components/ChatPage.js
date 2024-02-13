// In your React component file
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import { InputAdornment } from "@mui/material";
import { useRef } from "react";

const ChatPage = () => {

  const ChatPageDiv =
  {
    height: "100%",
    position: "relative"
  };

  const ChatLog =
  {
    overflowY: "auto",
    width: "100%",
    position: "absolute",
    height: "100%",
    margin: "10px"
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
    padding: '15px',
    borderRadius: '8px',
    color: "white",
    textShadow: " 2px 2px 10px #333",
    width: "60%",
    padding: "5px 5px",
    margin: "10px 0px"
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

  const chatLogRef = useRef(null); 
  const [inputFieldMsg, setInputFieldMsg] = useState("");
  const [log, setLog] = useState([]);
  useEffect(() => {
    const socket = io(`${process.env.REACT_APP_API_URL}`, {
      withCredentials: true,
    });

    socket.on("chat message", (msg) => { 
      console.log("Received message:", msg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const OnSubmit = (e) =>
  {
    e.preventDefault();
    setLog([...log, { message: "This is a message with a pointy end swaod iab wdoawid awdi anwdi nawdp ianwd pin" }]);
  }

  return (
    <div style={ChatPageDiv}>
      <div style={ChatLog} ref={chatLogRef} id="ChatLog">
        <div style={ChatLogDivChild}>
          {
            log.map((obj, index) =>
            {
              return (
                <div style={MessageBox} key={index}>
                  <div style={Arrow}></div>
                  <p>{obj.message}</p>
                </div>
              )
            })
          }
          <div style={MessageBox}>
            <div style={Arrow}></div>
            <p>This is a message with a pointy end!</p>
          </div><div style={MessageBox}>
            <div style={Arrow}></div>
            <p>This is a message with a pointy end!</p>
          </div>
        </div>
        
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
        }} variant="outlined" type="email" size="large"
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
      
	</div>
  )
};

export default ChatPage;
