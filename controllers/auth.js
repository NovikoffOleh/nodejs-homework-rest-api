const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const {nanoid} = require("nanoid");

require('dotenv').config()

const { SECRET_KEY, BASE_URL } = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const {User} =require("../models/users");

const {HttpError, ctrlWrapper, sendEmail} = require("../helpers");

const register = async(req, res)=> {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if(user){
        throw HttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationCode = nanoid();

    const newUser = await User.create({...req.body, password: hashPassword, avatarURL, verificationCode});
    
    const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}" >Click here to verify your email</a>`,
  };

     try {
         await sendEmail(verifyEmail);
         } catch (error) {
         console.log(error);
         throw HttpError(500, "Failed to send verification email");
    };


    res.status(201).json({
        email: newUser.email,
        name: newUser.name,
    })
}

const login = async(req,res) =>{

    const {email,password} = req.body;

    const user = await User.findOne({email});

    if(!user){
        throw HttpError(401, "Email or password invalid")
    }

    const passwordCompare = await bcrypt.compare(password,user.password)

    if(!passwordCompare){
        throw HttpError(401, "Email or password invalid")
    }

   const payload ={id:user._id}

    const token = jwt.sign(payload,SECRET_KEY, {expiresIn:"23h"});
    await User.findByIdAndUpdate(user._id,{token});
    
    res.json({token,})

}

const getCurrent = async(req,res) => {

    const {email,subscription} = req.user;

    res.json({email,subscription})
}

const logout = async(req,res)=>{
    const {_id} = req;
    await User.findByIdAndUpdate(_id, {token:""});

    res.status(204)
}

/*const updateAvatar = async (req, res) => {
    const {_id} = req.user;
    const { path: tempUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });
    
    res.status(200).json({
       avatarURL,
    })*/
    
const updateAvatar = async (req, res) => {
    const {_id} = req.user;
    const { path: tempUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    
        try { 
    const resultUpload = path.join(avatarsDir, filename);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });
    
    res.status(200).json({
       avatarURL,
    })
    
        } catch (error) {
    await fs.unlink(tempUpload);
    throw HttpError(401, "Not authorized");
  }

}
module.exports = {
    register:ctrlWrapper(register),
    login:ctrlWrapper(login),
    getCurrent:ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
}