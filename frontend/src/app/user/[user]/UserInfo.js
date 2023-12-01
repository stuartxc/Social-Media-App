"use client";
import React, { useState, useEffect } from "react";
import FollowerInfo from "./Followers";
import { useAuth } from "@/context/AuthContext.js";
import FollowButton from "@/components/follow/FollowButton";

const UserInfo = ({ username, bio, followers, following, numPosts }) => {
	const [followInfoVisibility, setFollowInfoVisibility] = useState(false);
	const [isFollower, setIsFollower] = useState(true);
	// const [currUser, setCurrUser] = useState(null);
	const { user } = useAuth();
	if (user) {
		console.log("logged in " + user.username);
		// setCurrUser(user);
	}
	const openFollowers = () => {
		setFollowInfoVisibility(true);
		setIsFollower(true);
	};
	const openFollowing = () => {
		setFollowInfoVisibility(true);
		setIsFollower(false);
	};
	const colseFollowInfo = () => setFollowInfoVisibility(false);

	const [followedAccounts, setFollowedAccounts] = useState([]);
	// const { user } = useAuth();

	useEffect(() => {
		if (user) {
			const encodedUsername = encodeURIComponent(user.username);
			fetch(`http://localhost:3000/following/${encodedUsername}`, {
				method: "GET",
				cache: "no-store",
			})
				.then((response) => response.json())
				.then((data) => {
					const followedAccs = data.map((followPair) => followPair.following);
					console.log(followedAccs);
					setFollowedAccounts(followedAccs);
					console.log(followedAccounts);
				})
				.catch((error) => console.error("Error:", error));
		}
	}, [user]);

	const handleFollowChange = (username, isNowFollowing) => {
		setFollowedAccounts((current) => {
			if (isNowFollowing) {
				return [...current, username];
			} else {
				return current.filter((acc) => acc !== username);
			}
		});
	};

	return (
		<div className="max-w-screen-md mx-auto">
			<div className="flex items-center p-4">
				<div className="w-20 h-20 mr-4 rounded-full bg-gray-300"></div>{" "}
				<div className="flex flex-col flex-grow">
					<div className="flex justify-between items-center">
						<h2 className="text-4xl font-bold">{username}</h2>
						<div className="flex space-x-6 text-xl">
							<button className="text-center" onClick={openFollowers}>
								<span className="font-bold">{followers.length}</span> followers
							</button>
							<button className="text-center" onClick={openFollowing}>
								<span className="font-bold">{following.length}</span> following
							</button>
							<div className="text-center">
								<span className="font-bold">{numPosts}</span> posts
							</div>
						</div>
					</div>
					<p>{bio}</p>
				</div>
                <FollowButton
					followedAccounts={followedAccounts}
					currUser={user}
					targetUser={username}
					onFollowChange={handleFollowChange}
				/>
			</div>
			<div className="grid grid-cols-3 gap-1"></div>
			<FollowerInfo
				isOpen={followInfoVisibility}
				onClose={colseFollowInfo}
				followersInfo={followers}
				followingInfo={following}
				isFollower={isFollower}
				currUser={user}
                followedAccounts={followedAccounts}
                setFollowedAccounts={followedAccounts}
                handleFollowChange={handleFollowChange}
			/>
		</div>
	);
};

export default UserInfo;
