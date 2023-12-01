"use client";
import { Suspense, useEffect, useState } from "react";
import PostContent from "./PostContent";
import { useRouter } from "next/navigation";

import LikeButton from "./LikeButton";

const PostBody = ({ post }) => {
	const loading = <div> LOADING ... </div>;

    const openComments = () => {};
    let content;
	if (post.type == 0) {
		content = (
			<Suspense>
				<div>{post.content}</div>
			</Suspense>
		);
	} else {
		content = <div>CURRENTLY NOT SUPPORTED</div>;
	}

	return (
		<div className="flex justify-center items-center">
			<div
				className="border border-gray-200 p-4 m-auto mt-10 flex flex-col justify-between"
				style={{ width: "600px", maxheight: "800px", overflow: "auto" }}
			>
				<div>
					<div className="flex items-center">
						<img className="w-10 h-10 rounded-full mr-2" alt={post.username} />
						<a href={`/user/${post.createdby}`} className="font-bold">
							{post.createdby}
						</a>
					</div>
					<p className="my-2">{post.caption}</p>
					<div>
						{/* {post.hashtags.map((tag, index) => (
							<span key={index} className="text-blue-500 mr-1">
								#{tag}
							</span>
						))} */}
					</div>
				</div>

				<div className="my-2">{content}</div>
				<div>
					<div className="text-gray-600 text-sm">
						{new Date(post.timestamp).toLocaleString()}
					</div>
					<div className="flex items-center justify-between mt-2">
						<LikeButton post={post}/>
						<span>Bookmarks: 0</span>
						<span>Shares: {post.shares}</span>
						<span onClick={openComments}>Comments: {post.comments}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostBody;
