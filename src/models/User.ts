import { prop, Typegoose, plugin } from "typegoose";
import uniqueValidator from "mongoose-unique-validator";
import { ValidationErrors } from "../controllers/common";
import { enableTimestamps } from "./constants";

export type UserId = string;

@plugin(uniqueValidator, {message: ValidationErrors.USERNAME_DUPLICATED})
class UserSchema extends Typegoose {
    @prop({required: true})
    userId: UserId;
    @prop({required: true, unique: true})
    username: string;
}

export const User = new UserSchema().getModelForClass(UserSchema, enableTimestamps);
export default User;