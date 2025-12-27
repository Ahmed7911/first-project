import { startSession } from "mongoose";
import crypto from "crypto";
import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingEmail = await User.findOne({ email: email.toLowerCase() });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already registered!" });
        }

        const existingUsername = await User.findOne({ username: username.toLowerCase() });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already taken!" });
        }

        const user = await User.create({
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password,
            signedIn: false
        });

        res.status(201).json({
            message: "User registered successfully",
            user: { id: user._id, email: user.email, username: user.username }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // create session token valid for 15 minutes
        const token = crypto.randomBytes(32).toString("hex");
        user.signedIn = true;
        user.sessionToken = token;
        user.sessionExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        await user.save();

        res.status(200).json({
            message: "User logged in successfully",
            token,
            expiresAt: user.sessionExpires,
            user: { id: user._id, email: user.email, username: user.username }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



const logoutUser = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        user.signedIn = false;
        user.sessionToken = null;
        user.sessionExpires = null;
        await user.save();

        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
export { registerUser, loginUser, logoutUser };