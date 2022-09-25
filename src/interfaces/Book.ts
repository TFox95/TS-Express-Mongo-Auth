import mongoose, { Document } from "mongoose";

interface IBook extends Document {
    uuid: string;
    title: string;
    description: string;
    price: number;
    postedBy: {type: mongoose.Schema.Types.ObjectId, ref: `users` };
}

export default IBook;