import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadFileCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req,res) =>{
//     return res.status(200).json({
//         message : "Jai Hari , Ramkrushn Hari Mandali.."
//     })

// get user details from front end
// check if field is empty(other validations)
//check if data is already present in db(username, email)
//check for images, check for avatar
//upload them on cloudinary, check if they are uloaded on cloudinary
//remove :- password & refresh token
// check for user creation
//return res
//

const {fullname, email , password, username} = req.body // data handling 
console.log("email  : " , email)

if ( [fullname, email, password , username].some((field)=>
field?.trim() === "")
) {
    throw new ApiError(400, "all fields are required")
}

const existedUser = User.findOne({
    $or : [{username} , {email}]
})

if(existedUser){
    throw new ApiError(409,"User with username or email")
}

const avatarLocalPath = req.files?.avatar[0]?.path;
const coverimageLocalPath = req.files?.coverimage[0]?.path;

if (!avatarLocalPath) {
    throw new ApiError(404 , "Avatat file is required")
}

const avatar = await uploadFileCloudinary(avatarLocalPath);
const coverimage = await uploadFileCloudinary(coverimageLocalPath);


if(!avatar){
    throw new ApiError(400 , "Avatar file is required")
}

const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverimage : coverimage?.url || "",
    email,
    password,
    username: username.toLowerCase()
})

const createdUser = await User.findById(user._id).select(

    "-password -refreshToken"
)
if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering the user")
}

return res.status(201).json(
    200,createdUser,"User Registered successfully"
)

}

)

export {registerUser}