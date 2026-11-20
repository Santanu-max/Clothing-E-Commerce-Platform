import express from "express";

import {
    addReview,
    getProductReviews,
    checkReviewEligibility
} from "../controller/reviewController.js";

import isAuth from "../middleware/isAuth.js";

const reviewRoutes = express.Router();


// =====================================================
// ADD REVIEW
// =====================================================

reviewRoutes.post(
    "/add",
    isAuth,
    addReview
);


// =====================================================
// CHECK REVIEW ELIGIBILITY
// =====================================================

reviewRoutes.get(
    "/eligibility/:productId",
    isAuth,
    checkReviewEligibility
);


// =====================================================
// GET PRODUCT REVIEWS
// =====================================================

reviewRoutes.get(
    "/:productId",
    getProductReviews
);


export default reviewRoutes;