"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = __importDefault(require("../config/logging"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const NAMESPACE = "Auth Token Extract";
const extractJWT = (req, res, next) => {
    var _a;
    logging_1.default.serverInfo(NAMESPACE, `Validating Token`);
    let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (token) {
        jsonwebtoken_1.default.verify(token, config_1.default.server.token.secret, (err, decoded) => {
            if (err) {
                return res.status(500).json({
                    message: err.message,
                    error: err
                });
            }
            res.locals.jwt = decoded;
            next();
        });
    }
    else {
        return res.status(401).json({
            message: `Unauthorized`
        });
    }
};
exports.default = extractJWT;
