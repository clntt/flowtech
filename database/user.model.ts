// import { model, models, Schema } from "mongoose";

// export interface IUser {
//   name: string;
//   username: string;
//   email: string;
//   bio?: string;
//   image: string;
//   location?: string;
//   portfolio?: string;
//   reputation?: number;
// }

// const UserSchema = new Schema(
//   {
//     name: { type: String, required: true },
//     username: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     bio: { type: String },
//     image: { type: String, required: true },
//     location: { type: String },
//     portfolio: { type: String },
//     reputation: { type: Number, default: 0 },
//   },
//   { timestamps: true }
// );

// const User = models?.user || model<IUser>("User", UserSchema);

// export default User;

import { Schema, models, model, Document } from "mongoose";

export interface IUser {
  authId: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
}

export interface IUserDoc extends IUser, Document {}
const UserSchema = new Schema<IUser>(
  {
    authId: {
      type: String,
      required: true,
      unique: true,
      index: true, // 👈 fast lookups from session
    },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    image: { type: String },
    location: { type: String },
    portfolio: { type: String },
    reputation: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = models?.User || model<IUser>("User", UserSchema);

export default User;
