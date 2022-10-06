import { Request, Response, NextFunction } from "express";
import logging from "../config/logging";
import {randomUUID} from "crypto"
import mongoose from "mongoose";
import BookSchema from "../models/BookSchema";
import IBook from "../interfaces/Book";
import jwtDecode from "jwt-decode";
import MyToken from "../interfaces/Token";

const NAMESPACE = `Book Controller`

const listUserBooks = (req: Request, res: Response, next: NextFunction) => {

}

const createUserBook = (req: Request, res: Response, next: NextFunction) => {
    if (req.method == "POST" && req.headers.authorization) {
        /** Here we're taking the request's body and assigning the values
         * to Destructured variables which then we clarify the types by labeling
         * the variables as an IBook Interface to ensure the correct types.
         */
        let authToken, decoded;
        let { title, description, price } = req.body as IBook;
        authToken = req.headers.authorization?.split(" ")[1];


        if ( title && description && price) {
            try {
                decoded =jwtDecode<MyToken>(authToken);
                const _book = new BookSchema({
                    _id: new mongoose.Types.ObjectId(),
                    uuid: `book_${randomUUID()}`,
                    title,
                    description,
                    price,
                    postedBy: decoded.uuid
                });
            } catch (err: any) {
                
            }
        } else {

        }
    } else {
        
    }
}

const updateUserBook = (req: Request, res: Response, next: NextFunction) => {

}

const retrieveUserBooks = (req: Request, res: Response, next: NextFunction) => {

}

const removeUserBook = (req: Request, res: Response, next: NextFunction) => {

}

export default { listUserBooks, createUserBook, updateUserBook, retrieveUserBooks, removeUserBook }