"use server";

import { FilterQuery, PipelineStage, Types } from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  GetUserQuestionsSchema,
  GetUserSchema,
  PaginatedSearchParamsSchema,
} from "../validations";
import { Answer, Question, User } from "@/database";
import { toast } from "sonner";
import { auth } from "@/auth";

export async function getUsers(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ users: User[]; isNext: boolean }>> {
  const validatedResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = params;

  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  const filterQuery: FilterQuery<typeof User> = {};

  if (query) {
    filterQuery.$or = [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ];
  }

  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { reputation: -1 };
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalUsers = await User.countDocuments(filterQuery);
    const users = await User.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalUsers > skip + users.length;

    return {
      success: true,
      data: {
        users: JSON.parse(JSON.stringify(users)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUser(params: GetUserParams): Promise<
  ActionResponse<{
    user: User;
    totalQuestions: number;
    totalAnswers: number;
  }>
> {
  const validatedResult = await action({
    params,
    schema: GetUserSchema,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { userId } = params;

  if (!userId) {
    toast.error("Error", {
      description: "User not Found.",
    });
  }

  if (!Types.ObjectId.isValid(userId)) {
    return {
      success: false,
      error: { message: "Invalid user id" },
    };
  }

  try {
    const user = await User.findById(userId);

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user });

    return {
      success: true,
      data: {
        // totalAnswers: JSON.parse(JSON.stringify(totalAnswers)),
        // totalQuestions: JSON.parse(JSON.stringify(totalQuestions)),
        totalAnswers,
        totalQuestions,
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserQuestions(params: GetUserQuestionsParams): Promise<
  ActionResponse<{
    questions: Question[];
    isNext: boolean;
  }>
> {
  const loggedInUser = await auth();

  const dbUser = await User.findOne({
    email: loggedInUser?.user?.email,
  });

  const dbUserId = String(dbUser._id);
  const validatedResult = await action({
    params,
    schema: GetUserQuestionsSchema,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { userId, page = 1, pageSize = 10 } = params;

  console.log(`USERID :: ${userId}`);
  console.log(`LOGGEDIN FROM SERVER :: ${dbUser}`);
  console.log(`DBUSERID FROM SERVER :: ${dbUserId}`);

  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  try {
    // const totalQuestions = await Question.countDocuments({ author: userId });
    const totalQuestions = await Question.countDocuments({ author: dbUserId });

    const questions = await Question.find({ author: dbUserId })
      .populate("tags", "name")
      .populate("author", "name image")
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: {
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserAnswers(params: GetUserQuestionsParams): Promise<
  ActionResponse<{
    answers: Answer[];
    isNext: boolean;
  }>
> {
  const loggedInUser = await auth();

  const dbUser = await User.findOne({
    email: loggedInUser?.user?.email,
  });

  const dbUserId = String(dbUser._id);
  const validatedResult = await action({
    params,
    schema: GetUserQuestionsSchema,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { userId, page = 1, pageSize = 10 } = params;

  console.log(`USERID :: ${userId}`);
  console.log(`LOGGEDIN FROM SERVER :: ${dbUser}`);
  console.log(`DBUSERID FROM SERVER :: ${dbUserId}`);

  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  try {
    // const totalQuestions = await Question.countDocuments({ author: userId });
    const totalAnswers = await Answer.countDocuments({ author: dbUserId });

    const answers = await Answer.find({ author: dbUserId })
      .populate("author", "_id name image")
      .skip(skip)
      .limit(limit);

    const isNext = totalAnswers > skip + answers.length;

    return {
      success: true,
      data: {
        answers: JSON.parse(JSON.stringify(answers)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserTopTags(params: GetUserTagsParams): Promise<
  ActionResponse<{
    tags: { _id: string; name: string; count: number }[];
  }>
> {
  const loggedInUser = await auth();

  const dbUser = await User.findOne({
    email: loggedInUser?.user?.email,
  });

  const dbUserId = String(dbUser._id);
  const validatedResult = await action({
    params,
    schema: GetUserQuestionsSchema,
  });

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { userId } = params;

  try {
    const pipeline: PipelineStage[] = [
      // { $match: { author: new Types.ObjectId(userId) } },
      // { $match: { author: dbUserId } },
      { $match: { author: new Types.ObjectId(dbUserId) } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "tags",
          localField: "_id",
          foreignField: "_id",
          as: "tagInfo",
        },
      },
      { $unwind: "$tagInfo" },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: "$tagInfo._id",
          name: "$tagInfo.name",
          count: 1,
        },
      },
    ];

    const tags = await Question.aggregate(pipeline);

    return {
      success: true,
      data: {
        tags: JSON.parse(JSON.stringify(tags)),
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
