const User = require('../models/user-model');
const auth = require('../auth');          
const bcrypt = require('bcryptjs');


const getLoggedIn = async (req, res) => {
    try {
        const userId = auth.verifyUser(req); 
        if (!userId) {
            console.log("No valid token found");
            return res.status(200).json({
                loggedIn: false,
                user: null
            });
        }

        const loggedInUser = await User.findById(userId);
        if (!loggedInUser) {
            console.log("User not found for token");
            return res.status(200).json({
                loggedIn: false,
                user: null
            });
        }

        console.log("User logged in:", loggedInUser.email);
        return res.status(200).json({
            loggedIn: true,
            user: {
                _id: loggedInUser._id,
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName,
                email: loggedInUser.email
            }
        });
    } catch (err) {
        console.error("getLoggedIn error:", err);
        return res.status(200).json({
            loggedIn: false,
            user: null
        });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(400).json({
                errorMessage: "Wrong email or password"
            });
        }

        const correctPassword = await bcrypt.compare(password, existingUser.passwordHash);
        if (!correctPassword) {
            return res.status(400).json({
                errorMessage: "Wrong email or password"
            });
        }

  
        const token = auth.signToken(existingUser._id.toString());

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false 
        });

        return res.status(200).json({
            user: {
                _id: existingUser._id,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                email: existingUser.email
            },
            loggedIn: true
        });
    } catch (err) {
        console.error("loginUser error:", err);
        return res.status(500).json({
            errorMessage: "Server error while logging in"
        });
    }
};

/**
 * POST /auth/register
 * (you already have users, but keep it correct)
 */
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, passwordVerify } = req.body;

        if (password !== passwordVerify) {
            return res.status(400).json({
                errorMessage: "Passwords do not match"
            });
        }

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({
                errorMessage: "An account with this email already exists."
            });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            passwordHash,
            playlists: []
        });

        const savedUser = await newUser.save();

        // sign and send token immediately if you want
        const token = auth.signToken(savedUser._id.toString());
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false
        });

        return res.status(200).json({
            user: {
                _id: savedUser._id,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email
            },
            loggedIn: true
        });
    } catch (err) {
        console.error("registerUser error:", err);
        return res.status(500).json({
            errorMessage: "Server error while registering"
        });
    }
};

/**
 * GET /auth/logout
 */
const logoutUser = (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({
        loggedIn: false
    });
};

module.exports = {
    getLoggedIn,
    loginUser,
    registerUser,
    logoutUser
};
