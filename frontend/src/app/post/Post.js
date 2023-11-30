"use client";

import { useState, useEffect } from "react";
import CreatePost from "./CreatePost.js";
import DeletePost from "./DeletePost.js";
import ViewPosts from "./ViewPosts.js";

// const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
// const POST_URL = `${BACKEND_URL}/post`;

const PostHome = () => {
	const [create, toggleCreate] = useState(false);
    const [deleteP, toggleDelete] = useState(false);
    const [view, toggleView] = useState(false);

	const showCreate = (e) => {
        e.preventDefault();

        toggleCreate(true);
		toggleDelete(false);
		toggleView(false);
    };

	const showDelete = (e) => {
        e.preventDefault();

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

    return (
        <div className="postHome">
			<button
                    type="create"
                    onClick={showCreate}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
			>Create A Post</button>
			<button
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
        </div>
    );
};

export default PostHome;
