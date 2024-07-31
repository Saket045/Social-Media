import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createPost,deletePost,commentOnPost,likeUnlikePost
    ,getAllPosts,getLikedPosts,getFollowingPosts, 
    getUserPosts} from "../controllers/post.controllers.js";

const router=express.Router();

router.get("/getAllPosts",protectRoute,getAllPosts)
router.get("/getLikedPosts/:id",protectRoute,getLikedPosts)
router.get("/following",protectRoute,getFollowingPosts)
router.get("/userPosts/:username",protectRoute,getUserPosts)
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/:id", protectRoute, deletePost);

export default router;
