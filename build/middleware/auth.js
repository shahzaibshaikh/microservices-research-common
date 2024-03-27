"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
var SECRET_KEY = process.env.SECRET_KEY;
function auth(req, res, next) {
    var authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({
            message: "No Authorization Header"
        });
    }
    try {
        var token = authorization.split("Bearer ")[1];
        if (!token) {
            return res.status(401).json({
                message: "Invalid Token Format"
            });
        }
        if (!SECRET_KEY) {
            throw new Error("Secret key not provided");
        }
        var decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            return res.status(401).json({
                message: "Session Expired",
                error: error.message
            });
        }
        if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            return res.status(401).json({
                message: "Invalid Token",
                error: error.message
            });
        }
        res.status(500).json({
            message: "Internal server Error",
            error: error.message
        });
    }
}
exports.default = auth;
