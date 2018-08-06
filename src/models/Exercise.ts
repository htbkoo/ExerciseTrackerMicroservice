import { prop, Typegoose } from "typegoose";
import * as mongoose from "mongoose";

class ExerciseSchema extends Typegoose {
    @prop({required: true, unique: true})
    userId: string;
    @prop({required: true})
    description: string;
    @prop({required: true})
    duration: number;
    @prop({})
    date?: Date;
}

type Exercise = ExerciseSchema & mongoose.Document;
export const ExerciseModel = new ExerciseSchema().getModelForClass(ExerciseSchema);
export default Exercise;