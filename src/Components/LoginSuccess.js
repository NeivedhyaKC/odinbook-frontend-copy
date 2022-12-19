import { useEffect } from "react"
import "./styles/LoginSuccess.css";

const LoginSuccess = () =>
{
    useEffect(()=>
    {
        setTimeout(() => {window.close();},500);
    },[])
    return (
        <div id="signingIn">
            Signing In...
        </div>
    )
}
export default LoginSuccess;