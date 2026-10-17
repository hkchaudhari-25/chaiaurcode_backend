import mongoose , {isValidObjectId} from "mongoose";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Video from "../models/video.model.js";
import { uploadVideo } from "../utils/upload.js";
import uploadFileCloudinary from "../utils/uploadFileCloudinary.js";
import User from "../models/user.model.js";

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

   const video = Video.FindById(videoId);
    if(!videoId){
        throw new ApiError(404 , "Video not found")
    }
    return res
    .status(200)
    .json(
        new ApiResponse (200 , video , "Video fetched successfully")
    )
})



export { publishVideo , getVideobyId};