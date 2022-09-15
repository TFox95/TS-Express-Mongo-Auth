"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = __importDefault(require("../config/logging"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const UserSchema_1 = __importDefault(require("../models/UserSchema"));
const NAMESPACE = `Auth Extracting User`;
const extractUser = (req, res, next) => {
    /** setting variables */
    let authToken, decoded;
    logging_1.default.serverInfo(NAMESPACE, `Attempting to decode token for current user`);
    if (req.headers && req.headers.authorization) {
        authToken = req.headers.authorization.split(" ")[1];
        try {
            let decodedToken = (0, jwt_decode_1.default)(authToken), currentUser = decodedToken.username;
            UserSchema_1.default.find({ currentUser }).deleteOne({}, (error, result) => {
                if (error) {
                    logging_1.default.serverError(NAMESPACE, error.message, error);
                    return res.status(500).json({
                        message: "Unacthorized"
                    });
                }
                else if (result) {
                    res.status(204).json({
                        message: `${currentUser} has been removed from database.`,
                        result
                    });
                }
            });
        }
        catch (error) {
            logging_1.default.serverError(NAMESPACE, error.message, error);
            return res.status(500).json({
                message: error.message,
                error: error
            });
        }
    }
    else {
        logging_1.default.serverError(NAMESPACE, `Attempt to decode token for current user failed`);
        return res.status(500).json({
            message: "UnAthorized"
        });
    }
};
exports.default = extractUser;
