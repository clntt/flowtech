"use server";

import { Answer, Question, User, Vote } from "@/database";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { revalidatePath } from "next/cache";

import {
  CreateVoteSchema,
  HasVotedSchema,
  UpdateVoteCountSchema,
} from "../validations";
import mongoose, { ClientSession } from "mongoose";
import ROUTES from "@/constants/routes";

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
  const Model = targetType === "question" ? Question : Answer;

  try {
    const objectId = new mongoose.Types.ObjectId(targetId);

    const field = voteType === "upvote" ? "upvotes" : "downvotes";
    const result = await Model.findByIdAndUpdate(
      objectId,
      { $inc: { [field]: change } },
      { new: true, session }
    );

    if (!result) {
      return handleError(
        new Error("Failed to update vote count")
      ) as ErrorResponse;
    }

    console.log("Vote count updated");

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

  const sessionUser = validatedResult.session?.user;

  if (!sessionUser) {
    return handleError(new Error("Unauthorized")) as ErrorResponse;
  }

  // ✅ Fetch real Mongo user
  const dbUser = await User.findOne({ email: sessionUser.email });

  if (!dbUser) {
    return handleError(new Error("User not found")) as ErrorResponse;
  }

  const author = dbUser._id;
  const actionId = new mongoose.Types.ObjectId(targetId);

  const session = await mongoose.startSession();
  console.log("Author _id type:", typeof author, author);

  try {
    session.startTransaction();

    const existingVote = await Vote.findOne({
      author,
      actionId,
      actionType: targetType,
    }).session(session);

    if (existingVote) {
      // 🔁 User clicked same vote again → remove vote
      if (existingVote.voteType === voteType) {
        await Vote.deleteOne({ _id: existingVote._id }).session(session);

        await updateVoteCount(
          { change: -1, targetId, targetType, voteType },
          session
        );
      }
      // 🔁 User switched vote type
      else {
        await Vote.findByIdAndUpdate(
          existingVote._id,
          { voteType },
          { new: true, session }
        );

        // remove old vote + add new vote
        await updateVoteCount(
          {
            change: 1,
            targetId,
            targetType,
            voteType,
          },
          session
        );
      }
    } else {
      // ➕ Create new vote
      await Vote.create(
        [
          {
            author,
            actionId,
            actionType: targetType,
            voteType,
          },
        ],
        { session }
      );

      await updateVoteCount(
        {
          change: 1,
          targetId,
          targetType,
          voteType,
        },
        session
      );
    }

    await session.commitTransaction();
    console.log("Transaction committed");

    revalidatePath(ROUTES.QUESTION(targetId));

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function hasVoted(
  params: HasVotedParams
): Promise<ActionResponse<HasVotedResponse>> {
  const validatedResult = await action({
    params,
    schema: HasVotedSchema,
    authorize: true,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const sessionUser = validatedResult.session?.user;

  if (!sessionUser) {
    return handleError(new Error("Unauthorized")) as ErrorResponse;
  }

  // Fetch Mongo user by email
  const dbUser = await User.findOne({ email: sessionUser.email });

  if (!dbUser) {
    return handleError(new Error("User not found")) as ErrorResponse;
  }
  const { targetId, targetType } = params;

  const author = dbUser._id;
  const actionId = new mongoose.Types.ObjectId(targetId);

  // const userId = validatedResult?.session?.user?.id;

  try {
    const vote = await Vote.findOne({
      author,
      actionId,
      actionType: targetType,
    });

    if (!vote) {
      return {
        success: false,
        data: { hasUpvoted: false, hasDownvoted: false },
      };
    }

    return {
      success: true,
      data: {
        hasUpvoted: vote.voteType === "upvote",
        hasDownvoted: vote.voteType === "downvote",
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
