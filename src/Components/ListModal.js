import { useEffect, useRef } from "react";
import "./styles/ListModal.css";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const ListModal = (props) =>
{
    const listModalElement = useRef();
    const listModalOverlayElement = useRef();
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
    })

    const CloseListModal = () =>
    {
        listModalElement.current.classList.remove('active');
        listModalOverlayElement.current.classList.remove('active');
        props.setShowListModal(false);
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
                    }}
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
            </div>
        </div>
    )
}

export default ListModal;