import User from "../models/user.model";
import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import config from "../../config/config";

const signin = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        // Verify user exist
        if (!user) {
            return res.status(401).json({ error: "User not found." });
        }
        // Verify email and password match or not
        if (!user.authenticate(res.body.password)) {
            return res.status(401).json({ error: "Email and password don't match" });
        }
        // Generate a signed JWT using a secret key jwtSecret and user's id
        const token = jwt.sign({ _id: user._id }, config.jwtSecret);
        // Set token to cookie in response
        res.cookie("t", token, { expire: new Date() + 9999 });
        return res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        return res.status(401).json({ error: "Could not sign in!" });
    }
};

const signout = (req, res) => {
    // Clear the response cookie containing the signed JWT
    res.clearCookie("t");
    return res.status("200").json({ message: "signed out." });
};
// Verify the incoming request has a valid JWT in Authorization header
const requireSignin = expressJwt({
    secret: config.jwtSecret,
    userProperty: "auth",
});
// Check the authenticated user is the same as the user being updated or deleted
const hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!authorized) {
        return res.status('403').json({
            error: 'User is not authorized'
        })
    }
    next();
};

export default {signin, signout, requireSignin, hasAuthorization}
