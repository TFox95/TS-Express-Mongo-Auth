import mongoose, { Schema } from "mongoose";
import IBook from "../interfaces/Book";

const BookSchema: Schema = new Schema(
    {
        uuid: {type:String, required: true},
        title: {type:String, required: true},
        description: {type:String, required: true},
        price: {type:Number, required: true},
        postedBy: {type:String, required: true}
    },
    {
        timestamps: true,
        versionKey: true
    }
);

export default mongoose.model<IBook>("Books", BookSchema)