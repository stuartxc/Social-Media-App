import { useState, useEffect } from "react";
import FollowButton from "../../../components/follow/FollowButton.js";
import { useAuth } from "@/context/authContext.js";
const getCurrUserFollowing = async () => {};
const FollowerInfo = ({ isOpen, onClose, followersInfo, followingInfo, isFollower, currUser }) => {
	const [followedAccounts, setFollowedAccounts] = useState([]);
	// const { user } = useAuth();

	useEffect(() => {
		if (currUser) {
			const encodedUsername = encodeURIComponent(currUser.username);
			fetch(`http://localhost:3000/following/${encodedUsername}`, {
				method: "GET",
				cache: "no-store",
			})
				.then((response) => response.json())
				.then((data) => {
                    const followedAccs = data.map((followPair) => followPair.following);
                    console.log(followedAccs)
					setFollowedAccounts(followedAccs);
					console.log(followedAccounts);
				})
				.catch((error) => console.error("Error:", error));
		}
	}, [currUser]);

	const handleFollowChange = (username, isNowFollowing) => {
		setFollowedAccounts((current) => {
			if (isNowFollowing) {
				return [...current, username];
			} else {
				return current.filter((acc) => acc !== username);
			}
		});
	};

	const visibility = isOpen ? "flex" : "hidden";
	const handleBackdropClick = (event) => {
		if (event.currentTarget === event.target) {
			onClose();
		}
	};
	// const existsFollowerPair = (follower) => {
	// 	let exists = false;
	// 	followingInfo.forEach((element) => {
	// 		if (element.following == follower) {
	// 			exists = true;
	// 		}
	// 	});
	// 	return exists;
	// };
	// const existsFollowingPair = (following) => {
	// 	let exists = false;
	// 	followersInfo.forEach((element) => {
	// 		if (element.follower == following) {
	// 			exists = true;
	// 		}
	// 	});
	// 	return exists;
	// };
	return (
		<div
			className={`${visibility} fixed inset-0 bg-black bg-opacity-50 justify-center items-center p-4 overflow-auto`}
			onClick={handleBackdropClick}
		>
			<div className="bg-white rounded-lg p-6 max-w-lg w-full">
				<button onClick={onClose} className="float-right font-bold">
					X
				</button>
				<h2 className="text-2xl font-bold mb-4">
					{isFollower ? "Followers" : "Following"}
				</h2>
				<ul>
					{isFollower
						? followersInfo.map((follower, index) => (
								<li key={index} className="flex items-center justify-between mb-2">
									<a href={`/user/${follower.follower}`}>{follower.follower}</a>
									<FollowButton
										followedAccounts={followedAccounts}
										currUser={currUser}
										targetUser={follower.follower}
										onFollowChange={handleFollowChange}
									/>
									{/* <button
										className={`px-4 py-2 rounded ${
											existsFollowerPair(follower.follower)
												? "bg-white text-black border-black border-2"
												: "bg-blue-500 text-white"
										}`}
									>
										{existsFollowerPair(follower.follower)
											? "Following"
											: "Follow"}
									</button> */}
								</li>
						  ))
						: followingInfo.map((following, index) => (
								<li key={index} className="flex items-center justify-between mb-2">
									<a href={`/user/${following.following}`}>
										{following.following}
									</a>
									<div>
										{existsFollowingPair(following.following)
											? "Also follows you"
											: "Does not follow you"}
									</div>
								</li>
						  ))}
				</ul>
			</div>
		</div>
	);
};
export default FollowerInfo;
