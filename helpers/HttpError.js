const messageErrorList = {
    400:"Bad request",
    401:"Unauthorized",
    403:"Forbidden",
    404:"Not found",
    409:"Email in use",
}

const HttpError = (status, message=messageErrorList[status]) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

module.exports = HttpError;