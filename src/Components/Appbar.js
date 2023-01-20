import "./styles/Appbar.css";
import MenuIcon from '@mui/icons-material/Menu';
import { Fab } from "@mui/material";

const Appbar =(props) =>
{

    return (
        <div id="appbar">
            <Fab color="primary" size="small" id="menuFab"
            sx={{
                zIndex:0
            }} onClick={() => props.onAppBarMenuButtonClick()}>
                <MenuIcon/>
            </Fab>
            <p id="appbarShareSpace">ShareSpace</p>
        </div>
    )
}

export default Appbar;