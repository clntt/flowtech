import ProfileLink from "@/components/user/ProfileLink";
import UserAvatar from "@/components/UserAvatar";
import { getUser } from "@/lib/actions/user.action";
import { notFound } from "next/navigation";
import dayjs from "dayjs";
import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User } from "@/database";
import Stats from "@/components/user/Stats";

const Profile = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) throw notFound();

  const loggedInUser = await auth();

  const dbUser = await User.findOne({
    email: loggedInUser?.user?.email,
  });
  const dbUserId = String(dbUser._id);

  const { success, data, error } = await getUser({
    userId: dbUserId,
  });

  console.log(`dbUser: ${dbUser}`);
  console.log(`dbUserId: ${dbUserId}`);
  console.log(`ID: ${id}`);
  console.log(`LOGGEDIN: ${loggedInUser?.user?.email}`);

  if (!success)
    return (
      <div>
        <div className="">{error?.message}</div>
      </div>
    );

  const { user, totalQuestions, totalAnswers } = data!;
  const {
    _id,
    createdAt,
    email,
    name,
    username,
    image,
    portfolio,
    location,
    bio,
  } = user!;

  const dbEmail = User.findOne({ email: email });

  console.log(`dbEmail: ${dbEmail}`);

  return (
    <>
      <section className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-ctart gap-4 lg:flex-row">
          <UserAvatar
            id={_id}
            name={name}
            imageUrl={image}
            className="size-[140px] rounded-full object-cover"
            fallbackClassName="text-6xl font-bold"
          />

          <div className="mt-3">
            <h2 className="">{name}</h2>
            <p>@{username}</p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {portfolio && (
                <ProfileLink
                  imgUrl="/icons/link.svg"
                  href={portfolio}
                  title="Portfolio"
                />
              )}

              {location && (
                <ProfileLink imgUrl="/icons/location.svg" title="location" />
              )}

              <ProfileLink
                imgUrl="/icons/calendar.svg"
                title={dayjs(createdAt).format("MMMM YYYY")}
              />
            </div>

            {bio && <p className="mt-8">{bio}</p>}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          {loggedInUser?.user?.id === id && (
            <Link href="/profile/edit">
              <Button>Edit Profile</Button>
            </Link>
          )}
        </div>
      </section>

      <Stats
        totalQuestions={totalQuestions}
        totalAnswers={totalAnswers}
        badges={{
          GOLD: 0,
          SILVER: 0,
          BRONZE: 0,
        }}
      />
    </>
  );
};

export default Profile;
