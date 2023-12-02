"use client";
import { useState, useEffect } from "react";
const Test = () => {
	const [h1, seth1] = useState("Hashtag1");
	const [h2, seth2] = useState("Hashtag2");
    const [amtPost, setAmtPost] = useState(4);
    const [divisionQueryResult, setDivisionResult] = useState([]);
    const [nestedAggGroupResult, setNestedAggGroupResult] = useState([]);
    const [aggHavingQueryResult, setAggHavingQueryResult] = useState([]);
	const divisionQuery = () => {
		// all posts that contain these hashtags
		fetch(`http://localhost:3000/hashtag?h1=${h1}&h2=${h2}`, {
			method: "get",
			cache: "no-store",
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
                setDivisionResult(data);
			})
			.catch((error) => console.error("Error:", error));
	};
	const nestedAggGroupQuery = () => {
		//avg per pse
		fetch(`http://localhost:3000/hashtag?type=avgPerPost`, {
			method: "get",
			cache: "no-store",
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
                setNestedAggGroupResult(data);
			})
			.catch((error) => console.error("Error:", error));
	};

	const aggHavingQuery = () => {
		fetch(`http://localhost:3000/account?numPosts=${amtPost}`, {
			method: "get",
			cache: "no-store",
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
                setAggHavingQueryResult(data);
			})
			.catch((error) => console.error("Error:", error));

		// avg number of posts per acc >
	};

    useEffect(() => {
        console.log(divisionQueryResult + "asdgkusaghdksuadgkuysa")
    }, [divisionQueryResult])

	//     SELECT AVG(hashtag_count) as avg_hashtags_per_post
	// FROM (
	//     SELECT postID, COUNT(hashTag) as hashtag_count
	//     FROM associateHashtag
	//     GROUP BY postID
	// ) as hashtag_counts;

	return (
		<div>
			<div className="border-black border-2 px-2 m-10">
				DIVISION, all posts that contain these hashtags
				<div>
					<label>
						Input One:
						<input type="text" value={h1} onChange={(event) => seth1(event.target.value)} />
					</label>
				</div>
				<div>
					<label>
						Input Two:
						<input type="text" value={h2} onChange={(event) => seth2(event.target.value)} />
					</label>
				</div>
				<button className="border-black border-2 px-2" onClick={divisionQuery}>
					Query
				</button>
                <div>
                    {divisionQueryResult.map((post) => (
                        <p>{post.postid}</p>
                    ))}
                </div>
			</div>
			<div className="border-black border-2 px-2 m-10">
				Nested Aggregation with GROUP BY, avg number of hashtags per post
				<button className="border-black border-2 px-2" onClick={nestedAggGroupQuery}>
					Query
				</button>
                <div>
                    {nestedAggGroupResult.map((res) => (
                        <p>{res.avg_hashtags_per_post}</p>
                    ))}
                </div>
			</div>
			<div className="border-black border-2 px-2 m-10">
				Aggregation with HAVING, users having number of posts
				{" SELECT createdBy FROM Post GROUP BY createdBy HAVING COUNT(postID) > 5;"}
                <div>
					<label>
						Input One enter natural number:
						<input type="number" value={amtPost} onChange={(event) => setAmtPost(event.target.value)} />
					</label>
				</div>
				<button className="border-black border-2 px-2" onClick={aggHavingQuery}>
					Query
				</button>
                <div>
                    {aggHavingQueryResult.map((user) => (
                        <p>{user.createdby}</p>
                    ))}
                </div>
			</div>
		</div>
	);
};

export default Test;
