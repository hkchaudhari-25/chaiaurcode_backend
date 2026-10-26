
import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelstats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const [videoStats, totalSubscribers, videoIds] = await Promise.all([
        // Get total videos and total views
        Video.aggregate([
            {
                $match: { owner: userId }
            },
            {
                $group: {
                    _id: null,
                    totalVideos: { $sum: 1 },
                    totalViews: { $sum: "$views" }
                }
            }
        ]),

        // Get total subscribers
        Subscription.countDocuments({
            channel: userId
        }),

        // Get IDs of the channel's videos
        Video.distinct("_id", {
            owner: userId
        })
    ]);

    // Count likes on the channel's videos
    const totalLikes = await Like.countDocuments({
        video: { $in: videoIds }
    });

    const stats = {
        totalVideos: videoStats[0]?.totalVideos || 0,
        totalViews: videoStats[0]?.totalViews || 0,
        totalSubscribers,
        totalLikes
    };

    return res.status(200).json(
        new ApiResponse(
            200,
            stats,
            "Channel stats fetched successfully"
        )
    );
});


const getChannelVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Pagination
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
        Math.max(parseInt(req.query.limit, 10) || 10, 1),
        100
    );

    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId");
    }

    // Fetch videos with pagination
    const [videos, totalVideos] = await Promise.all([
        Video.find({ owner: userId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),

        Video.countDocuments({ owner: userId })
    ]);

    const data = {
        videos,
        pagination: {
            totalVideos,
            currentPage: page,
            totalPages: Math.ceil(totalVideos / limit),
            limit
        }
    };

    return res.status(200).json(
        new ApiResponse(
            200,
            data,
            "Channel videos fetched successfully"
        )
    );
});

export { getChannelstats, getChannelVideos };
