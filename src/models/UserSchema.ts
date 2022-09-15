import mongoose, { Schema } from "mongoose";
import IUser from "../interfaces/User";

const UserSchema: Schema = new Schema(
    {
        uuid: { type: String, required: true },
        username: { type: String, required: true },
        password: { type: String, required: true },
        validated: { type: Boolean, required: true },
        phone: { type: Number, required: false },
        address: { type: String, required: false },
        subscribed: { type: Boolean, required: false }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IUser>("Users", UserSchema);
