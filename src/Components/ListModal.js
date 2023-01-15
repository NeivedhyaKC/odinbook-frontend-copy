import { useEffect, useRef, useState } from "react";
import "./styles/ListModal.css";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import ProfileCard from "./ProfileCard";
const ListModal = (props) =>
{
    const listModalElement = useRef();
    const listModalOverlayElement = useRef();

    const [listModalList,setListModalList] = useState([]);
    const [searchInput,setSearchInput] = useState("");

    useEffect(()=>
    {
        if(props.showListModal)
        {
            listModalElement.current.classList.add('active');
            listModalOverlayElement.current.classList.add('active');
        }
        else 
        {
            listModalElement.current.classList.remove('active');
            listModalOverlayElement.current.classList.remove('active');
        }
    });

    useEffect(() =>
    {
        setListModalList(props.listModalList? props.listModalList:[]);
    },[props.listModalList])

    const CloseListModal = () =>
    {
        listModalElement.current.classList.remove('active');
        listModalOverlayElement.current.classList.remove('active');
        props.setShowListModal(false);
    }

    const OnSearchInputChange = (e) =>
    {
        setSearchInput(e.target.value);
        setListModalList(props.listModalList.filter((el) =>
        {
            return `${el.firstName} ${el.lastName}`.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1;
        }));
    }

    return (
        <div>
            <div id="listModalOverlay" ref={listModalOverlayElement} onClick={() => CloseListModal()}></div>
            <div id="listModal" ref={listModalElement}>
                <div id="SearchTextFieldContainer">
                    <TextField variant="standard" placeholder="Search..." id="listModalSearch"
                    sx={{
                        padding:1,
                        paddingLeft:3
                    }} value={searchInput} onChange={e => OnSearchInputChange(e)}
                    InputProps={{
                        disableUnderline:true,
                        startAdornment: (
                            <InputAdornment position="start">
                            <SearchIcon 
                            sx={{
                                fontSize:30
                            }}/>
                            </InputAdornment>
                        )
                        }}
                    inputProps={{style: {fontSize: 28}}} // font size of input text
                    InputLabelProps={{style: {fontSize: 28}}} // font size of input label
                    />
                </div>
                <p id="listModalResults">Results</p>
                <div id="listModalList">
                    {
                        props.noAdditionalOps?
                        listModalList.map((el) =>
                        {
                            return <ProfileCard paddingLeft="3%" paddingBottom = "4px" profileCardPicWidth="12%" borderTop="2px solid var(--tertiary)"
                                marginBottom="2px" paddingTop="4px" profileCardSubnamePaddingLeft="4%" profileCardNamePaddingLeft="4%"
                                key ={el._id} firstName={el.firstName} lastName={el.lastName} userId={el._id}/>
                        }):null
                    }
                    {
                        props.withAccept && props.withReject?
                        listModalList.map((el) =>
                        {
                            return <ProfileCard paddingLeft="3%" paddingBottom = "4px" profileCardPicWidth="12%" borderTop="2px solid var(--tertiary)"
                                marginBottom="2px" paddingTop="4px" profileCardSubnamePaddingLeft="4%" profileCardNamePaddingLeft="4%"
                                key ={el._id} firstName={el.firstName} lastName={el.lastName} userId={el._id} withAcceptButton withRejectButton
                                setFriendRequestsList={props.setFriendRequestsList} setFriendsList={props.setFriendsList}/>
                        }):null
                    }
                </div>
            </div>
        </div>
    )
}

export default ListModal;