import { Response, Request, NextFunction } from "express";
import Joi, { ObjectSchema } from "joi";
import logging from "../config/logging";
import IUser from "../interfaces/User";

const NAMESTAPCE = `JOI Validation`

const VaildateJoi = (schema: ObjectSchema) => {
    return async (Res: Response, Req: Request, Next: NextFunction) => {
        try {
            await schema.validateAsync(Req.body);

            Next();
        } catch (err: any) {
            logging.serverError(NAMESTAPCE, err.message, err)

            return Res.status(422).json({
                message: err
            })
        }
    };
};

const Schemas = {
    UserData: Joi.object<IUser>({
        username: Joi.string().pattern(new RegExp(`^[a-zA-Z0-9-_]{6,25}$`)).required(),
        password: Joi.string().pattern(new RegExp(`^[a-zA-Z0-9_@./#&-]{7,20}$`)).required(),
        }),
    BookData: Joi.object({

    })
}

export {VaildateJoi, Schemas}