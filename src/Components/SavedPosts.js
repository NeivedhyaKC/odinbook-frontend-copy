import { useEffect, useState } from "react";
import "./styles/SavedPosts.css";
import PostCard from "./PostCard";

const SavedPosts = () =>
{
    let [savedPosts,setSavedPosts] = useState([]);

    const fetchSavedPosts = async () =>
    {
        const user =JSON.parse(sessionStorage.getItem("user"));
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}/savedPosts`,
        {
            method:"GET",
            credentials: 'include',
            withCredentials:true,
        })
        const responseData = await response.json();
        user.savedPosts = responseData.posts;
        sessionStorage.setItem("user",JSON.stringify(user));
        setSavedPosts(responseData.posts);
    }
    useEffect(() =>
    {
        fetchSavedPosts();
    },[])
    return (
        <div>
            {   
                savedPosts?
                savedPosts.map((post) =>
                {
                    return <PostCard key={post._id} post ={post} fetchFeedData = {fetchSavedPosts} setSavedPosts ={setSavedPosts}/>
                }) : null
            }
            
        </div>
    )
}
export default SavedPosts;