import UserCard from "@/components/cards/UserCard";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/routes";
import { EMPTY_USERS } from "@/constants/states";
import { getUsers } from "@/lib/actions/user.action";
import React from "react";

const Community = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getUsers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });
  return (
    <div>
      <h1 className="">All Users</h1>

      <div className="mt-11">
        <LocalSearch
          // key={}
          imgSrc="/icons/search.svg"
          placeholder=""
          route={ROUTES.COMMUNITY}
          iconPosition="left"
          otherClasses="flex-1"
        />
      </div>

      <DataRenderer
        success={success}
        error={error}
        data={data?.users}
        empty={EMPTY_USERS}
        render={(users) => (
          <div className="mt-12 flex flex-row max-sm:flex-wrap gap-5">
            {users.map((user) => (
              <UserCard key={user._id} {...user} />
            ))}
          </div>
        )}
      />
    </div>
  );
};

export default Community;
