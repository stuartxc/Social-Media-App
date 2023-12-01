"use client";

import { useState, useEffect } from "react";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
// const BACKEND_URL = "http://localhost:3000";
const SEARCH_URL = `${BACKEND_URL}/search`;

const Search = () => {
	const [postId, setPostId] = useState("");
    const [caption, setCaption] = useState("");
    const [createdBy, setCreatedBy] = useState("");
    const [type, setType] = useState("");
    const [advertisement, setAdvertisement] = useState("");
    const [postTime, setPostTime] = useState("");
    const [username, setUsername] = useState("");
    const [accountTime, setAccountTime] = useState("");
    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);
	const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const trySearch = async () => {
		// const body = {
		// 				postId: postId, caption: caption, createdBy: createdBy, type: type, advertisement: advertisement,
		// 				postTime: postTime, username: username, accountTime: accountTime, following: following, followers: followers
		// 			}

        const response =  await fetch(`http://localhost:3000/search/postId=${postId}caption=${caption}createdBy=${createdBy}
										type=${type}advertisement=${advertisement}postTime=${postTime}username=${username}
										accountTime=${accountTime}following=${following}followers=${followers}`, {
			method: "get",
			cache: "no-store",
		});

        const data = await response.json();

        if (response.ok) {
            return data;
        }

        throw new Error(data.message);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");
		setSuccessMessage("");
        setIsLoading(true);

		const data = trySearch();
		data.then((response) => {
			if (response.ok) {
				return response.json();
			}
			return Promise.reject(response);
		}).then((result) => {
			console.log(result);
			setSuccessMessage("Success! Please view the data:");
		})
		.catch((error) => {
			console.log(error);
			setErrorMessage(error.statusText);
		});
		setIsLoading(false);
    };

    return (
        <div className="mx-auto max-w-md p-6">
            <form className="flex flex-col space-y-4">
                <input
                    type="text"
                    placeholder="postId"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    value={postId}
                    onChange={(e) => setPostId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="caption"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                />
				<input
                    type="text"
                    placeholder="createdBy"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    value={createdBy}
                    onChange={(e) => setCreatedBy(e.target.value)}
                />
				<input
                    type="text"
                    placeholder="type"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                />
				<input
                    type="text"
                    placeholder="advertisement"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    value={advertisement}
                    onChange={(e) => setAdvertisement(e.target.value)}
                />
				<input
                    type="text"
                    placeholder="postTime"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    value={postTime}
                    onChange={(e) => setPostTime(e.target.value)}
                />
				<input
                    type="text"
                    placeholder="username"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
				<input
                    type="text"
                    placeholder="accountTime"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    value={accountTime}
                    onChange={(e) => setAccountTime(e.target.value)}
                />
				<input
                    type="text"
                    placeholder="following"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    value={following}
                    onChange={(e) => setFollowing(e.target.value)}
                />
				<input
                    type="text"
                    placeholder="followers"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    value={followers}
                    onChange={(e) => setFollowers(e.target.value)}
                />
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    {isLoading ? "Loading..." : "Begin Search"}
                </button>
            </form>
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        </div>
    );
};

export default Search;
