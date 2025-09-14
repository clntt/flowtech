import ROUTES from "@/constants/routes";
import { timeAgo } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import TagCard from "./TagCard";
import Metric from "../Metric";
interface Props {
  question: Question;
}

const QuestionCard = ({
  question: {
    _id,
    title,
    tags,
    author,
    createdAt,
    upvotes,
    // downvotes,
    views,
    answers,
  },
}: Props) => {
  return (
    <div className="rounded-[10px] p-9 sm:p-11 bg-gray-800 text-white">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="line-clamp-1 flex sm:hidden text-[12px] font-extralight">
            {timeAgo(createdAt)}
          </span>

          <Link href={ROUTES.QUESTION(_id)}>
            <h3 className="sm:font-semibold line-clamp-1 flex-1">{title}</h3>
          </Link>
        </div>
      </div>

      <div className="mt-3.5 flex w-full gap-2">
        {tags.map((tag: Tag) => (
          <TagCard key={tag._id} _id={tag._id} name={tag.name} compact />
        ))}
      </div>

      <div className="flex-between mt-2 w-full flex-wrap gap-3 text-[12px]">
        <Metric
          imgUrl={author.image}
          alt={author.name}
          value={author.name}
          title={` - asked ${timeAgo(createdAt)}`}
          //   href={ROUTES.PROFILE(author._id)}
          textStyles=""
          isAuthor
        />

        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start text-[12px]">
          <Metric
            imgUrl="/icons/like.svg"
            alt="like"
            value={upvotes}
            title=" Votes"
            textStyles=""
          />

          <Metric
            imgUrl="/icons/message.svg"
            alt="answers"
            value={answers}
            title=" Answers"
            textStyles=""
          />

          <Metric
            imgUrl="/icons/eye.svg"
            alt="eye"
            value={views}
            title=" Views"
            textStyles=""
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
