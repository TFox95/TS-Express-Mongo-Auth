import mongoose, { Document } from "mongoose";

interface IUser extends Document {
    uuid: string;
    username: string;
    password: string;
    re_password?: string;
    old_password?: string;
    role: string;
    validated: boolean;
    phone?: number;
    address?: string;
    subscribed?: boolean;
    Books?: {type: mongoose.Types.ObjectId, ref: `books`}
}

export default IUser;
