// import ROUTES from "@/constants/routes";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import { cn, getDeviconClassName, getTechDescription } from "@/lib/utils";
import Image from "next/image";
import ROUTES from "@/constants/routes";

interface Props {
  _id: string;
  questions?: number;
  name: string;
  showCount?: boolean;
  compact?: boolean;
  isButton?: boolean;
  remove?: boolean;
  handleRemove?: () => void;
}

const handleClick = (e: React.MouseEvent) => {
  e.preventDefault();
};

const TagCard = ({
  _id,
  questions,
  name,
  showCount,
  compact,
  isButton,
  remove,
  handleRemove,
}: Props) => {
  const iconName = getDeviconClassName(name);
  const iconDescription = getTechDescription(name);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const Content = (
    <>
      <Badge className="rounded-md border-none px-4 py-2 uppercase  text-gray-300 bg-gray-700  text-[10px] flex flex-row gap-2">
        <div className="flex-center space-x-2">
          <i className={`${iconName} text-sm`}></i>
          <span className="">{name}</span>
        </div>

        {remove && (
          <Image
            src="/icons/close.svg"
            alt="closem icon"
            width={12}
            height={12}
            className="cursor-pointer object-contain"
            onClick={handleRemove}
          />
        )}
      </Badge>

      {showCount && <p className="text-[10px] text-gray-300">{questions}</p>}
    </>
  );

  if (compact) {
    return isButton ? (
      <button onClick={handleClick} className="flex justify-between gap-2">
        {Content}
      </button>
    ) : (
      <Link href={ROUTES.TAG(_id)} className="flex justify-between gap-2">
        {Content}
      </Link>
    );
  }

  return (
    <Link href={ROUTES.TAG(_id)} className="">
      <article className="flex flex-col rounded-2xl border px-8 py-10 sm:w-[260px] bg-gray-800 text-white">
        <div className="flex items-center justify-between gap-3">
          <div className="w-fit rounded-sm px-5 py-1.5 bg-gray-600">
            <p className="">{name}</p>
          </div>
          <i className={cn(iconName, "text-2xl")} aria-hidden="true" />
        </div>

        <p className="mt-5 line-clamp-3 w-full">{iconDescription}</p>

        <p className="mt-3.5 text-gray-500">
          <span className="mr-2.5 text-orange-400">{questions}+</span>
          Questions
        </p>
      </article>
    </Link>
  );
};

export default TagCard;
