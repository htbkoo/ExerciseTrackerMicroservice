import mongoose from "mongoose";

export type UserModel = mongoose.Document & {
    username: string
};

const userSchema = new mongoose.Schema({
    username: String
}, {timestamps: true});

// export const User: UserType = mongoose.model<UserType>('User', userSchema);
const User = mongoose.model<UserModel>("User", userSchema);
export default User;
