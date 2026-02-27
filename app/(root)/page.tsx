import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import { HomePageFilters } from "@/components/filters";
import CommonFilter from "@/components/filters/CommonFilter";
import HomeFilter from "@/components/filters/HomeFilter";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/states";
import { getQuestions } from "@/lib/actions/question.action";
import Link from "next/link";

// const questions = [
//   {
//     _id: "1",
//     title: "How to learn React",
//     description: "i want to learn React, can anyone help me?",
//     tags: [
//       { _id: "1", name: "react" },
//       { _id: "2", name: "Javascript" },
//     ],
//     author: {
//       _id: "1",
//       name: "John Doe",
//       image:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV4UlS1Ehv87B7_HRdQWlKz8Jw13A0zxuiuQ&s",
//     },
//     upvotes: 12,
//     downvotes: 0,
//     answers: 3,
//     views: 100,
//     createdAt: new Date("2024-3-4"),
//   },
//   {
//     _id: "2",
//     title: "How to learn Next.Js",
//     description: "i want to learn Next.Js, can anyone help me?",
//     tags: [
//       { _id: "1", name: "Next.js" },
//       { _id: "2", name: "Javascript" },
//     ],
//     author: {
//       _id: "1",
//       name: "peter McClean",
//       image:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMdBuvbsYu7WYAAUY2AqSQRGNESsYdkucDkQ&s",
//     },
//     upvotes: 10,
//     downvotes: 54,
//     answers: 32,
//     views: 10,
//     createdAt: new Date("2025-9-2"),
//   },
// ];

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}
const Home = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 2,
    query: query || "",
    filter: filter || "",
  });

  const { questions, isNext } = data || {};

  // const filteredQuestions = questions?.filter((item) =>
  //   item.title.toLowerCase().includes(query?.toLowerCase())
  // );

  return (
    <>
      <section className="flex w-full  flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold ">All Questions</h1>

        <Button
          asChild
          className="bg-amber-500 min-h-[46px] px-4 py-3 text-white"
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/"
          placeholder="Search questions"
          imgSrc="/icons/search.svg"
          otherClasses="flex-1"
        />

        <CommonFilter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </section>
      <HomeFilter />
      <DataRenderer
        success={success}
        data={questions}
        error={error}
        empty={EMPTY_QUESTION}
        render={(questions) =>
          questions.map((question) => (
            <div
              key={question._id}
              className="mt-10 flex w-full flex-col gap-6"
            >
              <QuestionCard key={question._id} question={question} />
            </div>
          ))
        }
      />

      <Pagination page={page} isNext={isNext || false} />
    </>
  );
};

export default Home;
