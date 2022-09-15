"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = __importDefault(require("../config/logging"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = require("crypto");
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema_1 = __importDefault(require("../models/UserSchema"));
const signJWT_1 = __importDefault(require("../functions/signJWT"));
/** setting const variables */
const NAMESPACE = "Authentication CONTROLLER";
/** Defining logic for Authorization */
const validateToken = (req, res, next) => {
    if (req.method == "POST") {
        logging_1.default.serverInfo(NAMESPACE, `Token validated, user authorized`);
        return res.status(200).json({
            message: "Authorized"
        });
    }
    else {
        logging_1.default.serverError(NAMESPACE, `Invalid Request Method used; Error`);
        return res.status(400).json({
            message: "Not Authorized"
        });
    }
};
const registerController = (req, res, next) => {
    /** Checking if requested method is "POST" */
    if (req.method == "POST") {
        let { username, password, re_password } = req.body;
        /** Here we'll be checking if the password and re_password match each other
         *  if they do then we will proceed to hash the password. If there's an hash
         * error return status code 500 else inject our User into the Mongodb
         */
        if (password === re_password) {
            bcryptjs_1.default.hash(password, 10, (hashErr, hash) => {
                if (hashErr) {
                    return res.status(500).json({
                        message: hashErr.message,
                        error: hashErr
                    });
                }
                const v4UUID = (0, crypto_1.randomUUID)();
                const _user = new UserSchema_1.default({
                    _id: new mongoose_1.default.Types.ObjectId(),
                    uuid: v4UUID,
                    username,
                    password: hash,
                    role: "basic",
                    validated: false,
                    phone: null,
                    address: null,
                    subscribed: null
                });
                logging_1.default.serverError(NAMESPACE, `checking if exists`);
                UserSchema_1.default.findOne({ username: req.body.username })
                    .exec()
                    .then((user) => {
                    if (!user) {
                        console.log(user);
                        return _user
                            .save()
                            .then((user) => {
                            logging_1.default.serverInfo(NAMESPACE, `Attempt to Create user is successful`, user);
                            return res.status(201).json({
                                message: `User Created, [${user}]`
                            });
                        })
                            .catch((error) => {
                            logging_1.default.serverInfo(NAMESPACE, `Attempt to Create user is unsuccessful`, error);
                            return res.status(500).json({
                                message: error.message,
                                error
                            });
                        });
                    }
                    else if (user) {
                        console.log(user);
                        return res.status(401).json({
                            message: `User Exists`
                        });
                    }
                })
                    .catch((error) => {
                    logging_1.default.serverInfo(NAMESPACE, `Attempt to Create user is unsuccessful`, error);
                    return res.status(500).json({
                        message: error.message,
                        error
                    });
                });
            });
        }
        else {
            return res.status(500).json({
                message: `both passwords do not match; Check again.`
            });
        }
    }
    else {
        logging_1.default.serverError(NAMESPACE, `Sample health check failed, Incorrect Method`);
        return res.status(400).json({
            message: "error"
        });
    }
};
const loginController = (req, res, next) => {
    if (req.method == "POST") {
        let { username, password } = req.body;
        UserSchema_1.default.find({ username })
            .exec()
            .then((users) => {
            if (users.length !== 1) {
                return res.status(401).json({
                    message: "Unathorized"
                });
            }
            else {
                bcryptjs_1.default.compare(password, users[0].password, (error, result) => {
                    if (error) {
                        logging_1.default.serverError(NAMESPACE, `${error.message}`, error);
                        return res.status(401).json({
                            message: "Unathorized"
                        });
                    }
                    else if (result) {
                        (0, signJWT_1.default)(users[0], (_error, token) => {
                            if (_error) {
                                logging_1.default.serverError(NAMESPACE, `Token Unable to be signed.`, error);
                                return res.status(401).json({
                                    message: "Unathorized",
                                    error: _error
                                });
                            }
                            else if (token) {
                                res.status(200).json({
                                    message: `Auth Successful`,
                                    token,
                                    user: users[0]
                                });
                            }
                        });
                    }
                });
            }
        })
            .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
    }
    else {
        logging_1.default.serverError(NAMESPACE, `Sample health check failed, Incorrect Method`);
        return res.status(400).json({
            message: "error"
        });
    }
};
const removeUserontroller = (res, req, next) => {
    var _a;
    let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (req.method == "POST" && token) {
        logging_1.default.serverInfo(NAMESPACE, `Token validated, user authorized`);
        return res.status(200).json({
            message: "Authorized"
        });
    }
    else {
        logging_1.default.serverError(NAMESPACE, `Removing User from Database failed, try again later`);
        return res.status(401).json({
            message: "Removing User from Database failed, try again later"
        });
    }
};
const logoutController = (req, res, next) => {
    if (req.method == "POST") {
        logging_1.default.serverInfo(NAMESPACE, `Sample health check route called`);
        return res.status(200).json({
            message: "pong"
        });
    }
    else {
        logging_1.default.serverError(NAMESPACE, `Sample health check failed, Incorrect Method`);
        return res.status(400).json({
            message: "error"
        });
    }
};
const getUsers = (req, res, next) => {
    if (req.method == "GET") {
        UserSchema_1.default.find()
            .select(`-password`)
            .exec()
            .then((users) => {
            return res.status(200).json({
                users,
                count: users.length
            });
        })
            .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
    }
    else {
        logging_1.default.serverError(NAMESPACE, `Sample health check failed, Incorrect Method`);
        return res.status(400).json({
            message: "error"
        });
    }
};
exports.default = { validateToken, registerController, loginController, logoutController, getUsers, removeUserontroller };
