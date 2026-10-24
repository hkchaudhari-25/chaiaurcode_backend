import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const healthcheck = asyncHandler(async (req, res) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message

    const response = new ApiResponse(200, { status: "OK" }, "Health check passed successfully consol");
console.log(response); // Should print { statusCode: 200, data: { status: 'OK' }, message: '...', success: true }
    return res
    .status(200)
    .json(
        new ApiResponse(
        200,
        {status : "OK"},
        "Healthcheck passed successfullly"
        ) 
    )
})

export {
    healthcheck
    }