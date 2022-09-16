import { Response, Request, NextFunction } from "express";
import logging from "../config/logging";
import jwtDecode from "jwt-decode";
import UserSchema from "../models/UserSchema";
import MyToken from "../interfaces/Token";

const NAMESPACE = `Auth Extracting User`;

const extractUser = (req: Request, res: Response, next: NextFunction) => {
    /** setting variables */
    let authToken, decoded;
    logging.serverInfo(NAMESPACE, `Attempting to decode token for current user`);
    if (req.headers && req.headers.authorization) {
        authToken = req.headers.authorization.split(" ")[1];

        try {
            decoded = jwtDecode<MyToken>(authToken);
            let currentUser = decoded.username;
            UserSchema.find({ currentUser }).deleteOne({}, (error, result) => {
                if (error) {
                    logging.serverError(NAMESPACE, error.message, error);

                    return res.status(500).json({
                        message: "Unacthorized"
                    });
                } else if (result) {
                    res.status(204).json({
                        message: `${currentUser} has been removed from database.`,
                        result
                    });
                }
            });
        } catch (error: any) {
            logging.serverError(NAMESPACE, error.message, error);
            return res.status(500).json({
                message: error.message,
                error: error
            });
        }
    } else {
        logging.serverError(NAMESPACE, `Attempt to decode token for current user failed`);
        return res.status(500).json({
            message: "UnAthorized"
        });
    }
};

export default extractUser;
