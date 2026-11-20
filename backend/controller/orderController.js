import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const currency = "inr";

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


// =========================================================
// FOR USER
// =========================================================


// =========================================================
// PLACE COD ORDER
// =========================================================

export const placeOrder = async (req, res) => {

    try {

        const { items, amount, address } = req.body;
        const userId = req.userId;

        const orderData = {

            items,
            amount,
            userId,
            address,

            paymentMethod: "COD",
            payment: false,

            date: Date.now()
        };

        const newOrder = new Order(orderData);

        await newOrder.save();

        await User.findByIdAndUpdate(
            userId,
            {
                cartData: {}
            }
        );

        return res.status(201).json({
            message: "Order Place"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Order Place error"
        });
    }
};


// =========================================================
// PLACE RAZORPAY ORDER
// =========================================================

export const placeOrderRazorpay = async (req, res) => {

    try {

        const { items, amount, address } = req.body;
        const userId = req.userId;

        const orderData = {

            items,
            amount,
            userId,
            address,

            paymentMethod: "Razorpay",
            payment: false,

            date: Date.now()
        };

        const newOrder = new Order(orderData);

        await newOrder.save();


        const options = {

            amount: amount * 100,

            currency: currency.toUpperCase(),

            receipt: newOrder._id.toString()
        };


        await razorpayInstance.orders.create(
            options,
            (error, order) => {

                if (error) {

                    console.log(error);

                    return res.status(500).json(error);
                }

                res.status(200).json(order);
            }
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};


// =========================================================
// VERIFY RAZORPAY PAYMENT
// =========================================================

export const verifyRazorpay = async (req, res) => {

    try {

        const userId = req.userId;

        const { razorpay_order_id } = req.body;

        const orderInfo =
            await razorpayInstance.orders.fetch(
                razorpay_order_id
            );


        if (orderInfo.status === "paid") {

            await Order.findByIdAndUpdate(
                orderInfo.receipt,
                {
                    payment: true
                }
            );


            await User.findByIdAndUpdate(
                userId,
                {
                    cartData: {}
                }
            );


            res.status(200).json({
                message: "Payment Successful"
            });

        } else {

            res.json({
                message: "Payment Failed"
            });
        }

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};


// =========================================================
// GET USER ORDERS
// =========================================================

export const userOrders = async (req, res) => {

    try {

        const userId = req.userId;

        const orders = await Order.find({
            userId
        });

        return res.status(200).json(orders);

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "userOrders error"
        });
    }
};



// =========================================================
// FOR ADMIN
// =========================================================


// =========================================================
// GET ALL ORDERS
// =========================================================

export const allOrders = async (req, res) => {

    try {

        const orders = await Order.find({});

        res.status(200).json(orders);

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "adminAllOrders error"
        });
    }
};



// =========================================================
// UPDATE ORDER STATUS
// =========================================================

export const updateStatus = async (req, res) => {

    try {

        const { orderId, status } = req.body;


        // =====================================================
        // FIND ORDER
        // =====================================================

        const order = await Order.findById(orderId);


        if (!order) {

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }


        // =====================================================
        // IMPORTANT:
        // DELIVERED IS THE FINAL STATUS
        //
        // Once an order is Delivered, it cannot be moved
        // back to Order Placed, Packing, Shipped, etc.
        // =====================================================

        if (order.status === "Delivered") {

            return res.status(400).json({
                success: false,
                message: "Delivered order cannot be changed"
            });
        }

        // A fully cancelled order is final as well
        if (order.status === "Cancelled") {

            return res.status(400).json({
                success: false,
                message: "Cancelled order cannot be changed"
            });
        }


        // =====================================================
        // VALID STATUS VALUES
        // =====================================================

        const validStatuses = [
            "Order Placed",
            "Packing",
            "Shipped",
            "Out for delivery",
            "Delivered"
        ];


        if (!validStatuses.includes(status)) {

            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }


        // =====================================================
        // DELIVERED ORDER
        // =====================================================

        if (status === "Delivered") {

            /*
             * Once the product is delivered:
             *
             * 1. Status becomes Delivered
             * 2. Payment becomes Done
             *
             * This applies to COD as well as Razorpay.
             */

            order.status = "Delivered";

            order.payment = true;

        } else {

            // =================================================
            // NORMAL STATUS UPDATE
            // =================================================

            order.status = status;
        }


        // =====================================================
        // SAVE ORDER
        // =====================================================

        await order.save();


        return res.status(200).json({

            success: true,

            message: "Order status updated successfully",

            order: order
        });


    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: error.message
        });
    }
};

export const singleOrder = async (req, res) => {

    try {

        const { orderId } = req.body
        const userId = req.userId

        const order = await Order.findOne({
            _id: orderId,
            userId: userId
        })

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            })
        }

        return res.status(200).json({
            success: true,
            order
        })

    } catch (error) {

        console.log(error)

        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// =========================================================
// CANCEL ONE PRODUCT OF AN ORDER (USER)
// =========================================================

// Statuses in which the user is still allowed to cancel.
// Once the order is "Out for delivery" (or later) it is locked.
const CANCELLABLE_STATUSES = ["Order Placed", "Packing", "Shipped"];

export const cancelOrderItem = async (req, res) => {

    try {

        const { orderId, itemIndex, reason } = req.body;
        const userId = req.userId;

        // ---------- validate reason ----------
        const cleanReason = (reason || "").toString().trim();

        if (cleanReason.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Please tell us the reason for cancellation"
            });
        }

        if (cleanReason.length > 500) {
            return res.status(400).json({
                success: false,
                message: "Reason is too long (max 500 characters)"
            });
        }

        // ---------- find the order (must belong to this user) ----------
        const order = await Order.findOne({ _id: orderId, userId });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // ---------- delivery position check ----------
        if (!CANCELLABLE_STATUSES.includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: `This product can no longer be cancelled (${order.status})`
            });
        }

        // ---------- find the product ----------
        const index = Number(itemIndex);
        const item = order.items[index];

        if (!Number.isInteger(index) || !item) {
            return res.status(404).json({
                success: false,
                message: "Product not found in this order"
            });
        }

        if (item.cancelled) {
            return res.status(400).json({
                success: false,
                message: "This product is already cancelled"
            });
        }

        // ---------- mark the product as cancelled ----------
        order.items[index] = {
            ...item,
            cancelled: true,
            cancelReason: cleanReason,
            cancelledAt: Date.now(),
            statusAtCancel: order.status   // Order Placed / Packing / Shipped
        };

        // items is a Mixed array, so Mongoose must be told it changed
        order.markModified("items");

        // ---------- if every product is cancelled, cancel the order ----------
        const allCancelled = order.items.every((i) => i.cancelled);

        if (allCancelled) {
            order.status = "Cancelled";
        }

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Product cancelled successfully",
            order
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
