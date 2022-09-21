import http from "http";
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import logging from "./config/logging";
import config from "./config/config";
import sampleRoutes from "./routes/sample";
import authRoutes from "./routes/authentication";

/** Assigning constant variables */
const NAMESPACE = "Server";
const router = express();

/** connect to Mongodb */
mongoose
    .connect(config.database.url, config.database.options)
    .then((result) => {
        logging.serverInfo(NAMESPACE, `Connection to MongoDB: Established`);
    })
    .catch((error) => {
        logging.serverError(NAMESPACE, `${error} || Connection to MongoDB: Failed`);
    });

router.use((req: Request, res: Response, next: NextFunction) => {
    logging.serverInfo(
        NAMESPACE,
        `METHOD - [${req.method}], 
    URL - [${req.url}], IP - [${req.socket.remoteAddress}]`
    );

    res.on("finish", () => {
        if (res.statusCode >= 200 && res.statusCode <= 299) {
            logging.serverInfo(
                NAMESPACE,
                `METHOD - [${req.method}], 
                URL - [${req.url}], IP - [${req.socket.remoteAddress}], 
                STATUS - [${res.statusCode}]`
            );
        } else if (res.statusCode >= 400 && res.statusCode <= 599) {
            logging.serverError(
                NAMESPACE,
                `METHOD - [${req.method}], 
                URL - [${req.url}], IP - [${req.socket.remoteAddress}], 
                STATUS - [${res.statusCode}]`
            );
        } else {
            logging.serverDebug(
                NAMESPACE,
                `METHOD - [${req.method}], 
                URL - [${req.url}], IP - [${req.socket.remoteAddress}], 
                STATUS - [${res.statusCode}]`
            );
        }
    });

    next();
});

/** Parsing the request */
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/**Rules of our API */
router.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type, Accept, Authorization");

    if (req.method == "OPTIONS") {
        res.header("Access-Control-Allow-MEthod", "GET PATCH DELETE POST PUT");
        return res.status(200).json({});
    }

    next();
});

/** Routes */
router.use("/api/sample", sampleRoutes);
router.use("/api/auth", authRoutes);

/** Error Handling */
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(`there is a error a new era ${err.message}`);
    return res.status(400).json({
        message: `${err.message}`,
        err
    });
});

/** Create the Server */
const httpServer = http.createServer(router);
httpServer.listen(config.server.port, () => {
    return logging.serverInfo(NAMESPACE, `Server runnning on ${config.server.hostname}:${config.server.port}/`);
});
