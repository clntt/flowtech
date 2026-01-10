// import { model, models, Schema } from "mongoose";

// export interface ITag {
//   name: string;
//   questions: number;
// }

// export const TagSchema = new Schema({
//   name: { type: String, required: true },
//   questions: { type: Number, default: 0 },
// });

// const Tag = models?.tag || model<ITag>("Tag", TagSchema);

// export default Tag;

import { Schema, models, model, Document } from "mongoose";

export interface ITag {
  name: string;
  questions: number;
}

export interface ITagDoc extends ITag, Document {}
const TagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true, unique: true },
    questions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Tag = models?.Tag || model<ITag>("Tag", TagSchema);

export default Tag;
