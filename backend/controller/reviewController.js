import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";


// =========================================================
// ADD REVIEW
// =========================================================

export const addReview = async (req, res) => {

    try {

        const {
            productId,
            rating,
            comment
        } = req.body;

        const userId = req.userId;


        // =====================================================
        // BASIC VALIDATION
        // =====================================================

        if (!productId || !rating || !comment?.trim()) {

            return res.status(400).json({
                success: false,
                message: "Product, rating and comment are required"
            });

        }


        // =====================================================
        // CHECK PRODUCT
        // =====================================================

        const product = await Product.findById(productId);

        if (!product) {

            return res.status(404).json({
                success: false,
                message: "Product not found"
            });

        }


        // =====================================================
        // VALIDATE RATING
        // =====================================================

        const numericRating = Number(rating);

        if (
            Number.isNaN(numericRating) ||
            numericRating < 1 ||
            numericRating > 5
        ) {

            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });

        }


        // =====================================================
        // CHECK IF USER ALREADY REVIEWED
        // =====================================================

        const existingReview = await Review.findOne({
            product: productId,
            user: userId
        });


        if (existingReview) {

            return res.status(400).json({
                success: false,
                message: "You have already reviewed this product"
            });

        }


        // =====================================================
        // CHECK WHETHER USER PURCHASED AND RECEIVED PRODUCT
        // =====================================================

        /*
            We support both:

            New orders:
            items.productId

            Old orders:
            items._id
        */

        const deliveredOrder = await Order.findOne({

            userId: userId,

            status: "Delivered",

            $or: [
                {
                    items: { $elemMatch: { productId: productId, cancelled: { $ne: true } } }
                },
                {
                    items: { $elemMatch: { _id: productId, cancelled: { $ne: true } } }
                }
            ]

        });


        if (!deliveredOrder) {

            return res.status(403).json({
                success: false,
                message: "You can review this product only after it is delivered"
            });

        }


        // =====================================================
        // CREATE REVIEW
        // =====================================================

        const review = await Review.create({

            product: productId,

            user: userId,

            rating: numericRating,

            comment: comment.trim()

        });


        // =====================================================
        // RECALCULATE PRODUCT RATING
        // =====================================================

        const reviews = await Review.find({
            product: productId
        });


        const totalRating = reviews.reduce(
            (sum, review) => sum + review.rating,
            0
        );


        const averageRating =
            totalRating / reviews.length;


        product.rating =
            Number(averageRating.toFixed(1));


        product.numReviews =
            reviews.length;


        await product.save();


        // =====================================================
        // RESPONSE
        // =====================================================

        return res.status(201).json({

            success: true,

            message: "Review added successfully",

            review,

            rating: product.rating,

            numReviews: product.numReviews

        });


    } catch (error) {

        console.log(error);


        // MongoDB duplicate-key error
        if (error.code === 11000) {

            return res.status(400).json({
                success: false,
                message: "You have already reviewed this product"
            });

        }


        return res.status(500).json({

            success: false,

            message: "Failed to add review"

        });

    }

};


// =========================================================
// CHECK REVIEW ELIGIBILITY
// =========================================================

export const checkReviewEligibility = async (req, res) => {

    try {

        const {
            productId
        } = req.params;

        const userId = req.userId;


        // =====================================================
        // CHECK EXISTING REVIEW
        // =====================================================

        const existingReview = await Review.findOne({

            product: productId,

            user: userId

        });


        if (existingReview) {

            return res.status(200).json({

                success: true,

                canReview: false,

                alreadyReviewed: true,

                message: "You have already reviewed this product"

            });

        }


        // =====================================================
        // CHECK DELIVERED ORDER
        // =====================================================

        const deliveredOrder = await Order.findOne({

            userId: userId,

            status: "Delivered",

            $or: [
                {
                    items: { $elemMatch: { productId: productId, cancelled: { $ne: true } } }
                },
                {
                    items: { $elemMatch: { _id: productId, cancelled: { $ne: true } } }
                }
            ]

        });


        if (!deliveredOrder) {

            return res.status(200).json({

                success: true,

                canReview: false,

                alreadyReviewed: false,

                message: "You can review this product after it is delivered"

            });

        }


        // =====================================================
        // USER CAN REVIEW
        // =====================================================

        return res.status(200).json({

            success: true,

            canReview: true,

            alreadyReviewed: false,

            message: "You can review this product"

        });


    } catch (error) {

        console.log(error);


        return res.status(500).json({

            success: false,

            message: "Failed to check review eligibility"

        });

    }

};


// =========================================================
// GET PRODUCT REVIEWS
// =========================================================

export const getProductReviews = async (req, res) => {

    try {

        const {
            productId
        } = req.params;


        const reviews = await Review.find({
            product: productId
        })
            .populate("user", "name")
            .sort({
                createdAt: -1
            });


        return res.status(200).json({

            success: true,

            reviews

        });


    } catch (error) {

        console.log(error);


        return res.status(500).json({

            success: false,

            message: "Failed to fetch reviews"

        });

    }

};