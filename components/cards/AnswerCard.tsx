import React, { Suspense } from "react";
import UserAvatar from "../UserAvatar";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import { cn, timeAgo } from "@/lib/utils";
import Preview from "../editor/Preview";
import Votes from "../votes/Votes";
import { hasVoted } from "@/lib/actions/votes.action";

interface Props extends Answer {
  containerClasses?: string;
  showReadMore?: boolean;
}
const AnswerCard = async ({
  _id,
  author,
  content,
  createdAt,
  downvotes,
  upvotes,
  question,
  containerClasses,
  showReadMore = false,
}: Props) => {
  const hasVotedPromise = await hasVoted({
    targetId: _id,
    targetType: "answer",
  });

  return (
    <article className={cn("border-b py-10", containerClasses)}>
      <span id={`answer-${_id}`} />

      <div className="mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex flex-1 items-start gap-1 sm:items-center">
          <UserAvatar
            id={author._id}
            name={author.name}
            imageUrl={author.image}
            className="size-5 rounded-full object-cover max-sm:mt-2"
          />

          <Link
            href={ROUTES.PROFILE(author._id)}
            className="flex flex-col sm:flex-row sm:items-center max-sm:ml-1"
          >
            <p className="">{author.name}</p>

            <p className="ml-0.5 mt-0.5 line-clamp-1">
              <span className="max-sm:hidden"> • </span>
              answered {timeAgo(createdAt)}
            </p>
          </Link>
        </div>
        <div className="flex justify-end">
          <Suspense fallback={<div>Loading...</div>}>
            <Votes
              targetId={_id}
              targetType="answer"
              upvotes={upvotes}
              downvotes={downvotes}
              hasVotedData={hasVotedPromise.data}
            />
            {/* <p>Votes</p> */}
          </Suspense>
        </div>
      </div>

      <Preview content={content} />

      {showReadMore && (
        <Link
          href={`/questions/${question}#answer-${_id}`}
          className="relative z-10 text-amber-500"
        >
          <p className="mt-4">Read more...</p>
        </Link>
      )}
    </article>
  );
};

export default AnswerCard;
