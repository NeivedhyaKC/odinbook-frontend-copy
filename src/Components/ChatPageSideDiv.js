import { Button } from "@mui/material";
import Fab from "@mui/material/Fab";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import {  useState } from "react";
import ListModal from "./ListModal";
import AddIcon from '@mui/icons-material/Add';
import MyChat from "./MyChat";
import CreateGroupModal from "./CreateGroupModal";


const ChatPageSideDiv = () => {

    const mainDiv = 
    {
        borderLeft: '2px solid #e2e2e2',
        height: '100%'
    }  

    const CreateAGroupText = 
    {
		marginLeft: "10px",
		color: "var(--secondary)",
		fontSize: 17
    }
  
	const AddIconStyle = 
	{
		backgroundColor: "var(--primary)",
		borderRadius: "50px",
		padding: "15px",
		color: "white",
		boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
	}


  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [friendsList, setFriendsList] = useState([]);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  

  async function fetchFriendsList()
  {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}`,{credentials:"include"});
      const responseData = await response.json();
      if (responseData.msg === "You must login first")
      {
          navigate("/login");
      }
      return responseData.user.friends;
  }
  
  const OnCreateGroupButtonClick = () =>
  {
    setShowCreateGroupModal(true);
  }
    
  const onSearchButtonClick = async () => {
      setShowFriendsModal(true);
      setFriendsList(await fetchFriendsList());
  };

    const onLogoutButtonClick = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/users/logout`,
      {
        method: "POST",
        credentials: "include",
        withCredentials: true,
      }
    );
    const responseData = await response.json();
    if (responseData.msg === "Logged out successfully") {
      navigate("/login");
    }
  };

  return (
    <div>
      <style>
        {`
          @media screen and (max-width:1050px)
          {
            #mainChatPageSideDiv
            {
              border-left-width :0px;
              padding : 3%;
            }
          }
        `}
      </style>
      {
        showCreateGroupModal ? <CreateGroupModal setShowCreateGroupModal={ setShowCreateGroupModal} /> : null
      }
      <div style={mainDiv} id="mainChatPageSideDiv">
            <ListModal
                showListModal={showFriendsModal}
                setShowListModal={setShowFriendsModal}
                listModalList={friendsList}
                withChat
            />
            <div id="searchFieldAndLogoutContainer">
            <Button
              id="searchField"
              variant="outlined"
              startIcon={<SearchIcon color="primary" />}
              sx={{
                width: "65%",
                textTransform: "none",
                justifyContent: "flex-start",
                fontSize: 17,
              }}
              onClick={() => onSearchButtonClick()}
            >
              Search
            </Button>

            <Fab
              color="primary"
              onClick={() => onLogoutButtonClick()}
              sx={{
                zIndex: 0,
              }}
            >
              <LogoutIcon />
            </Fab>
            </div>
            <Button
                color="tertiary"
                sx={{
                    textTransform: "none",
                    width : '85%',
                    backgroundColor: 'white',
                    margin: '20px',
                    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                    borderRadius: "15px",
                    padding: '10px',
                    justifyContent: "flex-start",
                    text: 'black',
                    "@media screen and (max-width:1050px)":
                    {
                      width: "93%"
                    }
                }}
                onClick={() => OnCreateGroupButtonClick()}    
            >                
                <AddIcon style={AddIconStyle} />
                <span style={CreateAGroupText}>Create a Group</span>
        </Button>
        <MyChat/>
        </div>
      </div>
      
    );
};

export default ChatPageSideDiv;