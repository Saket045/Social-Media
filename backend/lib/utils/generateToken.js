import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, //MS
		httpOnly: true, // prevent XSS attacks cross-site scripting attacks
		sameSite: "strict", // CSRF attacks cross-site request forgery attacks
		secure: process.env.NODE_ENV !== "development",
	});
};
//make a token with jwt sign method and 3 arguments,
//userId-payload ,jwt secret ,expiry-limit
//send the cookie to client(browser or client-side) as a response
//set the cookie with max age of 15 days
//http only to prevent XSS attacks
//same site="strict" to prevent CSRF attacks
//secure i.e. https when not in development mode