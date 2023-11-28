import { notFound } from "next/navigation";
import UserInfo from "./UserInfo";
import PostGrid from "./PostGrid";
const getUser = async (id) => {
	try {
		const userRaw = await fetch(`http://localhost:3000/account/${id}`, {
			method: "GET",
            cache: "no-store"
		});
		const userJson = await userRaw.json();
		if (userJson.length != 1) {
			return null;
		} else {
			const user = userJson[0];
			return user;
		}
	} catch {
		return null;
	}
};

const getPostsByUser = async (username) => {
	try {
        const encodedUsername = encodeURIComponent(username);
		const postsRaw = await fetch(`http://localhost:3000/post?username=${encodedUsername}`, {
			method: "GET",
            cache: "no-store"
		});
        console.log("FETCHING POSTS")
		const posts = await postsRaw.json();
		if (posts.length == 0) {
			return null;
		} else {
			console.log(posts);
			return posts;
		}
	} catch {
		return null;
	}
};

const getFollowers = async (username) => {
    try {
        const encodedUsername = encodeURIComponent(username);
		const followersRaw = await fetch(`http://localhost:3000/followers/${encodedUsername}`, {
			method: "GET",
            cache: "no-store"
		});
		const followers = await followersRaw.json();
		if (followers.length == 0) {
			return [];
		} else {
			console.log(followers);
			return followers;
		}
	} catch {
		return [];
	}
}

const getFollowing = async (username) => {
    try {
        const encodedUsername = encodeURIComponent(username);
		const followingRaw = await fetch(`http://localhost:3000/following/${encodedUsername}`, {
			method: "GET",
            cache: "no-store"
		});
		const following = await followingRaw.json();
		if (following.length == 0) {
			return [];
		} else {
			console.log(following);
			return following;
		}
	} catch {
		return [];
	}
}

const User = async ({ params }) => {
	const user = await getUser(params.user);

	if (!user) {
		return <div>ERROR 404 USER NOT FOUND</div>;
	} else {
		const posts = await getPostsByUser(user.username);
        const followers = await getFollowers(user.username);
        const following = await getFollowing(user.username);
		return (
			<div>
				{params.user}
				<div>{user.username}</div>
				<UserInfo
					username={user.username}
					bio={"test"}
					followers={followers}
					following={following}
					numPosts={posts.length}
				/>
				<PostGrid posts={posts} />
			</div>
		);
	}
};

export default User;
