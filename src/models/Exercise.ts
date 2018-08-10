import { prop, Typegoose } from "typegoose";
import { UserId } from "./User";

class ExerciseSchema extends Typegoose {
    @prop({required: true, unique: true})
    userId: UserId;
    @prop({required: true})
    description: string;
    @prop({required: true})
    duration: number;
    @prop({})
    date?: string;
}

export const Exercise = new ExerciseSchema().getModelForClass(ExerciseSchema);
export default Exercise;