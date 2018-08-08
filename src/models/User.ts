import { prop, Typegoose } from "typegoose";

export type UserId = string;

class UserSchema extends Typegoose {
    @prop({required: true, unique: true})
    userId: UserId;
    @prop({required: true})
    username: string;
}

export const User = new UserSchema().getModelForClass(UserSchema);
export default User;