import "./styles/LoginPage.css";
import backgroundImage from "../Images/backgroundImage.png";
import TextField from '@mui/material/TextField';
import {Button} from "@mui/material";
import { InputAdornment, IconButton } from "@mui/material";
import { Visibility,VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () =>
{
    let navigate = useNavigate();
    let [errMsg,setErrMsg] = useState({
        emailErrMsg:'',
        passwordErrMsg:''
    })
    const [email,setEmail] = useState("");
    const [values,setValues] = useState({
        password:"",
        showPassword:false
    });

    const handleChange = (prop) => (event) => {
     setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({
          ...values,
          showPassword: !values.showPassword,
        });
      };
    
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleSubmit = async (event) =>
    {
        event.preventDefault();
        const data = {email:email,password:values.password};

        const response = await fetch("http://localhost:5000/login",{
            method: 'POST',
            headers:
            {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data)
        });
        const responseData = await response.json();
        if(responseData.token)
        {
            sessionStorage.setItem('token',responseData.token);
            sessionStorage.setItem('user',responseData.user);
            navigate("/users");
        }
        else
        {
            if(responseData.info.err === -1)
            {
                setErrMsg({emailErrMsg:responseData.info.msg,passwordErrMsg:''});
            }
            else if(responseData.info.err === -2)
            {
                setErrMsg({passwordErrMsg:responseData.info.msg,emailErrMsg:''});
            }
            setEmail("");
            setValues({password:"", showPassword:false})
        }
    }

    return (
        <div id="loginPage">
            <div id="shareSpaceContainer">
                <div>
                    <p id="shareSpace">ShareSpace</p>
                    <p id="subheading">Connect with friends and the world around you on ShareSpace.</p>
                </div>
                <img id="backgroundImage" src={backgroundImage} alt="backgroundImage"/>
            </div>
            <div id="loginBox">
                <p id="login">Login</p>
                <form id="loginForm" onSubmit={handleSubmit}>
                    <TextField sx={{ 
                        width: 350,
                        marginTop: 4}} variant="outlined" type="email" 
                        id="email" label="Email" size="large"
                        value={values.email} onChange={e => setEmail(e.target.value)}
                        error={errMsg.emailErrMsg.length > 0}
                        helperText={errMsg.emailErrMsg}
                        required/>

                    <TextField
                    label='Password'
                    variant="outlined"
                    type={values.showPassword ? "text" : "password"} // <-- This is where the magic happens
                    onChange={handleChange('password')}
                    sx={{width:350}}
                    error={errMsg.passwordErrMsg.length>0}
                    helperText={errMsg.passwordErrMsg}
                    InputProps={{ // <-- This is where the toggle button is added.
                        endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            >
                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                        )
                    }}
                    />

                    <Button type="submit" variant="contained" size="large" sx={{
                        width: 200,
                        paddingTop:1.5,
                        paddingBottom:1.5,
                        marginTop: 2,
                        }}>Login</Button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage;