import { model, models, Schema } from "mongoose";

export interface ITag {
  name: string;
  questions: number;
}

export const TagSchema = new Schema({
  name: { type: String, required: true },
  questions: { type: Number, default: 0 },
});

const Tag = models?.tag || model<ITag>("Tag", TagSchema);

export default Tag;
