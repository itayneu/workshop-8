module.exports = function errorHandler(err, req, res, next) {
    console.log("Received error", err.message);
    if(res.headersSent){
        return next(err)
    }
    let status = err.statusCode || 500;
    res.status(status).json({
        "status": status,
        "error": `${err.message || "Something went wrong"}`
    });
};