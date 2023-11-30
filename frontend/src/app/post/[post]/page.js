import Post from "../../../components/posts/Post";

const PostPage = async ({ params }) => {
	return (
		<div>
			<Post id={params.post} />
		</div>
	);
};

export default PostPage;
