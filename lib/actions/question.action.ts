"use server";

import Question from "@/database/question.model";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { AskQuestionSchema } from "../validations";
import mongoose from "mongoose";
import Tag from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";
import User from "@/database/user.model";

export async function createquestion(
  params: CreateQuestionParams
): Promise<ActionResponse<Question>> {
  const validatedResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { title, content, tags } = validatedResult.params!;
  // const userId = validatedResult?.session?.user?.id;
  const authUserId = validatedResult?.session?.user?.id;
  const email = validatedResult?.session?.user?.email;

  if (!authUserId || !email) throw new Error("Not authenticated");

  const session = await mongoose.startSession();
  session.startTransaction();

  const user = await User.findOneAndUpdate(
    {
      $or: [
        { authId: authUserId }, // preferred
        { email }, // fallback for old users
      ],
    },
    {
      $setOnInsert: {
        authId: authUserId,
        email,
        name: validatedResult.session?.user?.name,
        image: validatedResult.session?.user?.image,
        username: email.split("@")[0],
        reputation: 0,
      },

      // 👇 ensure old users get linked to authId
      $set: {
        // authId: authUserId,
        // email,
      },
    },
    { new: true, upsert: true, session }
  );

  if (!user) throw new Error("User not found");

  try {
    const [question] = await Question.create(
      [{ title, content, author: user._id }],
      { session }
    );

    if (!question) {
      throw new Error("Failed to create question");
    }

    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { upsert: true, new: true, session }
      );
      tagIds.push(existingTag._id);
      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: question._id,
      });
    }

    await TagQuestion.insertMany(tagQuestionDocuments, { session });

    await Question.findByIdAndUpdate(
      question._id,
      { $push: { tags: { $each: tagIds } } },
      { session }
    );

    await session.commitTransaction();
    console.log("User schema paths:", Object.keys(User.schema.paths));

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
