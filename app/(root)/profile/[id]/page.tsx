import ProfileLink from "@/components/user/ProfileLink";
import UserAvatar from "@/components/UserAvatar";
import {
  getUser,
  getUserAnswers,
  getUserQuestions,
} from "@/lib/actions/user.action";
import { notFound } from "next/navigation";
import dayjs from "dayjs";
import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User } from "@/database";
import Stats from "@/components/user/Stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataRenderer from "@/components/DataRenderer";
import { EMPTY_ANSWERS, EMPTY_QUESTION } from "@/constants/states";
import QuestionCard from "@/components/cards/QuestionCard";
import Pagination from "@/components/Pagination";
import AnswerCard from "@/components/cards/AnswerCard";
const Profile = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;

  const { page, pageSize } = await searchParams;
  if (!id) throw notFound();

  const loggedInUser = await auth();

  const dbUser = await User.findOne({
    email: loggedInUser?.user?.email,
  });
  const dbUserId = String(dbUser._id);

  const { success, data, error } = await getUser({
    userId: dbUserId,
  });

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
    // email,
    name,
    username,
    image,
    portfolio,
    location,
    bio,
  } = user!;

  const {
    success: userQuestionSuccess,
    data: userQuestions,
    error: userQuestionError,
  } = await getUserQuestions({
    userId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
  });

  const {
    success: userAnswerSuccess,
    data: userAnswers,
    error: userAnswerError,
  } = await getUserAnswers({
    userId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
  });

  const { questions, isNext: hasMoreQuestions } = userQuestions!;
  const { answers, isNext: hasMoreAnswers } = userAnswers!;

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

      <section className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-[2]">
          <TabsList className="min-h-[42px] p-1">
            <TabsTrigger value="top-posts">Questions</TabsTrigger>
            <TabsTrigger value="answers">Answers</TabsTrigger>
          </TabsList>
          <TabsContent
            value="top-posts"
            className="mt-5 flex w-full flex-col gap-6"
          >
            List of Questions
            <DataRenderer
              data={questions}
              error={userQuestionError}
              empty={EMPTY_QUESTION}
              success={userQuestionSuccess}
              render={(questions) => (
                <div className="mt-7 flex w-full flex-col gap-[30px]">
                  {questions?.map((item) => (
                    <QuestionCard key={item._id} question={item} />
                  ))}
                </div>
              )}
            />
            <Pagination page={page} isNext={hasMoreQuestions} />
          </TabsContent>
          <TabsContent
            value="answers"
            className="mt-5 flex w-full flex-col gap-6"
          >
            List of Answers
            <DataRenderer
              data={answers}
              error={userAnswerError}
              empty={EMPTY_ANSWERS}
              success={userAnswerSuccess}
              render={(answers) => (
                <div className="mt-7 flex w-full flex-col gap-[30px]">
                  {answers?.map((item) => (
                    <AnswerCard
                      key={item._id}
                      {...item}
                      content={item.content.slice(0, 27)}
                      containerClasses="rounded-[10px] px-7 py-9 sm:px-11"
                      showReadMore
                    />
                  ))}
                </div>
              )}
            />
            <Pagination page={page} isNext={hasMoreAnswers} />
          </TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>

        <div className="flex w-full min-w-[250px] flex-1 flex-col max-lg:hidden">
          <h3>Top Tech</h3>
          <div className="mt-7 flex flex-col gap-4">
            <p>List of Tags</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
