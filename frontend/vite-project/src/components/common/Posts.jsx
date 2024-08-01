import Post from "./Post";
import PostSkeleton from "../skeleton/PostSkeleton";
import {useQuery} from "@tanstack/react-query";
import { useEffect } from "react";
const Posts = ({feedType,userId,username}) => {
	const getPostEndPoint=()=>{
   switch(feedType){
	case 'forYou':
		return '/api/posts/getAllPosts';
		case 'following':
			return '/api/posts/following';
			case 'likes':
				return `/api/posts/getLikedPosts/${userId}`;
				case 'posts':
				return `/api/posts/userPosts/${username}`;
			default:
				return '/api/posts/getAllPosts';
   }}
   const POST_ENDPOINT=getPostEndPoint();

const {data:posts,isLoading,refetch,isRefetching}=useQuery({
	queryKey: ["posts"],
	queryFn: async () => {
		try {
			const response = await fetch(POST_ENDPOINT);
		const data=response.json();
		if(!response.ok)
			throw new Error(data.error || "Something went wrong");
		return data;
		} catch (error) {
			throw new Error(error);
		}
	}
})
useEffect(()=>{
  refetch();
},[feedType,refetch,username]);
	return (
		<>
			{isLoading || isRefetching && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;