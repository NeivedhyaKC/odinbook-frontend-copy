import { Button } from "@mui/material";
import Fab from "@mui/material/Fab";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ListModal from "./ListModal";
import AddIcon from '@mui/icons-material/Add';


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

    const [showFriendsAndGroupsModal, setShowFriendsAndGroupsModal] = useState(false);
    const [FriendsAndGroupsList, setFriendsAndGroupsList] = useState([]);

    async function fetchData()
    {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        credentials: "include",
        });
        const responseData = await response.json();
        if (responseData.msg === "You must login first")
        {
            navigate("/login");
        }
        return responseData;
    }
    const onSearchButtonClick = async () => {
        setShowFriendsAndGroupsModal(true);
        setFriendsAndGroupsList(await fetchData());
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
        <div style={mainDiv}>
            <ListModal
                showListModal={showFriendsAndGroupsModal}
                setShowListModal={setShowFriendsAndGroupsModal}
                listModalList={FriendsAndGroupsList}
                noAdditionalOps
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
                    text : 'black'
                }}
            >                
                <AddIcon style={AddIconStyle} />
                <span style={CreateAGroupText}>Create a Group</span>
        </Button>
        </div>
    );
};

export default ChatPageSideDiv;