"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";

const getLikes = async (id) => {
	try {
		const postsRaw = await fetch(`http://localhost:3000/likes/${id}`, {
			method: "GET",
			cache: "no-store",
		});
		const likes = await postsRaw.json();
		return likes;
	} catch {
		return 0;
	}
};

const LikeButton = ({ post }) => {
	const [liked, setLiked] = useState(false);
	const [likes, setLikes] = useState([]);
	const [isLoggedIn, setLogin] = useState(false);
	const router = useRouter();
	const likePost = async () => {
		if (!isLoggedIn || !user) {
			router.push("/authentication");
		} else {
			try {
				const pid = post.postid;
				if (liked) {
					console.log(pid);
					const postsContentRaw = await fetch(
						`http://localhost:3000/likes/${pid}/${user.username}`,
						{
							method: "DELETE",
							cache: "no-store",
						}
					);
					const content = await postsContentRaw.json();
					setLiked(false);
					return content;
				} else {
					console.log("POST " + pid);
					const postsContentRaw = await fetch(
						`http://localhost:3000/likes/${pid}/${user.username}`,
						{
							method: "POST",
							cache: "no-store",
						}
					);
					const content = await postsContentRaw.json();
					setLiked(true);
					return content;
				}
			} catch {
				console.log("error");
			}
		}
	};

	const userLiked = (user) => {
		let l = false;
		likes.forEach((element) => {
			if (element.acc == user.username) {
				console.log(element);
				console.log("USER HAS LIKED POST");
				l = true;
			}
		});
		// console.log("USER HAS NOT LIKED POST")
		return l;
	};
	const { user } = useAuth();
	useEffect(() => {
		console.log("useEffect");
		const token = localStorage.getItem("token");
		if (token) {
			setLogin(true);
		}
		const likesData = getLikes(post.postid);
		likesData.then((result) => {
			setLikes(result);
		});
	}, []);
	useEffect(() => {
		console.log("RESULT");
		if (user) {
			console.log("RESULT22");
			if (userLiked(user)) {
				setLiked(true);
			} else {
				setLiked(false);
			}
		}
	}, [likes]);
	useEffect(() => {
		const likesData = getLikes(post.postid);
		likesData.then((result) => {
			setLikes(result);
		});
	}, [liked]);

	return (
		<button
			className={
				liked
					? "bg-red-500 text-white px-1 border-2 border-white"
					: "bg-white border-2 border-black text-black px-1"
			}
			onClick={likePost}
		>
			Likes: {likes.length}
		</button>
	);
};

export default LikeButton;
