"use client";

import "./Post.css";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import CreatePost from "./CreatePost.js";
import DeletePost from "./DeletePost.js";
import ViewPosts from "./ViewPosts.js";

// const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
// const POST_URL = `${BACKEND_URL}/post`;

const PostHome = () => {
	const { user } = useAuth();
	const [create, toggleCreate] = useState(false);
    const [deleteP, toggleDelete] = useState(false);
    const [view, toggleView] = useState(false);
	const [createIsFlashing, setCIsFlashing] = useState(false);
	const [deleteIsFlashing, setDIsFlashing] = useState(false);


	const showCreate = (e) => {
        e.preventDefault();
		if (!user) {
			console.error("User must be logged in to create posts");
			setCIsFlashing(true);
			setTimeout(() => {
				setCIsFlashing(false);
			}, 2000);
			return;
		}
        toggleCreate(true);
		toggleDelete(false);
		toggleView(false);
    };

	const showDelete = (e) => {
        e.preventDefault();
		if (!user) {
			console.error("User must be logged in to delete posts");
			setDIsFlashing(true);
			setTimeout(() => {
				setDIsFlashing(false);
			}, 2000);
			return;
		}
        toggleCreate(false);
		toggleDelete(true);
		toggleView(false);
    };

	const showView = (e) => {
        e.preventDefault();

        toggleCreate(false);
		toggleDelete(false);
		toggleView(true);
    };

	const styles = {
		isFlashing: {
		  fontSize: "18px",
		  color: "#292b2c",
		  backgroundColor: "#123",
		  padding: "0 20px"
		}
	  }

    return (
        <div className="postHome">
		
			<button style={createIsFlashing ? styles.flashing : null} // flashing stuff doesn't work yet
                    type="create"
                    onClick={showCreate}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
			>Create A Post</button>
			<button style={deleteIsFlashing ? styles.flashing : null}
                    type="delete"
                    onClick={showDelete}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
			>Delete A Post</button>
			<button
                    type="view"
                    onClick={showView}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
			>View All Posts</button>
			<div>
				{create ? <CreatePost/> : deleteP ? <DeletePost/> : view ? <ViewPosts/> : null}
			</div>
			{user ? null : <h2 id="logged-in-msg">You must be logged in to create or delete posts.</h2>}
        </div>
    );
};

export default PostHome;
