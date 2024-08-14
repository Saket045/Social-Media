import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

export const signup= async(req,res) =>{
   const { fullname,username,email,password}=req.body;
   try{
    const existingUser = await User.findOne({username})
    if(existingUser) return res.status(400).json({message:"Username is taken"})

    const existingEmail = await User.findOne({email})
    if(existingEmail) return res.status(400).json({message:"Email already registered"})
  
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

    const newUser =new User({
        fullname,
        username,
        email,
        password:hashedPassword,
    })
    if(newUser){
        generateTokenAndSetCookie(newUser._id,res);
        await newUser.save();

        res.status(201).json({
            _id:newUser._id,
            fullname:newUser.fullname,
            username:newUser.username,
            email:newUser.email,
            followers:newUser.followers,
            following:newUser.following,
            profileImg:newUser.profileImg,
            coverImg:newUser.coverImg,
        })
    }
  else{
       res.status(400).json({message:"Invalid user data"})
  }
    }
   catch(error){
    return res.status(500).json({message:error.message})
   }
}
//1 get the fields from the req object i.e. incoming request
//2 check if the account exists by checking username and email....(User.findOne({field to be compared in model}))
//3 generate salt through bcrypt
//4 hash the password
//5 create new user with the fields you got
//6 if newUser created ,generate token for every unique user i.e. according to newUser._id 
//7 now save the user
export const login= async(req,res) =>{
    try{
        const { username, password } = req.body;
		const user = await User.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}
		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			email: user.email,
			followers: user.followers,
			following: user.following,
			profileImg: user.profileImg,
			coverImg: user.coverImg,
        });
    }
    catch(error){
        return res.status(500).json({message:error.message})
       }
}
//1 get the fields from the req object i.e. incoming request
//2 find the user in the database on the basis of username
//3 compare the password of req.body with the hashed password of the user found from the database
//in the previous step using bcrypt.compare method
//4 if user not found or password not matched then invalid user else generate tojen and set cookie

export const logout= async(req,res) =>{
    try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
}
//1 set the cookie named jwt to maxAge 0 and logout happens

export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");
		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getMe controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
//1 get the user by findById on the basis of userId from incoming request and exclude the password from it.


//select , findById , req.user , ?. , clearCookie , _id , User model ka new user . 