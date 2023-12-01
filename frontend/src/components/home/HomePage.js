"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import PostBody from "../posts/PostBody";
const HomePage = () => {
	const { user } = useAuth();
	if (user) {
		console.log(user);
	}
	const [posts, setPosts] = useState([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [limit, setLimit] = useState(3);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		console.log(page);
		if (user) {
			fetchPosts(page);
		} else {
			setLoading(false);
		}
	}, [page, user]);

	const fetchPosts = () => {
		// setLoading(true);
		fetch(`http://localhost:3000/post/feed/${user.username}?page=${page}&limit=${limit}`, {
			method: "get",
			cache: "no-store",
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				setPosts((prevPosts) => [...prevPosts, ...data]);
				setHasMore(data.length >= limit);
				setLoading(false);
				console.log(posts);
			})
			.catch((error) => console.error("Error:", error));
	};

	useEffect(() => {
		console.log(posts);
	}, [posts]);

	// useEffect(() => {
	// 	if (user) {
	// 		const encodedUsername = encodeURIComponent(user.username);
	// 		fetch(`http://localhost:3000/following/${encodedUsername}`, {
	// 			method: "GET",
	// 			cache: "no-store",
	// 		})
	// 			.then((response) => response.json())
	// 			.then((data) => {
	// 				const followedAccs = data.map((followPair) => followPair.following);
	// 				console.log(followedAccs);
	// 				setFollowedAccounts(followedAccs);
	// 				console.log(followedAccounts);
	// 			})
	// 			.catch((error) => console.error("Error:", error));
	// 	}
	// }, [user]);

	// useEffect(() => {
	// 	const handleScroll = () => {
	// 		if (
	// 			window.innerHeight + document.documentElement.scrollTop !==
	// 				document.documentElement.offsetHeight ||
	// 			!hasMore
	// 		) {
	// 			console.log("scrolling");
	// 			return;
	// 		}

	// 		setPage((prevPage) => prevPage + 1);
	// 	};

	// 	window.addEventListener("scroll", handleScroll);
	// 	return () => window.removeEventListener("scroll", handleScroll);
	// }, [hasMore]);
	const incrementpage = () => {
		setPage((page) => page + 1);
	};

    // ? <></> : <div>Log IN or sign up to get started!</div>}
	return (
		<div className="flex flex-col justify-center items-center m-auto">
			{loading ? "loading" : user ? "" : <div>Sign up or log in to get started!</div>}
            
            
            
			<div className="m-10" style={{ display: !loading ? 'block' : 'none' }}>
				{posts.map((post) => (
					<PostBody post={post} />
				))}
			</div>
			<button
				className="border-black border-2 w-auto h-10 m-4 px-2"
				disabled={!hasMore}
				onClick={incrementpage}
			>
				{hasMore ? `Load More ` : `No more posts to load`}
			</button>
		</div>
	);
};

export default HomePage;
