import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_API_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFileCloudinary = async (localfilepath) => {
    try {
        if(!localfilepath) {return null}

//         console.log("Local file path:", localfilepath); //debuggung statements
// console.log("Cloud name:", process.env.CLOUDINARY_API_NAME);
// console.log("API key exists:", !!process.env.CLOUDINARY_API_KEY);
// console.log("API secret exists:", !!process.env.CLOUDINARY_API_SECRET);
        //upload the file to cloudinary
        const response = await cloudinary.uploader.upload(localfilepath , {
            resource_type: "auto"
        })
        console.log("file uploaded successfully", response.url);
           fs.unlinkSync(localfilepath);
        return response;
    } catch (error) {
    console.log("CLOUDINARY ERROR:", error);

    fs.unlinkSync(localfilepath);

    return null;
}
}

export {uploadFileCloudinary}