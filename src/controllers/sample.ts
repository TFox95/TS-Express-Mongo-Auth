import { Request, Response, NextFunction } from "express";
import logging from "../config/logging";

const sampleHealthCheck = (req: Request, res: Response, next: NextFunction) => {
    const NAMESPACE = "SAMPLE CONTROLLER";
    if (req.method == "GET") {
        logging.serverInfo(NAMESPACE, `Sample health check route called`);

        return res.status(200).json({
            message: "pong"
        });
    } else {
        logging.serverError(NAMESPACE, `Sample health check failed, Incorrect Method`);
        return res.status(400).json({
            message: "Incorrect Method"
        });
    }
};

export default { sampleHealthCheck };
