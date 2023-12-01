"use client";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/Dropdown';
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
// const BACKEND_URL = "http://localhost:3000";
const POST_URL = `${BACKEND_URL}/post`;

const CreatePost = () => {
	const { user } = useAuth();
	const [caption, setCaption] = useState("");
    const [type, setType] = useState("");
	const [file, setFile] = useState(null);
	const [imageUrl, setImageUrl] = useState("");
	const [advertisement, setAdvertisement] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const tryCreate = async () => {
		// const blob = new Blob([file]);
		// const formData = new FormData();
    	// formData.append("caption", caption);
    	// formData.append("type", type);
		// formData.append("file", blob);
    	// formData.append("advertisement", advertisement);
		let body = {caption: caption, type: type, file: file, advertisement: advertisement};
		console.log(body)
		// console.log(formData)
        const response = await fetch(POST_URL, {
            method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`
			},
            body: JSON.stringify(body)
        });

        return response;
    };

    const handleSubmit = (e) => {
		while(isLoading);
        e.preventDefault();
        setErrorMessage("");
        setIsLoading(true);

        if (!caption || type === null) {
            setErrorMessage("Caption and type are required");
            setIsLoading(false);
            return;
        }

		if (type === "1" && file === null){
			setErrorMessage("Image is required for an image post");
			console.log("file is null")
            setIsLoading(false);
            return;
		}

		if (type === "2" && file === null){
			setErrorMessage("Video is required for a video post");
            setIsLoading(false);
            return;
		}

		if (!user) {
			setErrorMessage("User must be logged in to create a post");
			setIsLoading(false);
			return;
		}
		const data = tryCreate();
		data.then((response) => {
			if (response.ok) {
				return response.json();
			}
			return Promise.reject(response);
		}).then((result) => {
			console.log(result);
			setSuccessMessage("Successfully added post to database.");
		})
		.catch((error) => {
			console.log(error);
			setErrorMessage(error.statusText);
		});
		setIsLoading(false);
    };

	const readImage = (event) => {
		console.log("hello" + event.target.files[0]);
		const newFile = event.target.files[0];
		setIsLoading(true);
		if (newFile) {
			console.log("attempt to read the image");
			const urlReader = new FileReader();
			urlReader.onloadend = () => {
				console.log("loadEnd");
				// const newBlob = new Blob([reader.result], {type: newFile.type});
				// setFile(newBlob);
				setImageUrl(urlReader.result)
			};
			urlReader.readAsDataURL(newFile);

			const reader = new FileReader();
			reader.onload = function() {
				var arrayBuffer = new Uint8Array(reader.result);
				console.log(arrayBuffer);
				setFile(arrayBuffer);
				setIsLoading(false);
			};
			reader.readAsArrayBuffer(newFile); 
		}
	}
	const sampleImage = (e) => {
		console.log("hello" + e.target.files[0]);
		// setFile(e.target.files[0]);
	}

    return (
        <div className="mx-auto max-w-md p-6">
            <form id="createForm" className="flex flex-col space-y-4">
                <input
                    type="text"
                    placeholder="caption"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                />
                <label for="type">Type of post: {type === 0 ? "Text post" : type === 1 ? "Image post" : type === 2 ? "Video post" : null}</label>
				<input
					id="type"
                    type="number"
                    placeholder="0, 1, or 2 (text, image, or video post)"
                    className="px-4 py-2 border border-gray-300 rounded-md"
					min={0}
					max={2}
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                />
				<label for="advertisement">Is this post an advertisement:</label>
				<select 
					id="advertisement" 
					value={advertisement} 
					form="createForm"
					onChange={(e) => e.target.value === "No" ? setAdvertisement(false) : setAdvertisement(true)}
				> <option value="">--Please choose an option--</option>
					<option value="no">No</option>
					<option value="yes">Yes</option>
				</select>
				{type == 1 ? <div>
					<label for="myImage">Select an image:</label>
					<input
					id="myImage"
                    type="file"
                    placeholder="select an image"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    value={file}
					accept=".jpg, .jpeg, .png"
                    onChange={(e) => {
						// console.log(e.target.files[0]);
						readImage(e);
					}}
                	></input>
					{imageUrl && (
						<div> <img alt="not found" height={"150px"} src={imageUrl}/> <br />
						<button 
						className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
						onClick={() => {
							setImageUrl("");
							setFile(null);
						}}>Remove</button>
						</div>
					)}
				</div> : null}
				{type == 2 ? <div>
					<label for="myVideo">Select a video:</label>
					<input
					id="myVideo"
                    type="file"
                    placeholder="select a video"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    value={file}
                    onChange={(e) => setFile(e.target.value)}
                	></input>
				</div> : null}
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    {isLoading ? "Loading..." : "Submit"}
                </button>
            </form>
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        </div>
    );
};

export default CreatePost;
