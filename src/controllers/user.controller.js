import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {uploadOnCloudinary } from "../utils/couldinary.js"

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

    const {fullName, email, username, password } = req.body;
    console.log("email: ", email);

    if(
        [fullName, email, username, password].some((field) => 
        field?.trim()  === "")
    ) {
        throw new ApiError(400, "All fields are required!")
    }

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath =  req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0 ) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required!")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    console.log(coverImage);

    if(!avatar) {
        throw new ApiError(400, "Avatar field is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registring a user!")
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )
})


export {registerUser}