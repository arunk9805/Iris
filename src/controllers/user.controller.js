import { asyncHandler } from "../utils/asyncHandler.js";


const registerUser = asyncHandler( async (req, res)=> {
    // steps:
    // 1. get user details from frontend
    // 2. validation - not empty
    // 3. check if user already exists on database - username, email
    // 4. check for image, coverImage
    // 5. uplaod them to cloudinary
    // 6. create user object - create entry in database
    // 7. remove password and refresh token from response
    // 8. send response
})


export {registerUser}