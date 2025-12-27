import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            minlength: 1,
            maxlength: 30,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 128,
            select: false   // hide password by default
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        signedIn: {
            type: Boolean,
            default: false
        },
        sessionToken: {
            type: String,
            default: null,
            select: false
        },
        sessionExpires: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error;
    }
});

// Compare passwords
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
