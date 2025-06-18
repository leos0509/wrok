"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_1 = require("../utils/response");
const authenticate = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        (0, response_1.sendError)(res, "No token provided", 401);
        return;
    }
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("JWT secret is not defined");
            (0, response_1.sendError)(res, "Internal server error", 500);
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        console.error("Authentication error:", error);
        (0, response_1.sendError)(res, "Invalid token", 401, error);
        return;
    }
};
exports.authenticate = authenticate;
