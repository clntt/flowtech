import ROUTES from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import TagCard from "../cards/TagCard";

const RightSidebar = () => {
  const hotQuestions = [
    { _id: "1", title: "How to be better with Next.Js" },
    { _id: "2", title: "How to be better with mongoDb" },
  ];

  const popularTags = [
    { _id: "1", name: "react", questions: 100 },
    { _id: "2", name: "mongodb", questions: 10 },
  ];

  return (
    <section className="bg-gray-800 pt-36 sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 max-xl:hidden text-white">
      <div className="">
        <h3 className="font-bold">Top Questions</h3>

        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map(({ _id, title }) => (
            <Link
              href={""}
              key={_id}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="font-light">{title}</p>

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
      </div>

      <div className="pt-36">
        <h3 className="">Poplar Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map(({ _id, name, questions }) => (
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
      </div>
    </section>
  );
};

export default RightSidebar;
