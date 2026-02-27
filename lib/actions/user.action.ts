"use server";

import { FilterQuery } from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { GetUserSchema, PaginatedSearchParamsSchema } from "../validations";
import { Answer, Question, User } from "@/database";
import { toast } from "sonner";

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
    user: typeof User;
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

  try {
    const user = await User.findById(userId);

    const totalQuestions = await Question.countDocuments({ author: user });
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
