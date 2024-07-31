import mongoose from "mongoose";

const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
     profileImg:{
        type:String,
        default:""
     },
     coverImg:{
        type:String,
        default:""
     },
     link:{
        type:String,
        default:""
     },
     bio:{
        type:String,
        default:""
     },
     likedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: [],
        },
    ],
},{timestamps:true}
);

const User=mongoose.model('User',userSchema);
export default User;