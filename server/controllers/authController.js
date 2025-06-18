"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../lib/prisma");
const response_1 = require("../utils/response");
const jwt_1 = require("../utils/jwt");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, firstName, lastName } = req.body;
    // Basic validation
    if (!email || !password || !firstName || !lastName) {
        (0, response_1.sendError)(res, "All fields are required", 400);
        return;
    }
    try {
        // Check if user already exists
        const existingUser = yield prisma_1.prisma.user.findUnique({
            where: { email },
        });
        console.log("Existing user:", existingUser);
        if (existingUser) {
            (0, response_1.sendError)(res, "User already exists", 409);
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create new user
        const newUser = yield prisma_1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
            },
        });
        (0, response_1.sendSuccess)(res, newUser, "User created successfully", 201);
    }
    catch (error) {
        console.error("Error during signup:", error);
        (0, response_1.sendError)(res, "Internal server error", 500, error);
        return;
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Basic validation
    if (!email || !password) {
        (0, response_1.sendError)(res, "Email and password are required", 400);
        return;
    }
    try {
        // Check if user exists
        const user = yield prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            (0, response_1.sendError)(res, "User not found", 404);
            return;
        }
        // Verify password
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            (0, response_1.sendError)(res, "Invalid password", 401);
            return;
        }
        const token = (0, jwt_1.generateToken)({ userId: user.id });
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        // Successful signin
        (0, response_1.sendSuccess)(res, { userWithoutPassword, token }, "Signin successful");
    }
    catch (error) {
        console.error("Error during signin:", error);
        (0, response_1.sendError)(res, "Internal server error", 500, error);
        return;
    }
});
exports.signin = signin;
