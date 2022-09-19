import { Response, Request, NextFunction } from "express";
import Joi, { ObjectSchema } from "joi";
import logging from "../config/logging";
import IUser from "../interfaces/User";

const NAMESTAPCE = `JOI Validation`

const VaildateJoi = (schema: ObjectSchema) => {
    return async (Req: Request, Res: Response, Next: NextFunction) => {
        try {

            await schema.validateAsync(Req.body);
            logging.serverInfo(NAMESTAPCE, `Success Data has been validated!`)

            Next();
        } catch (err: any) {
            logging.serverError(NAMESTAPCE, err.message, err)

            return Res.status(422).json({ err })
        }
    };
};



const Schemas = {
    User: {
        createUser: Joi.object<IUser>({
            username: Joi.string().pattern(new RegExp(`^[a-zA-Z0-9-_]{5,25}$`)).required(),
            password: Joi.string().pattern(new RegExp(`^[a-zA-Z0-9_@./#*&-]{7,20}$`)).required(),
            re_password: Joi.string().pattern(new RegExp(`^[a-zA-Z0-9_@./#*&-]{7,20}$`)).required()
        }),
        loginUser: Joi.object<IUser>({
            username: Joi.string().pattern(new RegExp(`^[a-zA-Z0-9-_]{5,25}$`)).required(),
            password: Joi.string().pattern(new RegExp(`^[a-zA-Z0-9_@./#*&-]{7,20}$`)).required(),
        }),
        updateUsername: Joi.object<IUser>({
            username: Joi.string().pattern(new RegExp(`^[a-zA-Z0-9-_]{5,25}$`)).required()
        }),
        changePassword: Joi.object<IUser>({
            old_password: Joi.string().pattern(new RegExp(`^[a-zA-Z0-9_@./#*&-]{7,20}$`)).required(),
            password: Joi.string().pattern(new RegExp(`^[a-zA-Z0-9_@./#*&-]{7,20}$`)).required(),
            re_password: Joi.string().pattern(new RegExp(`^[a-zA-Z0-9_@./#*&-]{7,20}$`)).required(),
        }),
        removeUser: Joi.object<IUser>({
            password: Joi.string().pattern(new RegExp(`^[a-zA-Z0-9./#*&-]{7,20}$`)).required()
        }),
    },
}

export { VaildateJoi, Schemas }