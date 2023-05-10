const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");

require('dotenv').config()

const {SECRET_KEY} = process.env;

const {User} =require("../models/users");

const {HttpError, ctrlWrapper} = require("../helpers");

const register = async(req,res,next)=>{
    const {email,password} = req.body;

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);

    const user = await User.findOne({email});
    
    if(user){
        throw HttpError(409,"Email already in use") 
    }
    
    const newUser =
        await User.create({ ...req.body, password: hashPassword, avatarURL });

    res.status(201).json({
        email: newUser.email,
        password: newUser.password,
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

module.exports = {
    register:ctrlWrapper(register),
    login:ctrlWrapper(login),
    getCurrent:ctrlWrapper(getCurrent),
    logout:ctrlWrapper(logout)
}