import mongoose from "mongoose";

export type UserId = string;

export type UserModel = mongoose.Document & {
    username: string,
    userId: UserId
};

const userSchema = new mongoose.Schema({
    username: String
}, {timestamps: true});

// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const User = mongoose.model<UserModel>("User", userSchema);
export default User;
