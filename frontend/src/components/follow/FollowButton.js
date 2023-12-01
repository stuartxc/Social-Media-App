"use client";

const FollowButton = ({ followedAccounts, currUser, targetUser, onFollowChange }) => {
	const isFollowing = followedAccounts.includes(targetUser);

	const toggleFollow = () => {
		if (currUser) {
			const method = isFollowing ? "DELETE" : "POST";
			const url = isFollowing
				? `http://localhost:3000/unfollow/${currUser.username}/${targetUser}`
				: `http://localhost:3000/follow/${currUser.username}/${targetUser}`;

			fetch(url, { method })
				.then((response) => response.json())
				.then(() => {
					onFollowChange(targetUser, !isFollowing);
				})
				.catch((error) => console.error("Error:", error));
		}
	};

	return (
		// <button
		//   onClick={toggleFollow}
		//   style={{ backgroundColor: isFollowing ? 'white' : 'blue', color: isFollowing ? 'black' : 'white' }}
		// >
		//   {isFollowing ? 'Unfollow' : 'Follow'}
		// </button>
		<button
			onClick={toggleFollow}
			className={`px-4 py-2 rounded ${
				isFollowing ? "bg-white text-black border-black border-2" : "bg-blue-500 text-white  border-white border-2"
			}`}
		>
			{isFollowing ? "Following" : "Follow"}
		</button>
	);
};

export default FollowButton;
