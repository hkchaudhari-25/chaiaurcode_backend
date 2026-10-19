import mongoose ,{ isValidObjectId }  from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import { application } from "express";

const createPlaylist = asyncHandler(async (req, res) =>{
const {name , description} = req.body

if(!name || !description){
    throw new ApiError(400 , "Name and description fields are required")
}

const playlist = await Playlist.create({
    name,
    description,
    owner: req.user._id
})

return res
.status(201)
.json(
    new ApiResponse(201,playlist, "Playlist created successfully")
)

})

const getUserPlaylist = asyncHandler (async (req, res) => {
    const {userId} = req.params

        //find playlists belongign to this user
    const playlists = await Playlist.find({
        owner:userId._id
    })

    //check if palylist exists
    if(!playlists || playlists.length === 0){
        throw new ApiError(404, "Playlist not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, playlists , "Playlists fetched successfully......")
    )
})

const getPlaylistbyId = asyncHandler (async (req, res) => {

    const {playlistId} = req.params
       
    console.log("Is valid ObjectId:", mongoose.isValidObjectId(playlistId));
    if(!mongoose.isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid Playlist ID")
    }

    const playlist= await Playlist.findById(playlistId)
    

    if(!playlist){
        throw new ApiError(404 , "Playlist by ID not found..")
    }

    return res
    .status(200)
    .json(
        new ApiResponse (200 , playlist , "Playlist by Id fetched successfully..")
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError (400 ,  "Playlist or video Id are invalid")
    }
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }
    if(playlist.owner.toString()!== req.user_.id.toString()){
        throw new ApiError(403, "you cannot modify this playlist")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(403 , "Invalid video id")
    }
    const video = await Playlist.findById(videoId)

    if(!videoId){
        throw new ApiError(404 , "Video by ID not found")
    }

    if(playlist.videos.some(id=> id.toString() == videoId)){
        throw new ApiError (403, "THE video already exist in playlist..")
    }

    playlist.video.push(videoId)

    await playlist.save()

    return res
    .status(200)
    .json(
        new ApiResponse( 200, playlist , "Video addedd to playlist successfully")
    );
})

const removeVideoFromPlaylist = asyncHandler (async (req,res) => {
    const {playlistId, videoId} = req.params
     if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError (400 ,  "Playlist or video Id are invalid")
    }
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }
    if(playlist.owner.toString()!== req.user_.id.toString()){
        throw new ApiError(403, "you cannot modify this playlist")
    }

     if(!playlist.videos.some(id=> id.toString() == videoId)){
        throw new ApiError (403, "THE video does not exist in playlist..")
    }

    playlist.videos.pull(videoId)

    await playlist.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200 , playlist , "The video removed from playlist  successfully")

    )


})

const deletePlaylist = asyncHandler (async (req, res) => {
    const {playlistId} = req.params

    if(!isValidObjectId(playlistId)){
            throw new ApiError(403 , "Invalid Playlist ID")
    }

    const playlist  = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You cannot delete this playlist");
}

    Playlist.findByIdAndDelete(playlistId)

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, {} , "Playlist deleted successfully"
        )
    )
})

const updatePlaylist = asyncHandler(async(req, res) =>{
        const {playlistId} =  req.params
        const{name, description} = req.body
        if(!isValidObjectId(playlistId)){
            throw new ApiError(403 , "Invalid Playlist ID")
    }

    const playlist  = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You cannot update this playlist");
    }

    if((name !== undefined && !name.trim()) || (description !== undefined && !description.trim())){
        throw new ApiError(403 , "Name or Description cannot be left empty.")
    }

    if (name === undefined && description === undefined) {
    throw new ApiError(400, "Provide at least one field to update");
    }

    if(name !== undefined){
        playlist.name= name.trim()
    }
    if(description !== undefined){
        playlist.description = description.trim()
    }

    await playlist.save()

    return res
    .status(200)
    .json(
        200 , playlist ,  "Playlist Updated successfully..."
    )


    })

    export {createPlaylist , getUserPlaylist , getPlaylistbyId , addVideoToPlaylist , removeVideoFromPlaylist , deletePlaylist , updatePlaylist }