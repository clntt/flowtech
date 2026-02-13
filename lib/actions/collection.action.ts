"use server";

import { Collection, Question, User } from "@/database";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { CollectionBaseSchema } from "../validations";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/routes";

export async function toggleSaveQuestion(
  params: CollectionBaseParams
): Promise<ActionResponse<{ saved: boolean }>> {
  const validatedResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { questionId } = params;

  const sessionUser = validatedResult?.session?.user;

  const dbUser = await User.findOne({ email: sessionUser?.email });

  if (!dbUser) {
    return handleError(new Error("User not found")) as ErrorResponse;
  }

  const author = dbUser._id;

  try {
    const question = Question.findById(questionId);
    if (!question) throw new Error("Question not found.");

    const collection = await Collection.findOne({
      author,
      question: questionId,
    });

    if (collection) {
      await Collection.findByIdAndDelete(collection._id);

      revalidatePath(ROUTES.QUESTION(questionId));

      return {
        success: true,
        data: {
          saved: false,
        },
      };
    }

    await Collection.create({ author, question: questionId });

    revalidatePath(ROUTES.QUESTION(questionId));

    return {
      success: true,
      data: { saved: true },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function hasSavedQuestion(
  params: CollectionBaseParams
): Promise<ActionResponse<{ saved: boolean }>> {
  const validatedResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { questionId } = params;

  const sessionUser = validatedResult?.session?.user;

  const dbUser = await User.findOne({ email: sessionUser?.email });

  if (!dbUser) {
    return handleError(new Error("User not found")) as ErrorResponse;
  }

  const author = dbUser._id;

  try {
    const collection = await Collection.findOne({
      question: questionId,
      author,
    });

    return {
      success: true,
      data: {
        saved: !!collection,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
