import { prop, Typegoose } from "typegoose";
import { UserId } from "./User";

class ExerciseSchema extends Typegoose {
    @prop({required: true})
    userId: UserId;
    @prop({required: true})
    description: string;
    @prop({required: true})
    duration: number;
    @prop({required: true})
    date?: string;
}

export const Exercise = new ExerciseSchema().getModelForClass(ExerciseSchema);
export default Exercise;