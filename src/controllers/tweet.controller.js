import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req , res) => {

        const {content} = req.body;

        if(!content?.trim()){
            throw new ApiError(400,"Tweet content is required..");
            
        }

        if(!req.user?._id){
            throw new ApiError(401, "Unauthorized request..")
        }

        const tweet = await Tweet.create({
            content : content.trim(),
            owner : req.user._id
        });

            return res
            .status(201)
            .json(
            new ApiResponse(
                201,
                tweet,
                "Tweet created successfully"
            )
        );
})

const getUserTweet = asyncHandler(async (req, res)=> {

    const {userId} = req.params

    if(!mongoose.isValidObjectId(userId)){
        throw new ApiError(400  , "Invalid User Id")
    }
    if(!userId){
        throw new ApiError(400 , "User Id is required")
    }

    const tweets = await Tweet.find({
        owner: userId
    }).sort({createdAt : -1})

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tweets,
                "User tweets fetched successfully"
            )
        );
})

const updateTweet = asyncHandler(async(req, res) => {
    const {tweetId} = req.body
    const {userId} = req.params

    if((!tweetId)||(!userId)){
        throw new ApiError("Both fields are required .. ")
    }
    if(!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(tweetId)){
        throw new ApiError(403 , "Id is invalid")
    }

    const tweet  = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(404 , "Tweet not found.")
    }

    if(tweet.owner.toString() !== tweet.user._id.toString()){
        throw new ApiError(403 ,  "you cannot update this tweet due to lack of ownership")
    }
    tweet.content = content.trim()
    await tweet.save()

    return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    tweet , 
                    "Your tweet is updated successfully"
                )
            );
});

const deleteTweet = asyncHandler(async (req, res) => {
     const {tweetId} = req.body
    const {userId} = req.params

    if((!tweetId)||(!userId)){
        throw new ApiError("Both fields are required .. ")
    }
    if(!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(tweetId)){
        throw new ApiError(403 , "Id is invalid")
    }

    const tweet  = await Tweet.findById(tweetId)

    if(!tweetId){
        throw new ApiError("Tweet not found.")
    }

    if(tweet.owner.toString() != tweet.user._id.toString()){
        throw new ApiError(403 ,  "you cannot update this tweet due to lack of ownership")
    }

    await Tweet.findByIdAndDelete(tweetId)
    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Tweet is deleted successfully.."
        )
    );
});

export {createTweet , getUserTweet , updateTweet , deleteTweet} ;