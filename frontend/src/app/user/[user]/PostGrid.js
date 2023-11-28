const PostGrid = ({ posts }) => {
    if(!posts) {
        return (
            <div>This User has no posts yet</div>
        )
    }
  return (
    <div className="container mx-auto px-4 mt-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {posts.map((post, index) => (
          <div key={index} className="overflow-hidden rounded-lg">
            <img src={post.imageUrl} alt={post.caption} className="w-full h-auto object-cover" />
            <div className="p-2">
              <p className="text-sm text-gray-600">{post.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostGrid;
