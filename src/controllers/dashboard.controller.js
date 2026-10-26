import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelstats = asyncHandler(async (req,res) =>{
    const {userId} = req.user._id

    const {totalSubscribers , totalViews , videoIds } = await Promise.all([
        Video.aggregate([
            {$match: {owner:userId}} , 
            {
            $group : {
                _id: null , 
                totalViews : {$sum : 1},
                totalViews : {$sum : "$views"}
            }

            }
        ]) ,
        Subscription.countDocuments({$channel : userId}),

        Video.distinct("_id" , {owner:userId})

    ])

    const totalLikes = await  Like.countDocuments({
        video :{$in : videoIds}
    });
    const stats = {
        totalVideos: videoStats[0]?.totalVideos || 0,
        totalViews: videoStats[0]?.totalViews || 0,
        totalSubscribers,
        totalLikes
    };

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            stats,
            "Channel stats fetched successfully.."
        )
    )

})

const getChannelVideos = asyncHandler(async (req,res) => {
    const {userId} = req.user._id
    const {page = 1 , limit = 10} = req.query

    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId");
    }

      const videos = await Video.find({ owner: userId }) // this approach is not suitable for 1000s of video feching, as it gets each video 1 by 1 so it can make server crash or extremely slow
        .sort({ createdAt: -1 });

            
    return res.status(200).json(
        new ApiResponse(
            200,
            videos,
            "Channel videos fetched successfully"
        )
    );


})

export { get }