"use server";

import { Answer, Question, Vote } from "@/database";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { CreateVoteSchema, UpdateVoteCountSchema } from "../validations";
import mongoose, { ClientSession } from "mongoose";

export async function updateVoteCount(
  params: UpdateVoteCountParams,
  session?: ClientSession
): Promise<ActionResponse> {
  const validatedResult = await action({
    params,
    schema: UpdateVoteCountSchema,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { targetId, targetType, voteType, change } = params;
  const Model = targetType === "answer" ? Question : Answer;

  try {
    const result = await Model.findByIdAndUpdate(
      targetId,
      { $inc: { [voteType]: change } },
      { new: true, session }
    );

    if (!result) handleError(new Error("Failed to update vote count"));

    return { success: true, data: result };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function createVote(
  params: CreateVoteParams
): Promise<ActionResponse> {
  const validatedResult = await action({
    params,
    schema: CreateVoteSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { targetId, targetType, voteType } = params;
  const userId = validatedResult.session?.user?.id;

  if (!userId) handleError(new Error("Unauthorized")) as ErrorResponse;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingVote = await Vote.findOne({
      author: userId,
      actionId: targetId,
      actionType: targetType,
    }).session(session);

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        await Vote.deleteOne({ _id: existingVote._id }).session(session);
        await updateVoteCount(
          { change: -1, targetId, targetType, voteType },
          session
        );
      } else {
        await Vote.findByIdAndUpdate(
          existingVote._id,
          { voteType },
          { new: true, session }
        );
        await updateVoteCount({ change: 1, targetId, targetType, voteType });
      }
    } else {
      await Vote.create([{ targetId, targetType, voteType, change: 1 }], {
        session,
      });
      await updateVoteCount(
        { change: 1, targetId, targetType, voteType },
        session
      );
    }

    await session.commitTransaction();
    session.endSession();

    return { success: true };
  } catch (error) {
    session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
