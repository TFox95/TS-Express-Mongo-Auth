import { Request, Response, NextFunction } from "express";
import logging from "../config/logging";
import jwt from "jsonwebtoken";
import config from "../config/config";
import redis from "redis";
let JWTR = require("jwt-redis").deafult;

const extractJWTredis = (res: Response, req: Request, next: NextFunction) => {
    let redisClient = redis.createClient();
    redisClient.connect();
};

const NAMESPACE = "Auth Token Extract";

const extractJWT = (req: Request, res: Response, next: NextFunction) => {
    logging.serverInfo(NAMESPACE, `Validating Token`);

    let token = req.headers.authorization?.split(" ")[1];

    if (token) {
        jwt.verify(token, config.server.token.secret, (err, decoded) => {
            if (err) {
                return res.status(500).json({
                    message: err.message,
                    error: err
                });
            }

            res.locals.jwt = decoded;
            next();
        });
    } else {
        return res.status(401).json({
            message: `Unauthorized`
        });
    }
};

export default extractJWT;
