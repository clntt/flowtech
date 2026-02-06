"use server";

import Answer, { IAnswerDoc } from "@/database/answer.model";
import action from "../handlers/action";
import { AnswerServerSchema } from "../validations";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import { Question, User } from "@/database";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/routes";

export async function createAnswer(
  params: CreateAnswerParams
): Promise<ActionResponse<IAnswerDoc>> {
  const validatedResult = await action({
    params,
    schema: AnswerServerSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { content, questionId } = params;
  //   const userId = validatedResult?.session?.user?.id;

  const sessionUser = validatedResult?.session?.user;
  const mongoUser = await User.findOne({ email: sessionUser?.email });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId);

    if (!question) throw new Error("No Question found");

    const [newAnswer] = await Answer.create(
      [
        {
          author: mongoUser,
          question: questionId,
          content,
        },
      ],
      { session }
    );

    if (!newAnswer) throw new Error("failed to to create answer");

    question.answers += 1;
    await question.save({ session });

    await session.commitTransaction();

    revalidatePath(ROUTES.QUESTION(questionId));

    return { success: true, data: JSON.parse(JSON.stringify(newAnswer)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
