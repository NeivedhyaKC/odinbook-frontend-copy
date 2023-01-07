import "./styles/HomePage.css";
import TextField from '@mui/material/TextField';
import { Button} from "@mui/material";
import PostCard from "./PostCard";
import { useEffect, useState } from "react";

const HomePage = () =>
{
    let [postContent,setPostContent] = useState("");
    let [feed, setFeed] = useState([]);

    const user =JSON.parse(sessionStorage.getItem("user"));

    useEffect(() => 
    {
        async function fetchFeedData()
        {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}/posts`,
            {
                method:'GET',
                credentials: 'include',
                withCredentials:true
            });
            const responseData = await response.json();
            setFeed(responseData);
        }
        fetchFeedData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const handlePostSubmit = async (event) =>
    {
        event.preventDefault();
        const uploadInput = document.getElementById("postImage");

        let formData = new FormData();
        
        formData.append("postImage",uploadInput.files[0]);

        formData.append("userId",user._id);
        formData.append("content",postContent);
        formData.append("postedAt",new Date().toISOString());
        formData.append("likes",0);
        formData.append("comments",[]);
        // formData.append("post",post);
        await fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}/posts`,{
            method: 'POST',
            credentials: 'include',
            withCredentials:true,
            body: formData
        })

        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}/posts`,
        {
            method:'GET',
            credentials: 'include',
            withCredentials:true
        });
        const responseData = await response.json();
        setFeed(responseData);
    }

    return (
        <div id="homePage">
            {/* <img src={`${process.env.REACT_APP_API_URL}/users/${user._id}/posts/1/image`} alt="testimage"/> */}
            <form id="WhatsOnYourMind" encType="multipart/form-data" onSubmit={handlePostSubmit}>
                <TextField variant="standard" multiline placeholder="What's on your mind?"
                rows={4}
                sx={{
                    width:'100%'
                }}
                value={postContent} onChange={e => setPostContent(e.target.value)} required/>
                <div id="WhatsOnYourMindButtons">
                    <Button variant="contained" color="primary" component="label"
                    sx={{
                        textTransform:"none"
                    }}>
                        Upload
                        <input hidden accept="image/*" type="file" id="postImage"/>
                    </Button>

                    <Button type="submit" variant="contained" color="primary"
                    sx={{
                        textTransform:"none",
                    }}>Post</Button>
                </div>
            </form>
            {
                feed.map((post) =>
                {
                    return <PostCard key={post._id} post ={post}/>
                })
            }

        </div>
    )
}

export default HomePage;