import "./styles/SignUpModal.css";
import { TextField,Button } from "@mui/material";
import Checkbox from '@mui/material/Checkbox';
import { useState, useEffect } from "react";
import ProfileCard from "./ProfileCard";
import Store from "../Stores/Store";
import { chatAdded } from "../Stores/MyChatsSlice";

const CreateGroupModal =(props) =>
{
    const CreateGroupModalStyle =
    {
        boxSizing: "border-box",
        padding: "25px",
        display: "flex",
        flexDirection:" column",
        top: "50%",
        left: "50%",
        width: "450px",
        /* height: 600px; */
        zIndex: "1000",
        position: "fixed",
        backgroundColor:" white",
        transform: "translate(-50%,-50%)",
        borderRadius: "15px",
    };


    let [groupName,setGroupName] = useState("");
    let [friendsList, setFriendsList] = useState([]);
    

    let selectedMembersList = [];
    
    useEffect(() =>
    {
        async function fetchFriends()
        {
            const user =JSON.parse(sessionStorage.getItem("user"));
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}`, { credentials: "include" });
            const responseData = await response.json();
            setFriendsList(responseData.user.friends);
        }
        fetchFriends();
    },[])

    const clearModal =() =>
    {
        setGroupName("");
    }

    const handleSubmit = async (event) =>
    {
        event.preventDefault();
        const user = JSON.parse(sessionStorage.getItem("user"));

        const group = {
            name: groupName,
            users : selectedMembersList
        };
        const response = await fetch(process.env.REACT_APP_API_URL + `/users/${user._id}/chats/group`,{
            method: 'POST',
            credentials: 'include',
            withCredentials:true,
            headers:
            {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(group)
            // mode:"cors"
        })
        const responseData = await response.json();
        Store.dispatch(chatAdded({ chatAdded: responseData }));
        clearModal();
        props.setShowCreateGroupModal(false);
    }

    const handleChange = (e, el) =>
    {
        if (e.target.checked)
        {
            selectedMembersList.push(el);    
        }
        else if (!e.target.checked)
        {
            let indexToRemove = selectedMembersList.findIndex((item) => item._id === el._id);
            if (indexToRemove !== -1) {
                selectedMembersList.splice(indexToRemove, 1);
            }
        }
    }

    return (
        <div>
            <div id="overlay" onClick={() => {props.setShowCreateGroupModal(false); clearModal()}}/>
            <div style={CreateGroupModalStyle}>
                <div style={{fontSize:"1.6em"}}>
                    Create Group
                </div>
                <form onSubmit={handleSubmit}>
                    <TextField sx={{ 
                            width:"100%", 
                            marginTop: 1.8}} variant="outlined" type="text" 
                            id="groupName" label="Group Name" size="large"
                            value={groupName} onChange={e => setGroupName(e.target.value)}
                            required
                    />
                    <div style={{fontSize:"1.3em", margin:"15px"}}>
                    Add members
                    </div>
                {
                    friendsList?.map((el) =>
                    {
                        return (
                            <div style={{display:"flex"}} key={el._id}>
                                <Checkbox onChange={(e) => handleChange(e,el)}/>
                                <ProfileCard paddingLeft="3%" paddingBottom="4px" profileCardPicWidth="12%" borderTop="2px solid var(--tertiary)"
                                marginBottom="10px" paddingTop="4px" profileCardSubnamePaddingLeft="4%" profileCardNamePaddingLeft="4%"
                                key ={el._id} firstName={el.firstName} lastName={el.lastName} userId={el._id} disableLink 
                                />
                            </div>
                        )
                    })
                    }
                    <Button type="submit" variant="contained" size="large" sx={{
                        paddingTop:1.5,
                        paddingBottom:1.5,
                        marginTop: 2,
                        borderRadius:4,
                        textTransform:"none"
                        }} fullWidth
                        >Create Group</Button>
                </form>
            </div>
        </div>
    )
}

export default CreateGroupModal;