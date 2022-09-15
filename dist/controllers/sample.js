"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = __importDefault(require("../config/logging"));
const sampleHealthCheck = (req, res, next) => {
    const NAMESPACE = "SAMPLE CONTROLLER";
    if (req.method == "GET") {
        logging_1.default.serverInfo(NAMESPACE, `Sample health check route called`);
        return res.status(200).json({
            message: "pong"
        });
    }
    else {
        logging_1.default.serverError(NAMESPACE, `Sample health check failed, Incorrect Method`);
        return res.status(400).json({
            message: "Incorrect Method"
        });
    }
};
exports.default = { sampleHealthCheck };
