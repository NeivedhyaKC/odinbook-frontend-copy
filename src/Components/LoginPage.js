import "./styles/LoginPage.css";
import backgroundImage from "../Images/backgroundImage.png";
import TextField from '@mui/material/TextField';
import {Button} from "@mui/material";
import { InputAdornment, IconButton } from "@mui/material";
import { Visibility,VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleButton from 'react-google-button'
import SignUpModal from "./SignUpModal";


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
    let [showSignUpModal,setShowSignUpModal] = useState(false);
    let [loading,setLoading] = useState(false);
    let [loginAsExampleUserText, setLoginAsExampleUserText] = useState("Login as Example User");
    let [loginText,setLoginText] = useState("Login");
    

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
        if(loading)
        {
            return;
        }
        setLoading(true);
        setLoginText("Loading... might take a minute");
        event.preventDefault();
        const data = {email:email,password:values.password};

        fetch(`${process.env.REACT_APP_API_URL}/login`,{
            method: 'POST',
            credentials: 'include',
            withCredentials:true,
            headers:
            {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then((responseData) =>
        {
            setLoading("false");
            setLoginText("Login");
            if(responseData.user /*response.token*/)
            {
                sessionStorage.setItem("user",JSON.stringify(responseData.user));
                navigate("/home");
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
        })
        
    }

    const OnSignInWithGoogleClick = async () =>
    {
        const newWindow = window.open(`${process.env.REACT_APP_API_URL}/auth/google`,"_blank", "width=500,height=600");
        if(newWindow)
        {
            const timerId = setInterval(async () => 
            {
                if(newWindow.closed)
                {
                    if(timerId)
                    {
                        clearInterval(timerId);
                    }
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/users/authUser`, {credentials: "include"});
                    const responseData = await response.json();
                    sessionStorage.setItem("user",JSON.stringify(responseData.user));
                    navigate("/home");
                }
            },500);
        }
    }

    const signInAsExampleUser = async () =>
    {
        if(loading)
        {
            return;
        }
        setLoading(true);
        setLoginAsExampleUserText("Loading... might take a minute")
        const data = {email:"ExampleUser@mail.com",password:"ExampleUser@mail.com"};

        fetch(`${process.env.REACT_APP_API_URL}/login`,{
            method: 'POST',
            credentials: 'include',
            withCredentials:true,
            headers:
            {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .then((responseData) =>
        {
            if(responseData.user /*response.token*/)
            {
                sessionStorage.setItem("user",JSON.stringify(responseData.user));
                navigate("/home");
                setLoading(false);
                setLoginAsExampleUserText("Login as Example User");
            }
        });
    }

    return (
        <div id="loginPage">
            {
                showSignUpModal ? <SignUpModal setShowSignUpModal = {setShowSignUpModal}/> : null 
            }
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
                    required
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
                        width: 350,
                        paddingTop:1.2,
                        paddingBottom:1.5,
                        marginTop: 2,
                        borderRadius:4
                        }}>{loginText}</Button>
                </form>
                <div id="signUpContainer">
                    <Button variant="contained" sx={{
                        width:350,
                        paddingTop:1.3,
                        paddingBottom:1.5,
                        borderRadius:4
                    }}
                    onClick={() =>setShowSignUpModal(true)}>
                        Sign Up
                    </Button>
                    <p id="or">or</p>
                    <GoogleButton onClick={() => OnSignInWithGoogleClick()}/>
                    <Button variant="contained" sx={{
                        width:350,
                        paddingTop:1.3,
                        paddingBottom:1.5,
                        marginTop:2,
                        borderRadius:4,
                        marginBottom:2,
                        textTransform:"none"
                    }}
                    onClick={() =>signInAsExampleUser()} id="loginAsExampleUser">
                        {loginAsExampleUserText}
                    </Button>
                </div>
                
            </div>
        </div>
    )
}

export default LoginPage;