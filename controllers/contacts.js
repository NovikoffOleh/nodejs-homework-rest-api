
const {Contact} = require("../models/contact")

const { HttpError, ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
    const {_id:owner} = req.user;
    const {page=1,limit=10} = req.query;
    const skip = (page-1)*limit;
    const result = await Contact.find({owner},"-__v",{skip,limit}).populate("owner", "email");
    res.json(result)
}

/*const getById = async (req, res) => {
    const { contactId } = req.params;
    console.log(contactId)
    const result = await Contact.findById(contactId);
    if (!result) {
        throw HttpError(404, "Not found")
    }
    res.json(result)
}*/
const getById = async (req, res) => {
    const { contactId } = req.params;
    const {_id:owner} = req.user;
    const result = await Contact.findOne({_id: contactId, owner});
    if (!result) {
        throw HttpError(404, "Not found")
    }
    res.json(result)
}

const add = async (req, res) => {
    const {_id:owner}= req.user;
    const result = await Contact.create({...req.body,owner})
    res.status(201).json(result)

}
/*const deleteById = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndRemove(contactId);
    if (!result) {
        throw HttpError(404, "Not found")
    }
    res.json({ message: "Delete success" })

}*/
const deleteById = async (req, res) => {
    const { contactId } = req.params;
    const {_id:owner} = req.user;
    const result = await Contact.findOneAndRemove({_id: contactId, owner});
    if (!result) {
        throw HttpError(404, "Not found")
    }
    res.json({ message: "Delete success" })
}
/*const updateById = async (req, res) => {
    const { contactId } = req.params;
    const body = req.body
    const result = await Contact.findByIdAndUpdate(contactId, body,{new:true});
    res.json(result)

}*/
const updateById = async (req, res) => {
    const { contactId } = req.params;
    const {_id:owner} = req.user;
    const body = req.body;
    const result = await Contact.findOneAndUpdate({_id: contactId, owner}, body, {new: true});
    res.json(result)
}

/*const updateFavorite = async (req, res) => {

    const { contactId } = req.params;
    const body = req.body
    const result = await Contact.findByIdAndUpdate(contactId, body,{new:true});
    res.json(result)
}*/
const updateFavorite = async (req, res) => {
    const { contactId } = req.params;
    const {_id:owner} = req.user;
    const body = req.body;
    const result = await Contact.findOneAndUpdate({_id: contactId, owner}, body, {new: true});
    res.json(result)
}

module.exports = {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    deleteById: ctrlWrapper(deleteById),
    updateById: ctrlWrapper(updateById),
    updateFavorite:ctrlWrapper(updateFavorite)
}