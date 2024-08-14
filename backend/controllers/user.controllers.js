import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from 'bcryptjs'
export const getUserProfile = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username }).select("-password");
		if (!user) return res.status(404).json({ message: "User not found" });
		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getUserProfile: ", error.message);
		res.status(500).json({ error: error.message });
	}
};
//1 Client will pass username of the clicked user in the url i.e. incoming request for the server.
//2 We ll store the username of the incominng request and 
//3 find the user in the database according to it.
//4 if user found then show
export const followUnfollowUser=async (req,res)=>{
    try {
		const { id } = req.params;
		const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);

		if (id === req.user._id.toString()) {
			return res.status(400).json({ error: "You can't follow/unfollow yourself" });
		}

		if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			// Unfollow the user
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

			res.status(200).json({ message: "User unfollowed successfully" });
		} else {
			// Follow the user
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
			// Send notification to the user
			const newNotification=new Notification({
				type:"follow",
				from:req.user._id,
				to:userToModify._id,
			});
			await newNotification.save();
			res.status(200).json({ message: "User followed successfully" });
		}  }
  catch (error) {
    res.status(500).json({"msg":"Internal Server Error"});
  }// $pull , findByIdAndUpdate , req.user._id
};
//1 The user will click on the user and the clicked user's id  will be passed in the url
//2 now we will get that id from params of incoming request.
//3 now we will find the user in the database according to this id
//4 we will also get the current user by using re.user._id object
//5 now we will check if req.user._id === paramsid then we cannot follow ourselves
//6 now we will check if currentuser's following array includes the paramsid ,if it does then unfollow
//7 to unfollow, we will pull currentuser id from followers array of paramsuser and pull paramsuser from following array of current user
//8 if it does not then follow the user
//9 to follow push current user in following of paramsuser array and push paramsuser in currentuser following array
//10 now make a notification object using notification model and set type to follow and from current user and to paramsuser
export const getSuggestedUsers=async(req,res)=>{
	try{
        const userId=req.user._id;
		const usersFollowedByMe=await User.findById(userId).select("following");
            
		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{ $sample: { size: 10 } },
		]);

		// 1,2,3,4,5,6,
		const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id));
		const suggestedUsers = filteredUsers.slice(0, 4);

		suggestedUsers.forEach((user) => (user.password = null));

		res.status(200).json(suggestedUsers);
		}
	catch(error){
		res.status(500).json({"msg":"Internal Server Error"});
	}
}
//1 get user id of the current  user by req,user object
//2 get all the users that the current user is following
//3 now get a number of random users after filtering out the current user from the User model
//4 the filtered users will be the users that the that are not followed by current user
//5 now slice a number of users for suggestion
export const updateUser = async (req, res) => {
	const { fullname, email, username, currentPassword, newPassword, bio, link } = req.body;
	let { profileImg, coverImg } = req.body;

	const userId = req.user._id;

	try {
		let user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
			return res.status(400).json({ error: "Please provide both current password and new password" });
		}

		if (currentPassword && newPassword) {
			const isMatch = await bcrypt.compare(currentPassword, user.password);
			if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });
			if (newPassword.length < 6) {
				return res.status(400).json({ error: "Password must be at least 6 characters long" });
			}

			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(newPassword, salt);
		}

		if (profileImg) {
			if (user.profileImg) {
				// https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
				await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profileImg);
			profileImg = uploadedResponse.secure_url;
		}

		if (coverImg) {
			if (user.coverImg) {
				await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(coverImg);
			coverImg = uploadedResponse.secure_url;
		}

		user.fullname = fullname || user.fullname;
		user.email = email || user.email;
		user.username = username || user.username;
		user.bio = bio || user.bio;
		user.link = link || user.link;
		user.profileImg = profileImg || user.profileImg;
		user.coverImg = coverImg || user.coverImg;

		user = await user.save();

		// password should be null in response
		user.password = null;

		return res.status(200).json(user);
	} catch (error) {
		console.log("Error in updateUser: ", error.message);
		res.status(500).json({ error: error.message });
	}
};
//0 check if the user is present or not by getting the user from the User model on the basis of req.user._id
//1 get all the fields from the req.body
//2 check if both current and new password are present
//3 check if the current password is correct
//4 now hash the new password using bcrypt
//5 if profileimg is input then destroy previous image from cloudinary
//6 upload the profileimg in cloudinary
//7 set the secure url of the uploaded image to profile image
//8 if coverimg is input then destroy previous image from cloudinary
//9 upload the coverimg in cloudinary
//10 set the secure url of the uploaded image to cover image
//11 now update the user fiels with update fields, if changed then update other keep it same 