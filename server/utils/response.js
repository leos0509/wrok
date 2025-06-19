"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, data, message = "OK", statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};
exports.sendSuccess = sendSuccess;
const sendError = (res, message, statusCode = 400, error = undefined) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error,
    });
};
exports.sendError = sendError;
