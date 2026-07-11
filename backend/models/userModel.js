import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        default: null,   // No longer required for Google users
    },

    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local",
    },

    cartData: {
        type: Object,
        default: {},
    },
}, {
    timestamps: true,
    minimize: false,
});

const User = mongoose.model("User", userSchema);

export default User;