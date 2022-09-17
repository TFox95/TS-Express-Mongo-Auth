import { Document } from "mongoose";

interface IUser extends Document {
    uuid: string;
    username: string;
    password: string;
    re_password?: string;
    role: string;
    validated: boolean;
    phnoe?: number;
    address?: string;
    subscribed?: boolean;
}

export default IUser;
