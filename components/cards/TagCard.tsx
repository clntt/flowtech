import ROUTES from "@/constants/routes";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import { getDeviconClassName } from "@/lib/utils";

interface Props {
  _id: string;
  questions: number;
  name: string;
  showCount?: boolean;
  compact?: boolean;
}

const TagCard = ({ _id, questions, name, showCount, compact }: Props) => {
  const iconName = getDeviconClassName(name);
  return (
    <Link href={""} className="flex justify-between gap-2 " key={_id}>
      <Badge className="rounded-md border-none px-4 py-2 uppercase font-thin text-gray-300 bg-gray-900  text-xs">
        <div className="flex-center space-x-2">
          <i className={`${iconName} text-sm`}></i>
          <span className="">{name}</span>
        </div>
      </Badge>

      {showCount && <p className="text-[10px] text-gray-300">{questions}</p>}
    </Link>
  );
};

export default TagCard;
