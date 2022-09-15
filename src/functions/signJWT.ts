import jwt, { sign } from "jsonwebtoken";
import config from "../config/config";
import logging from "../config/logging";
import IUser from "../interfaces/User";

const NAMESPACE = `Auth Sign JWT-Token`;
/** function that inherits IUser for the user parameter and callback that
 *  inherits Error, that's either equal to an Error or null, for error handling
 *  and Token for strings or null handling
 */
const signJWT = (user: IUser, callback: (error: Error | null, token: string | null) => void): void => {
    /** setting variables */
    let timeSinceEpoch = new Date().getTime();
    let expireTime: number = timeSinceEpoch + Number(config.server.token.expireTime) * 100000;
    let expirationTimeinSeconds = Math.floor(expireTime / 1000);

    logging.serverInfo(NAMESPACE, `Attempting to sign token for ${user._id}`);

    try {
        jwt.sign(
            {
                id: user._id,
                username: user.username,
                role: user.role
            },
            config.server.token.secret,
            {
                issuer: config.server.token.issuer,
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
                } else if (error) {
                    callback(error, null);
                }
            }
        );
    } catch (error: any) {
        logging.serverError(NAMESPACE, error.message, error);
        callback(error, null);
    }
};

export default signJWT;
