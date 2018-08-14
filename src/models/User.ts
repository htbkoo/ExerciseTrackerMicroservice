import { prop, Typegoose, plugin } from "typegoose";
import uniqueValidator from "mongoose-unique-validator";

export type UserId = string;

@plugin(uniqueValidator, { message: "'{VALUE}' is already in use, expected it to be unique." })
class UserSchema extends Typegoose {
    @prop({required: true})
    userId: UserId;
    @prop({required: true, unique: true})
    username: string;
}

export const User = new UserSchema().getModelForClass(UserSchema);
export default User;