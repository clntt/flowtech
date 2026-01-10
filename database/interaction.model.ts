// import { model, models, Schema, Types } from "mongoose";

// export interface IInteraction {
//   user: Types.ObjectId;
//   action: string;
//   actionId: Types.ObjectId;
//   actionType: "question" | "answer";
// }

// export const InteractionSchema = new Schema<IInteraction>(
//   {
//     user: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     action: { type: String, required: true },
//     actionId: { type: Schema.Types.ObjectId, required: true },
//     actionType: { type: String, enum: ["question", "answer"], required: true },
//   },
//   { timestamps: true }
// );

// export const Interaction =
//   models?.Interaction || model<IInteraction>("Interaction", InteractionSchema);

// export default Interaction;

import { Schema, models, model, Types, Document } from "mongoose";

export interface IInteraction {
  user: Types.ObjectId;
  action: string;
  actionId: Types.ObjectId;
  actionType: string;
}

export interface IInteractionDoc extends IInteraction, Document {}
const InteractionSchema = new Schema<IInteraction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true }, // 'upvote', 'downvote', 'view', 'ask_question',
    actionId: { type: Schema.Types.ObjectId, required: true }, // 'questionId', 'answerId',
    actionType: { type: String, enum: ["question", "answer"], required: true },
  },
  { timestamps: true }
);

const Interaction =
  models?.Interaction || model<IInteraction>("Interaction", InteractionSchema);

export default Interaction;
