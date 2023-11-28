import PostHome from "./Post";

const Post = () => {
    return (
        <div className="justify-center items-center flex h-screen">
            <div className="border border-gray-300 p-6 bg-white rounded-md max-w-md mx-auto">
                <div className="text-lg font-semibold mb-4 text-center">Create, delete, and view posts</div>
                <PostHome />
            </div>
        </div>
    );
}

export default Post