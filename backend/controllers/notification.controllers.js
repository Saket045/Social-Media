import Notification from "../models/notification.model.js";

export const getNotifications = async (req,res) => {
	try {
		const userId = req.user._id;

		const notifications = await Notification.find({ to: userId }).populate({
			path: "from",
			select: "username profileImg",
		});

		await Notification.updateMany({ to: userId }, { read: true });

		res.status(200).json(notifications);
	} catch (error) {
		console.log("Error in getNotifications function", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
//1 get the authenticated user from req object.
//2 find all notifications in notification model where the to field is equal to the userId.
//3 now populate them as you replace the from field in each notification i.e. another user to username and profileimg
//4 update all notifiactions sent to userId and set read to true  

export const deleteNotifications = async (req, res) => {
	try {
		const userId = req.user._id;

		await Notification.deleteMany({ to: userId });

		res.status(200).json({ message: "Notifications deleted successfully" });
	} catch (error) {
		console.log("Error in deleteNotifications function", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
//1  get the authenticated user from req object.
//2  delete all noti. where to field is userid