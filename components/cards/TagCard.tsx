// import ROUTES from "@/constants/routes";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import { getDeviconClassName } from "@/lib/utils";
import Image from "next/image";

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
      <Link href={""} className="flex justify-between gap-2 " key={_id}></Link>
    );
  }
};

export default TagCard;
