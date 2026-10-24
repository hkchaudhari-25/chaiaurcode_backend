import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req,res) =>{
    const {videoId} = req.params

    const {page = 1 , limit =10} = req.query

    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(400 , "invalid video id")
    }

    const video  = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404 , "Video not found")
    }

    const comments = await Comment.aggregate([
        {
            $match: {
                video : new mongoose.Types.ObjectId(videoId),
            }
        },
        {
            $sort:{
                createdAt : -1,
            },
        },
        {
            $skip:(Number(page)- 1)* Number(limit),
        }, 
        {
            $limit : Number(limit),
        },
        {
            $lookup : {
                from : "users",
                localField : "owner",
                foreignField : "_id",
                as : "owner",
                pipeline : [
                    {
                        $project: {
                            username: 1,
                            fullname: 1,
                            avatar: 1,
                        }
                    }
                ]
            }
        } ,
        {
            $unwind: "$owner",
        }
    ])
    const totalComments = await Comment.countDocuments({
        video: videoId,
    });

    // 7. Send response
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                comments,
                totalComments,
                currentPage: Number(page),
                totalPages: Math.ceil(totalComments / Number(limit)),
            },
            "Video comments fetched successfully"
        )
    );

})


const addComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params

    const {content} = req.body

    if(!content ||!content.trim()){
        throw new ApiError(400, "Comment content is required");
    }

       if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const comment = await Comment.create({
        content: content.trim(),
        video: videoId,
        owner: req.user._id,
    });

    // 7. Return response
    return res.status(201).json(
        new ApiResponse(
            201,
            comment,
            "Comment added successfully"
        )
    );
});


const updateComment = asyncHandler(async (req, res) => {
    // 1. Get commentId from URL params
    const { commentId } = req.params;

    // 2. Get updated content from request body
    const { content } = req.body;

    // 3. Validate commentId
    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    // 4. Validate content
    if (!content || !content.trim()) {
        throw new ApiError(400, "Comment content is required");
    }

    // 5. Find the comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // 6. Check whether the logged-in user owns this comment
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to update this comment"
        );
    }

    // 7. Update the comment
    comment.content = content.trim();
    await comment.save();

    // 8. Return response
    return res.status(200).json(
        new ApiResponse(
            200,
            comment,
            "Comment updated successfully"
        )
    );
});


const deleteComment = asyncHandler(async (req, res) => {
    // 1. Get commentId from URL params
    const { commentId } = req.params;

    // 2. Validate commentId
    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    // 3. Find the comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // 4. Check ownership
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to delete this comment"
        );
    }

    // 5. Delete the comment
    await Comment.findByIdAndDelete(commentId);

    // 6. Return response
    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Comment deleted successfully"
        )
    );
});

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }