import { Suspense } from "react";
import PostContent from "./PostContent";
import PostBody from "./PostBody";

const getPostById = async (id) => {
	try {
		const postsRaw = await fetch(`http://localhost:3000/post?postId=${id}`, {
			method: "GET",
			cache: "no-store",
		});
		console.log("FETCHING POSTS");
		const posts = await postsRaw.json();
		if (posts.length != 1) {
			return [];
		} else {
			console.log(posts);
			return posts[0];
		}
	} catch {
		return [];
	}
};

const getCommentsByPost = async () => {};

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


const fetchPostContent = async (id, type) => {
	try {
		const postsContentRaw = await fetch(
			`http://localhost:3000/post/content?type=${type}&postId=${id}`,
			{
				method: "GET",
				cache: "no-store",
			}
		);
		const content = await postsContentRaw.json();
		return content;
	} catch {
		return [];
	}
	// TODO
	// if (id == 0) {

	// } else if (id == 1) {

	// } else if (id == 2) {

	// } else {
	//     return null;
	// }
};

const Post = async ({ id }) => {
	const post = await getPostById(id);

	if (post.length == 0) {
		return <div>ERROR 404 POST NOT FOUND</div>;
	} else {
		// const renderPostBody = () => {
		// 	return (
		// 		<Suspense fallback={loading}>
		// 			<PostContent postId={id} type={post.type} />
		// 		</Suspense>
		// 	);
		// };

		const postContent = await fetchPostContent(id, post.type);
		const likes = await getLikes(id);

		return <PostBody post={post} />;
	}
};

export default Post;
