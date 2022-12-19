import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const MainLayout =()=>
{
    useEffect(() => 
    {
        async function fetchData()
        {
            const response = await fetch("http://localhost:5000/users",{credentials:"include"});
            const responseData = await response.json();
        }
        fetchData();
    },[])
    if(sessionStorage.getItem("user") === null)
    {
        return <Navigate to="/login"></Navigate>
    }
    return (
        <div>
            hellow
        </div>
    )
}

export default MainLayout;