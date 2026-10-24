import mongoose from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

// const toggleSubscription = asyncHandler(async (req,res) => {
//     const {channelId} = req.params

//     if(!mongoose.isValidObjectId(channelId)){
//         throw new ApiError(400 , "invalid channel Id");
//     }

//    const channel = await User.findById(channelId);

// if (!channel) {
//     throw new ApiError(404, "No channel found");
// }

//     const subscriberId = req.user._id ;

//   if (subscriberId.toString() === channelId) {
//     throw new ApiError(400, "You cannot subscribe to your own channel");
// }

//     const existingSubscription = await Subscription.findOne({
//         subscriber : subscriberId , 
//         channel : channelId
//     })

//     if(existingSubscription){
//         await Subscription.findByIdAndDelete(
//             existingSubscription._id
//         )

//         return res
//         .status(200)
//         .json(
//             new ApiResponse(
//             200 , 
//             {subscribed : false},
//             "Unsubscribed successfully"
//         )
//     )
//     }

//     await Subscription.create({
//         subscriber : subscriberId , 
//         channel : channelId
//     })

//     return res
//       .status(200)
//         .json(
//          new ApiResponse(
//         200,
//         { subscribed: true },
//         "Subscribed successfully"
//     )
// );

// })

// controller to return subscriber list of a channel (//get subscribers of a channel)

const toggleSubscription = asyncHandler(async (req, res) => {
    try {
        console.log("ROUTE HIT! ChannelId:", req.params.channelId); // <-- Check if this prints

        const { channelId } = req.params;

        if (!mongoose.isValidObjectId(channelId)) {
            throw new ApiError(400, "invalid channel Id");
        }

        const channel = await User.findById(channelId);

        if (!channel) {
            throw new ApiError(404, "No channel found");
        }

        const subscriberId = req.user?._id;

        if (!subscriberId) {
            throw new ApiError(401, "Unauthorized request");
        }

        if (subscriberId.toString() === channelId) {
            throw new ApiError(400, "You cannot subscribe to your own channel");
        }

        const existingSubscription = await Subscription.findOne({
            subscriber: subscriberId,
            channel: channelId,
        });

        if (existingSubscription) {
            await Subscription.findByIdAndDelete(existingSubscription._id);
            return res.status(200).json(
                new ApiResponse(200, { subscribed: false }, "Unsubscribed successfully")
            );
        }

        await Subscription.create({
            subscriber: subscriberId,
            channel: channelId,
        });

        return res.status(200).json(
            new ApiResponse(200, { subscribed: true }, "Subscribed successfully")
        );

    } catch (error) {
        console.error("CRASHED INSIDE CONTROLLER:", error); // <-- This will force print any error!
        throw error;
    }
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    // Find all subscription documents where this user is the "channel"
    const subscribers = await Subscription.find({
        channel: channelId
    }).populate(
        "subscriber", 
        "username fullname avatar"
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            subscribers,
            "Subscribers fetched successfully"
        )
    );
});

// controller to return channel list to which user has subscribed (get channels subscribed by user)


const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    // FIXED: Use subscriberId instead of channelId
    if (!mongoose.isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID");
    }

    // FIXED: Check the User model instead of Subscription model
    const subscriber = await User.findById(subscriberId);

    if (!subscriber) {
        throw new ApiError(404, "Subscriber not found");
    }

    const subscribedChannels = await Subscription.find({
        subscriber: subscriberId,
    }).populate(
        "channel",
        "username fullname avatar"
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            subscribedChannels, // FIXED: Matches the variable name plural form
            "Subscribed channels fetched successfully"
        )
    );
});

export {toggleSubscription , getSubscribedChannels , getUserChannelSubscribers}