import {v2 as cloudinary} from "cloudinary"
import fs from fs

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_API_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFileCloudinary = async (localfilepath) => {
    try {
        if(!localfilepath) return null
        //upload the file to cloudinary
        const response = await cloudinary.uploader.upload(localfilepath , {
            resource_type: "auto"
        })
        console.log("file uploaded successfully", response.url);
        return response;
    } catch (error) {
        fs.unlink(localfilepath);
        //Remove the locally stored file as the file ypload has failed
        return null;
    }
}