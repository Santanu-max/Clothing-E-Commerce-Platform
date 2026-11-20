import User from "../models/userModel.js"
import Order from "../models/orderModel.js"


export const getCurrentUser = async( req, res ) => {
    try{
        let user = await  User.findById(req.userId).select("-password")

        if(!user){
            return res.status(404).json({message: "User is not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        console.log("getCurrentUser error:", error);
    }
} 

export const getAdmin = async (req,res) => {
    try {
        let adminEmail = req.adminEmail;
        if(!adminEmail){
            return res.status(404).json({message:"Admin is not found"}) 
        }
        return res.status(201).json({
            email:adminEmail,
            role:"admin"
        })
    } catch (error) {
        console.log(error)
    return res.status(500).json({message:`getAdmin error ${error}`})
    }
}


// =========================================================
// DELIVERY INFORMATION (saved per user)
// =========================================================

const DELIVERY_FIELDS = [
    "firstName", "lastName", "email", "street",
    "city", "state", "pinCode", "country", "phone"
]

export const getDeliveryInfo = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("deliveryInfo")

        if (!user) {
            return res.status(404).json({ success: false, message: "User is not found" })
        }

        const info = user.deliveryInfo ? user.deliveryInfo.toObject() : {}

        return res.status(200).json({
            success: true,
            isSaved: !!info.isSaved,
            deliveryInfo: info
        })
    } catch (error) {
        console.log("getDeliveryInfo error:", error)
        return res.status(500).json({ success: false, message: "Failed to load delivery information" })
    }
}

export const saveDeliveryInfo = async (req, res) => {
    try {
        const data = {}

        for (const field of DELIVERY_FIELDS) {
            const value = String(req.body[field] ?? "").trim()

            if (!value) {
                return res.status(400).json({
                    success: false,
                    message: `${field} is required`
                })
            }

            data[field] = value
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            { deliveryInfo: { ...data, isSaved: true } },
            { new: true }
        ).select("deliveryInfo")

        if (!user) {
            return res.status(404).json({ success: false, message: "User is not found" })
        }

        return res.status(200).json({
            success: true,
            message: "Delivery information saved",
            deliveryInfo: user.deliveryInfo
        })
    } catch (error) {
        console.log("saveDeliveryInfo error:", error)
        return res.status(500).json({ success: false, message: "Failed to save delivery information" })
    }
}


// =========================================================
// PROFILE STATS  (total products bought + total money spent)
// =========================================================

export const getProfileStats = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.userId })

        let totalProducts = 0
        let totalSpent = 0
        let totalOrders = 0

        for (const order of orders) {
            // A Razorpay order is created BEFORE the payment happens.
            // If it was never paid it is not a real purchase, so skip it.
            if (order.paymentMethod === "Razorpay" && !order.payment) continue

            totalOrders += 1
            totalSpent += Number(order.amount) || 0

            for (const item of order.items || []) {
                totalProducts += Number(item.quantity) || 0
            }
        }

        return res.status(200).json({
            success: true,
            totalOrders,
            totalProducts,
            totalSpent
        })
    } catch (error) {
        console.log("getProfileStats error:", error)
        return res.status(500).json({ success: false, message: "Failed to load profile stats" })
    }
}
