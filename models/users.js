const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { handleMongooseError } = require("../helpers");


const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: [true, 'Set password for user'],
    },
    email: {
        type: String,
        match: emailRegexp,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
        default: " "
    },
    avatarURL:{
      type: String,
      required: true,  
    }

},  { versionKey: false, timeseries: true })

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    subscription: Joi.string(),
    token: Joi.string()
});

const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),

});

const schemas = {
    registerSchema,
    loginSchema,
}

const User = model("user", userSchema);


module.exports = { 
    schemas, 
    User, }
//-----