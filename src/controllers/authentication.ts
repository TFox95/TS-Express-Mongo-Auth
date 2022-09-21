import { Request, Response, NextFunction } from "express";
import logging from "../config/logging";
import bcryptjs from "bcryptjs";
import { randomUUID } from "crypto";
import mongoose from "mongoose";
import UserSchema from "../models/UserSchema";
import signJWT from "../functions/signJWT";
import IUser from "../interfaces/User";
import jwtDecode from "jwt-decode";
import MyToken from "../interfaces/Token";

/** setting const variables */
const NAMESPACE = "Authentication CONTROLLER";

/** Defining logic for Authorization */
const validateToken = (req: Request, res: Response, next: NextFunction) => {
    if (req.method == "GET") {
        try {
            logging.serverInfo(NAMESPACE, `Token validated, user authorized`);
            let authtoken, decoded;
            authtoken = req.headers.authorization;

            if (authtoken) {
                decoded = jwtDecode<MyToken>(authtoken);
                return res.status(200).json({
                    message: "Authorized",
                    decoded
                });
            }
        } catch (err: any) {
            logging.serverInfo(NAMESPACE, `Token Error, User cannot be authorized token; Token expired or Invalid`,err);
            res.status(500).json({
                message: err.message
            });

        }
        

        
    } else {
        logging.serverError(NAMESPACE, `Invalid Request Method used; Error`);
        return res.status(400).json({
            message: "Not Authorized"
        });
    }
};

const registerController = (req: Request, res: Response, next: NextFunction) => {
    /** Checking if requested method is "POST" */
    if (req.method == "POST") {
        let { username, password, re_password } = req.body as IUser;

        /** Here we'll be checking if the password and re_password match each other
         *  if they do then we will proceed to hash the password. If there's an hash
         * error return status code 500 else inject our User into the Mongodb
         */
        if (password === re_password) {
            bcryptjs.hash(password, 10, (hashErr, hash) => {
                if (hashErr) {
                    return res.status(500).json({
                        message: hashErr.message,
                        error: hashErr
                    });
                }
                const v4UUID = `user_${randomUUID()}`
                const _user = new UserSchema({
                    _id: new mongoose.Types.ObjectId(),
                    uuid: v4UUID,
                    username,
                    password: hash,
                    role: "basic",
                    validated: false,
                    phone: null,
                    address: null,
                    subscribed: null
                });
                UserSchema
                    .findOne({ username: req.body.username })
                    .exec()
                    .then((user) => {
                        if (!user) {
                            return _user
                                .save()
                                .then((user) => {
                                    logging.serverInfo(NAMESPACE, `Attempt to Create user is successful`, user);
                                    return res.status(201).json({
                                        message: `User Created, [${user}]`
                                    });
                                })
                                .catch((error) => {
                                    logging.serverInfo(NAMESPACE, `Attempt to Create user is unsuccessful`, error);
                                    return res.status(500).json({
                                        message: error.message,
                                        error
                                    });
                                });
                        } else if (user) {
                            logging.serverInfo(NAMESPACE, `Attempt to Create user is unsuccessful`);
                            return res.status(409).json({
                                message: `User Exists`
                            });
                        }
                    })
                    .catch((error) => {
                        logging.serverInfo(NAMESPACE, `Attempt to Create user is unsuccessful`, error);
                        return res.status(500).json({
                            message: error.message,
                            error
                        });
                    });
            });
        } else {
            return res.status(500).json({
                message: `both passwords do not match; Check again.`
            });
        }
    } else {
        logging.serverError(NAMESPACE, `Sample health check failed, Incorrect Method`);
        return res.status(400).json({
            message: "error"
        });
    }
};

const loginController = (req: Request, res: Response, next: NextFunction) => {
    if (req.method == "POST") {
        let { username, password } = req.body;

        UserSchema.find({ username })
            .exec()
            .then((users) => {
                if (users.length !== 1) {
                    return res.status(401).json({
                        message: "Unathorized"
                    });
                } else {
                    bcryptjs.compare(password, users[0].password, (error, result) => {
                        if (error) {
                            logging.serverError(NAMESPACE, `${error.message}`, error);

                            return res.status(401).json({
                                message: "Unathorized"
                            });
                        } else if (result) {
                            signJWT(users[0], (_error, token) => {
                                if (_error) {
                                    logging.serverError(NAMESPACE, `Token Unable to be signed.`, error);

                                    return res.status(401).json({
                                        message: "Unathorized",
                                        error: _error
                                    });
                                } else if (token) {
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
    } else {
        logging.serverError(NAMESPACE, `Sample health check failed, Incorrect Method`);
        return res.status(400).json({
            message: "error"
        });
    }
};

const removeUserontroller = (res: Response, req: Request, next: NextFunction) => {
    let token = req.headers.authorization?.split(" ")[1];

    if (req.method == "POST" && token) {
        logging.serverInfo(NAMESPACE, `Token validated, user authorized`);

        return res.status(200).json({
            message: "Authorized"
        });
    } else {
        logging.serverError(NAMESPACE, `Removing User from Database failed, try again later`);
        return res.status(401).json({
            message: "Removing User from Database failed, try again later"
        });
    }
};

const logoutController = (req: Request, res: Response, next: NextFunction) => {
    if (req.method == "POST") {
        logging.serverInfo(NAMESPACE, `Sample health check route called`);

        return res.status(200).json({
            message: "pong"
        });
    } else {
        logging.serverError(NAMESPACE, `Sample health check failed, Incorrect Method`);
        return res.status(400).json({
            message: "error"
        });
    }
};

const getUsers = (req: Request, res: Response, next: NextFunction) => {
    if (req.method == "GET") {
        UserSchema.find()
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
    } else {
        logging.serverError(NAMESPACE, `Sample health check failed, Incorrect Method`);
        return res.status(400).json({
            message: "error"
        });
    }
};

export default { validateToken, registerController, loginController, logoutController, getUsers, removeUserontroller };
