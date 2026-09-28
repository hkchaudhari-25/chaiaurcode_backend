import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadFileCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshToken = async (userId)  => {

    try {
        const user = User.findOne(userId)
        const accessToken = User.generateAccessToken()
        const refreshToken = User.generateRefreshToken()

        user.refreshToken = refreshToken
       await user.save({validateBeforeSave : false})
       return {accessToken , refreshToken}

    } catch (error) {
        throw new ApiError(500 , "Something went wrong while generating refresh and access token")
    }
}


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

const existedUser = await User.findOne({
    $or : [{username} , {email}]
})

if(existedUser){
    throw new ApiError(409,"User with username or email")
}
console.log("req.files:", req.files); //debugging statements
console.log("req.file:", req.file);

const avatarLocalPath = req.files?.avatar[0]?.path;
// const coverimageLocalPath = req.files?.coverimage[0]?.path;

if (!avatarLocalPath) {
    throw new ApiError(404 , "Avatat file is required") // to check that multer has saved file locally or not
}

let coverimageLocalPath; 
//check and handle if coverimage is not uploaded by user //isArray cheks rather array lements are uploaded or not
if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverimageLocalPath = req.files.coverimage[0].path;
}

const avatar = await uploadFileCloudinary(avatarLocalPath);
const coverimage = await uploadFileCloudinary(coverimageLocalPath);


if(!avatar){
    throw new ApiError(400 , "Avatar file is not uploaded on Cloudinary") //to check that file is uploaded to cloudinary or not
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
    new ApiResponse (
        200,
        createdUser,
        "User Registered successfully")
)

}

)

const loginUser = asyncHandler( async (req,res) => {
//req body -> data
//username or email
//find user
//password check
//access refresh token
//send cookie

const {email , username , password} = req.body

if (!email && !username) {
    throw new ApiError(400, "Username or email is required")
    
}

const user = User.findOne({
    $or : [{username} , {email}]
})

if(!user){
    throw new ApiError(400, "User not found ")
}

const isPasswordValid = await user.isPasswordCorrect(password)

if(!isPasswordValid){
    throw new ApiError(402, "Unvalid  credentials")
}

const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id)

const loggedInUser = await findById(user._id).select("-password -refreshToken")
 const options= {
    httponly : true ,
    secure : true
 }

 return res
 .status(200)
 .cookie("accessToken" , accessToken , options)
 .cookie("refreshToken" , refreshToken , options)
 .json(
    new ApiResponse(
        200,
        { user : accessToken , refreshToken , loggedInUser},
        "User Logged In Successfully"
    )
 )

}
)

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options= {
    httponly : true ,
    secure : true
 }

 return res
 .status(200)
 .cookie("accessToken" ,  options)
 .cookie("refreshToken" ,  options)
 .json(
    new ApiResponse(
        200,
        { user : accessToken , refreshToken , loggedInUser},
        "User Logged In Successfully"
    )
 )

})

export {registerUser, loginUser,logoutUser}