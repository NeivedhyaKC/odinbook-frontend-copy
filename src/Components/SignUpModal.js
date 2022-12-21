import "./styles/SignUpModal.css";
import { TextField, InputAdornment,IconButton,Button } from "@mui/material";
import {Visibility,VisibilityOff} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SignUpModal =(props) =>
{
    let navigate = useNavigate();

    let [firstName,setFirstName] = useState("");
    let [lastName,setLastName] = useState("");
    let [email,setEmail] = useState("");
    let [password,setPassword] = useState("");
    let [confirmPassword,setConfirmPassword] = useState("");
    let [showPassword,setShowPassword] = useState(false);

    let [errMsgs,setErrMsgs] = useState({});

    const validate= () =>
    {
        let tempErrMsgs = {};
        var letters = /^[A-Za-z]+$/;
        if(!firstName.match(letters))
        {
            tempErrMsgs.firstNameErrMsg = "Only alphabets allowed";
        }
        if(!lastName.match(letters))
        {
            tempErrMsgs.lastNameErrMsg = "Only aplhabets allowed";
        }
        if(password.length <= 8)
        {
            tempErrMsgs.passwordErrMsg = "Password should have more than 8 characters";
        }
        if(confirmPassword !== password)
        {
            tempErrMsgs.confirmPasswordErrMsg = "Confirm password and password must match";
        }
        if(Object.keys(tempErrMsgs).length !==0)
        {
            setErrMsgs(tempErrMsgs);
            return false;
        }
        return true;
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const clearModal =() =>
    {
        setFirstName("");
        setLastName("");
        setEmail("");
        setConfirmPassword("")
        setPassword("")
        setShowPassword("");
    }

    const handleSubmit = async (event) =>
    {
        event.preventDefault();
        if(!validate())
        {
            return;
        }

        const user = {
            first_name: firstName,
            last_name:lastName,
            email:email,
            password:password,
            gender:"Male"
        };
        const response = await fetch(process.env.REACT_APP_API_URL + "/users",{
            method: 'POST',
            credentials: 'include',
            withCredentials:true,
            headers:
            {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(user)
            // mode:"cors"
        })
        const responseData = await response.json();
        if(responseData.user /*response.token*/)
        {
            sessionStorage.setItem("user",JSON.stringify(responseData.user));
            navigate("/users");
        }
        clearModal();
        props.setShowSignUpModal(false);
    }

    return (
        <div>
            <div id="overlay" onClick={() => {props.setShowSignUpModal(false); clearModal()}}/>
            <div id="signUpModal">
                <div>
                    <p>Sign up</p>
                    <p>It's quick and easy</p>
                </div>
                <form id="signUpForm" onSubmit={handleSubmit}>
                    <div id="nameContainer">
                        <TextField sx={{ 
                            marginTop: 1.8}} variant="outlined" type="text" 
                            id="firstName" label="First Name" size="large"
                            value={firstName} onChange={e => setFirstName(e.target.value)}
                            error={errMsgs.firstNameErrMsg? errMsgs.firstNameErrMsg.length > 0 : false}
                            helperText={errMsgs.firstNameErrMsg}
                            required
                            />

                        <TextField sx={{ 
                            marginTop: 1.8 }} variant="outlined" type="text" 
                            id="lastName" label="Last Name" size="large"
                            value={lastName} onChange={e => setLastName(e.target.value)}
                            error={errMsgs.lastNameErrMsg? errMsgs.lastNameErrMsg.length > 0 :false}
                            helperText={errMsgs.lastNameErrMsg}
                            required
                            />
                    </div>

                    <TextField sx={{ 
                        }} variant="outlined" type="email" 
                        id="email" label="Email" size="large"
                        value={email} onChange={e => setEmail(e.target.value)}
                        required
                        />

                    <TextField
                    label='Password'
                    variant="outlined"
                    type={showPassword ? "text" : "password"} // <-- This is where the magic happens
                    onChange={e => setPassword(e.target.value)}
                    value= {password}
                    required
                    error={errMsgs.passwordErrMsg? errMsgs.passwordErrMsg.length>0 : false}
                    helperText={errMsgs.passwordErrMsg}
                    InputProps={{ // <-- This is where the toggle button is added.
                        endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={() =>setShowPassword(!showPassword)}
                            onMouseDown={handleMouseDownPassword}
                            >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                        )
                    }}
                    />

                    <TextField sx={{ 
                        }} variant="outlined" type="password" 
                        id="confirmPassword" label="Confirm Password" size="large"
                        value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                        error={errMsgs.confirmPasswordErrMsg? errMsgs.confirmPasswordErrMsg.length > 0 : false}
                        helperText={errMsgs.confirmPasswordErrMsg}
                        required
                        />

                    <Button type="submit" variant="contained" size="large" sx={{
                        paddingTop:1.5,
                        paddingBottom:1.5,
                        marginTop: 2,
                        borderRadius:4
                        }}
                        >Sign Up</Button>
                </form>
            </div>
        </div>
    )
}

export default SignUpModal;