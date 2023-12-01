"use client";
import React, { useState } from "react";
import FollowerInfo from "./Followers";
import { useAuth } from "@/context/authContext";

const UserInfo = ({ username, bio, followers, following, numPosts }) => {
	const [followInfoVisibility, setFollowInfoVisibility] = useState(false);
	const [isFollower, setIsFollower] = useState(true);
    // const [currUser, setCurrUser] = useState(null);
    const { user } = useAuth();
    if(user) {
        console.log("logged in " + user.username)
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
			</div>
			<div className="grid grid-cols-3 gap-1"></div>
			<FollowerInfo
				isOpen={followInfoVisibility}
				onClose={colseFollowInfo}
				followersInfo={followers}
                followingInfo={following}
				isFollower={isFollower}
                currUser={user}
			/>
		</div>
	);
};

export default UserInfo;
