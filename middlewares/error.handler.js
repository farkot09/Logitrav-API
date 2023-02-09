const errorHandler = (error, statusCode, message, data) => {
    return {
        error,
        statusCode,
        message,
        img_statusCode:`https://http.cat/${statusCode}`,
        data
    }
};


module.exports = { errorHandler };
