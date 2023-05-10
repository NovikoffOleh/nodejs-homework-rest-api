const {Schema,model} = require("mongoose");
const Joi = require("joi");
const {handleMongooseError} = require("../helpers")

const addSchema = Joi.object({
    name:Joi.string().required(),
    email:Joi.string().required(),
    phone:Joi.string().required(),
    favorite:Joi.boolean()
})

const updateSchema = Joi.object().keys({
    name:Joi.string(),
    email:Joi.string(),
    phone:Joi.string(),
    favorite:Joi.boolean(),
  })

const updateFavoriteSchema = Joi.object({
    favorite:Joi.boolean().required(),
})

const contactSchema = new Schema({
    
    name: {
        type: String,
        required: [true, 'First Last'],
    },
    email: {
        type: String,
        required:true,
    },
    phone: {
        type: String,
        required:true,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref:"user",
        required:true,
    }
      
})

const Contact = model("Contact", contactSchema)
const schema = {addSchema,updateSchema,updateFavoriteSchema};
contactSchema.post("save",handleMongooseError)


module.exports = {
    Contact,
    schema,
};