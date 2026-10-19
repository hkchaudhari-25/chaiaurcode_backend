import mongoose , {isValidObjectId} from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {Video} from "../models/video.model.js";
import {uploadFileCloudinary} from "../utils/cloudinary.js";


const publishVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    
    if(!title?.trim() || !description?.trim()){
        throw new ApiError(
             400,
            "Title and description are required"
        )
    }
    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if(!videoLocalPath){
        throw new ApiError(
            400, 
            "Video file is required (Localst)"
        );
        
    }
     if(!thumbnailLocalPath){
      throw new ApiError(
        400,
        "Thumnail file is required "
      );
     }
      const Videouploaded =  await uploadFileCloudinary(videoLocalPath);
      const Thumnailuploaded = await uploadFileCloudinary(thumbnailLocalPath);

      if(!Videouploaded?.url || !Thumnailuploaded?.url){
        throw new ApiError (400 , "file upload failed to claudinary")
      }

      const createdVideo = await Video.create( {
        videoFile : Videouploaded.url ,
        thumbnail: Thumnailuploaded.url ,
        title,
        description,
        duration : Videouploaded.duration , 
        owner : req.user._id ,
      }
      );

      return res
      .status(201)
      .json(
        new ApiResponse(
            201,
            createdVideo , 
            "Video published successfully.."
        )
      )
}

);

const getVideobyId = asyncHandler(async(req , res) => {

   const  {videoId} = req.params;

   if(!mongoose.isValidObjectId(videoId)){
    throw new ApiError(400 , "Invalid object ID ")
   }

   const video = Video.findById(videoId);
    if(!videoId){
        throw new ApiError(404 , "Video not found")
    }
    return res
    .status(200)
    .json(
        new ApiResponse (200 , video , "Video fetched successfully")
    )
})

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query 
    
    const pipeline = [];

    pipeline.push({
        $match : {
            isPublished : true
        }, 
    });
    
    if(userId){
        if(!mongoose.isValidObjectId(userId))
        throw new ApiError (404 , "User id not valid")
    
     pipeline.push({
        $match : {
            owner : new mongoose.Types.ObjectId(userId),
        },
     })
    }

    if(query?.trim()){
        pipeline.push({
            $match: {
                $or : [
                    {title : {$regex: query.trim(), $options : "i"}},
                    {description : {$regex: query.trim(), $options : "i"}},
                ],
            },
        })
    }

    const allowedSortFields = [
        "createdAt",
        "views",
        "title",
        "duration"
    ];

      if (!allowedSortFields.includes(sortBy)) {
    throw new ApiError(400, "Invalid sort field");
  }

  if (!["asc", "desc"].includes(sortType)) {
    throw new ApiError(400, "Invalid sort type");
  }

   pipeline.push({
    $sort: {
      [sortBy]: sortType === "asc" ? 1 : -1,
      _id: 1,
    },
  });

  // Step 6: Paginate the results
  const aggregate = Video.aggregate(pipeline);

  const videos = await Video.aggregatePaginate(aggregate, {
    page: Number(page),
    limit: Number(limit),
  });

  // Step 7: Send the response
  return res.status(200).json(
    new ApiResponse(200, videos, "Videos fetched successfully")
  );
});

const updateVideo = asyncHandler(async(req, res) => {
   const {videoId} = req.params ;
    const {title ,  description} =  req.params;

  
   if(!mongoose.isValidObjectId(videoId)){
    throw new ApiError(400 , "Invalid object ID ")
   }
   const video = await Video.FindById(videoId)

   if(!videoId){
    throw new ApiError(404, "Video not found")
   }

   if(video.owner.toString() !== req.user._id.toString()){
    throw new ApiError(403, "You cannot update thius video")
   }

   if((title !== undefined && !title.trim()) || (description !== undefined && !description.trim())){
        throw new ApiError(403 , "Name or Description cannot be left empty.")
    }

    if (title === undefined && description === undefined) {
    throw new ApiError(400, "Provide at least one field to update");
    }

    if(title !== umdefined()){
        video.title = title.trim()
    }

    if(description !== undefined){
        video.description= description.trim()
    }

       if (req.file?.path) {
        const thumbnail = await uploadFileCloudinary(req.file.path);

        if (!thumbnail?.url) {
            throw new ApiError(500, "Thumbnail upload failed");
        }

        video.thumbnail = thumbnail.url;
    }

    await video.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            video,
            "Video updated successfully"
        )
    );


})

const deleteVideo = asyncHandler(async(req,res)=> {
    const {videoId} = req.params

    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(401 , "Invalid video Id")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError( 404 , "Video not found")
    }

    if(video.owner.toString() !== req.user._id.toString()){
    throw new ApiError(403, "You cannot delete this video")
   }
   await Video.findByIdAndDelete(videoId)

   return res
   .status(200)
   .json(
    new ApiResponse(
        200,
        {},
        "Video deleted successfully"
    )
   )

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(400 , "Invalid video Id")
     }
    
     const video = await Video.findById(videoId)

     if(!video){
        throw new ApiError (404 , "Video not found")
     }
    
     if(video.owner.toString() !== req.user._id.toString()){
    throw new ApiError(403, "You cannot delete this video")
   };

   video.isPublished = !video.isPublished ;

   await video.save();

   return res
   .status(200)
   .json(
    new ApiResponse(
        200,
        video,
        "Video publish status updated successfully"
    )
   )

})

export { publishVideo , getVideobyId ,  getAllVideos , updateVideo , deleteVideo , togglePublishStatus};