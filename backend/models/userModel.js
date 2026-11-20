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

    // Saved delivery / personal information (used by Profile + Place Order pages)
    deliveryInfo: {
        firstName: { type: String, default: "" },
        lastName:  { type: String, default: "" },
        email:     { type: String, default: "" },
        street:    { type: String, default: "" },
        city:      { type: String, default: "" },
        state:     { type: String, default: "" },
        pinCode:   { type: String, default: "" },
        country:   { type: String, default: "" },
        phone:     { type: String, default: "" },
        isSaved:   { type: Boolean, default: false },
    },
}, {
    timestamps: true,
    minimize: false,
});

const User = mongoose.model("User", userSchema);

export default User;