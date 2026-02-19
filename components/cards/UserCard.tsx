import React from "react";
import UserAvatar from "../UserAvatar";
import Link from "next/link";
import ROUTES from "@/constants/routes";

const UserCard = ({ _id, name, image, username }: User) => {
  return (
    <div className="w-full xs:w-[230px]">
      <article className="flex w-full flex-col items-center justify-center rounded-2xl  p-8 bg-gray-800">
        <UserAvatar
          id={_id}
          name={name}
          imageUrl={image}
          className="size-[100px] rounded-full object-cover"
          fallbackClassName="text-3xl tracking-widest"
        />

        <Link href={ROUTES.PROFILE(_id)}>
          <div className="mt-4 text-center">
            <h3 className="text-white line-clamp-1">{name}</h3>
            <p className="mt-2 text-gray-500">@{username}</p>
          </div>
        </Link>
      </article>
    </div>
  );
};

export default UserCard;
