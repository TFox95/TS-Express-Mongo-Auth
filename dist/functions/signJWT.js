"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const logging_1 = __importDefault(require("../config/logging"));
const NAMESPACE = `Auth Sign JWT-Token`;
/** function that inherits IUser for the user parameter and callback that
 *  inherits Error, that's either equal to an Error or null, for error handling
 *  and Token for strings or null handling
 */
const signJWT = (user, callback) => {
    /** setting variables */
    let timeSinceEpoch = new Date().getTime();
    let expireTime = timeSinceEpoch + Number(config_1.default.server.token.expireTime) * 100000;
    let expirationTimeinSeconds = Math.floor(expireTime / 1000);
    logging_1.default.serverInfo(NAMESPACE, `Attempting to sign token for ${user._id}`);
    try {
        jsonwebtoken_1.default.sign({
            username: user.username,
            role: user.role
        }, config_1.default.server.token.secret, {
            issuer: config_1.default.server.token.issuer,
            algorithm: `HS256`,
            expiresIn: expirationTimeinSeconds
        }, 
        /** during jwt callback we will include error and token
         * so that is there's an error we will callback that error
         * while nulling token and if there's no error we will do the
         * opposite.
         */
        (error, token) => {
            if (token) {
                callback(null, token);
            }
            else if (error) {
                callback(error, null);
            }
        });
    }
    catch (error) {
        logging_1.default.serverError(NAMESPACE, error.message, error);
        callback(error, null);
    }
};
exports.default = signJWT;
