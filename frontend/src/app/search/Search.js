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
    const [advertisement, setAdvertisement] = useState(null);
    const [postTime, setPostTime] = useState("");
    const [username, setUsername] = useState("");
    const [accountTime, setAccountTime] = useState("");
    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);
	const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const trySearchPost = async () => {
		// const body = {
		// 				postId: postId, caption: caption, createdBy: createdBy, type: type, advertisement: advertisement,
		// 				postTime: postTime, username: username, accountTime: accountTime, following: following, followers: followers
		// 			}

		var searchUrl = `${SEARCH_URL}/post?`
		if (postId != "") {
			searchUrl += `postId=${postId}&`
		} if (caption != "") {
			searchUrl += `caption=${caption}&`
		} if (createdBy != "") {
			searchUrl += `createdBy=${createdBy}&`
		} if (type != "") {
			searchUrl += `type=${type}&`
		} if (advertisement !== null) {
			searchUrl += `advertisement=${advertisement}&`
		} if (postTime != "") {
			searchUrl += `postTime=${postTime}`
		}

		console.log(searchUrl);
					
        const response =  await fetch(searchUrl, {
			method: "get",
			cache: "no-store",
		});

        return response;
    };

    const handleSubmit = (e) => {
		console.log("submit");
        e.preventDefault();
        setErrorMessage("");
		setSuccessMessage("");
        setIsLoading(true);

		if (postId == "" && caption == "" && createdBy == "" && type == "" && advertisement == "" && postTime == "") {
			setErrorMessage("Please enter an input for at least one field.");
            setIsLoading(false);
            return;
		}

		const data = trySearchPost();
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
			handleErrors(error.statusText);
		});
		setIsLoading(false);
    };

	const handleErrors = (errorText) => {
		if (errorText == "Not Found") {
			setErrorMessage("No such posts exist.");
		} else {
			setErrorMessage(errorText);
		}
	}

    return (
		<div id="bigDiv">
		
        <div className="mx-auto max-w-md p-6"> Search for posts:
			<br/>
			<br/>
            <form className="flex flex-col space-y-4">
				<label for="postId">Post ID:</label>
                <input
                    type="text"
					id="postId"
                    placeholder="1"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    value={postId}
                    onChange={(e) => setPostId(e.target.value)}
                />
				<label for="caption">Post caption</label>
                <input
                    type="text"
					id="caption"
                    placeholder="This is caption 1"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                />
				<label for="creator">Post creator:</label>
				<input
                    type="text"
					id="createdBy"
                    placeholder="user1"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    value={createdBy}
                    onChange={(e) => setCreatedBy(e.target.value)}
                />
				<label for="type">Post type (0 = Text, 1 = Image, or 2 = Video)</label>
				<input
                    type="number"
					id="type"
					min={0}
					max={2}
                    placeholder="0"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                />
				<label for="postTime">Time created (Format: YYYY-MM-DD HH:MM:SS:ms)</label>
				<input
                    type="text"
					id="postTime"
                    placeholder="2023-10-10 00:00:00.000"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    value={postTime}
                    onChange={(e) => setPostTime(e.target.value)}
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
			{successMessage && <div className="text-blue-500">{successMessage}</div>}
        </div>
		{/* <div className="mx-auto max-w-md p-6"> UNIMPLEMENTED USER SEARCH AREA
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
		</div> */}
		</div>
    );
};

export default Search;
