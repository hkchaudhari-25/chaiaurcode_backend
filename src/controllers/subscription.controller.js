import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req,res) => {
    const {channelId} = req.params

    if(!mongoose.isValidObjectId(channelId)){
        throw new ApiError(400 , "invalid channel Id");
    }

    const channel = await Subscription.findById(channelId)

    if(!channel){
        throw new ApiError(404 , "No channel found")
    }

    const subscriberId = req.user._id ;

    if(!subscriberId.toString() == channelId){
        throw new ApiError (400 , "You cannot subscribe your own channel" )
    }

    const existingSubscription = await Subscription.findOne({
        subscriber : subscriberId , 
        channel : channelId
    })

    if(existingSubscription){
        await Subscription.findByIdAndDelete(
            existingSubscription._id
        )

        return res
        .status(200)
        .json(
            new ApiResponse(
            200 , 
            {subscribed : false},
            "Unsubscribed successfully"
        )
    )
    }

    await Subscription.create({
        subscriber : subscriberId , 
        channel : channelId
    })

    return res
        .status(201)
        .json(
            new ApiResponse(
            200,
            {subscribed : true } , 
            "Subscribed successfully"
        )
    )

})

// controller to return subscriber list of a channel (//get subscribers of a channel)
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!mongoose.isValidObjectId(channelId)){
        throw new ApiError(400 , "Invalid Id")
    }

    const channel = await Subscription.findById(channelId)

    if(!channel){
        throw new ApiError(404 ,  "channel not found")
    }

    const subscribers = await Subscription.find({
        channel : channelId
    }).populate(
        "subscriber" , 
        "username fullname avatar"
    )

    return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    subscribers,
                    "Subscribers fetched successfully"
                )
            )
})

// controller to return channel list to which user has subscribed (get channels subscribed by user)
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!mongoose.isValidObjectId(channelId)){
        throw new ApiError(400 , "Invalid Id")
    }

    const subscriber = await Subscription.findById(subscriberId)

    if(!subscriber){
        throw new ApiError(404 ,  "subscriber not found")
    }

    const subscribedChannel = await Subscription.find({
        subscriber : subscriberId
    }).populate(
        "channel",
        "username fullname avatar"
    )

      return res.status(200).json(
        new ApiResponse(
            200,
            subscribedChannels,
            "Subscribed channels fetched successfully"
        )
    );

})

export {toggleSubscription , getSubscribedChannels , getUserChannelSubscribers}