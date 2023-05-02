const { User } = require("../models/user");

const { ctrlWrapper } = require("../middlewares");
const { HttpError } = require("../helpers/index");

const register = async(req, res) => {
    const newUser = await User.create(req.body);
    res.json({
        name: newUser.name,
        email: newUser.email,
    })
}


module.exports = {
    register: ctrlWrapper(register),
}