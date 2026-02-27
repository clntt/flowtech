import ROUTES from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import TagCard from "../cards/TagCard";
import { getHotQuestions } from "@/lib/actions/question.action";
import DataRenderer from "../DataRenderer";
import { EMPTY_QUESTION, EMPTY_TAGS } from "@/constants/states";
import { getTopTags } from "@/lib/actions/tag.actions";

const RightSidebar = async () => {
  const [
    { success, data: hotQuestions, error },
    { success: popularTagsSuccess, data: popularTags, error: popularTagsError },
  ] = await Promise.all([getHotQuestions(), getTopTags()]);

  return (
    <section className="bg-gray-800 pt-36 sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 max-xl:hidden text-white">
      <div className="">
        <h3 className="font-bold">Top Questions</h3>

        <DataRenderer
          data={hotQuestions}
          error={error}
          empty={EMPTY_QUESTION}
          success={success}
          render={(hotQuestions) => (
            <div className="mt-7 flex w-full flex-col gap-[30px]">
              {hotQuestions.map(({ _id, title }) => (
                <Link
                  href={ROUTES.QUESTION(_id)}
                  key={_id}
                  className="flex cursor-pointer items-center justify-between gap-7"
                >
                  <p className="font-light line-clamp-2">{title}</p>

                  <Image
                    src="/icons/chevron-right.svg"
                    alt="Chevron-right"
                    width={20}
                    height={20}
                    className=""
                  />
                </Link>
              ))}
            </div>
          )}
        />
      </div>

      <div className="pt-36">
        <h3 className="">Poplar Tags</h3>

        <DataRenderer
          data={popularTags}
          error={popularTagsError}
          empty={EMPTY_TAGS}
          success={popularTagsSuccess}
          render={(popularTags) => (
            <div className="mt-7 flex flex-col gap-4">
              {popularTags?.map(({ _id, name, questions }) => (
                <TagCard
                  key={_id}
                  _id={_id}
                  questions={questions}
                  name={name}
                  compact
                  showCount
                />
              ))}
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default RightSidebar;
