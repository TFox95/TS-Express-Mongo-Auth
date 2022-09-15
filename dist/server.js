"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const logging_1 = __importDefault(require("./config/logging"));
const config_1 = __importDefault(require("./config/config"));
const sample_1 = __importDefault(require("./routes/sample"));
const authentication_1 = __importDefault(require("./routes/authentication"));
/** Assigning constant variables */
const NAMESPACE = "Server";
const router = (0, express_1.default)();
/** connect to Mongodb */
mongoose_1.default
    .connect(config_1.default.database.url, config_1.default.database.options)
    .then((result) => {
    logging_1.default.serverInfo(NAMESPACE, `Connection to MongoDB: Established`);
})
    .catch((error) => {
    logging_1.default.serverError(NAMESPACE, `${error} || Connection to MongoDB: Failed`);
});
/** Logging Requests and Responses */
router.use((req, res, next) => {
    /** Logging the Request */
    logging_1.default.serverInfo(NAMESPACE, `METHOD - [${req.method}], 
    URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);
    res.on("finish", () => {
        let statusCode = res.statusCode;
        /** Logging the Response */
        if (statusCode >= 200 && statusCode <= 299) {
            logging_1.default.serverInfo(NAMESPACE, `METHOD - [${req.method}], 
                URL - [${req.url}], IP - [${req.socket.remoteAddress}], 
                STATUS - [${res.statusCode}]`);
        }
        else if (statusCode >= 400 && statusCode <= 50) {
            logging_1.default.serverError(NAMESPACE, `METHOD - [${req.method}], 
                URL - [${req.url}], IP - [${req.socket.remoteAddress}], 
                STATUS - [${res.statusCode}]`);
        }
    });
    next();
});
/** Parsing the request */
router.use(body_parser_1.default.urlencoded({ extended: false }));
router.use(body_parser_1.default.json());
/**Rules of our API */
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type, Accept, Authorization");
    if (req.method == "OPTIONS") {
        res.header("Access-Control-Allow-MEthod", "GET PATCH DELETE POST PUT");
        return res.status(200).json({});
    }
    next();
});
/** Routes */
router.use("/api/sample", sample_1.default);
router.use("/api/auth", authentication_1.default);
/** Error Handling */
router.use((req, res, next) => {
    const error = new Error("not found");
    return res.status(404).json({
        message: error.message
    });
});
/** Create the Server */
const httpServer = http_1.default.createServer(router);
httpServer.listen(config_1.default.server.port, () => {
    return logging_1.default.serverInfo(NAMESPACE, `Server runnning on ${config_1.default.server.hostname}:${config_1.default.server.port}/`);
});
