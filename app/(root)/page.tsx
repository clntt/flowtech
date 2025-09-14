import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import Link from "next/link";

const questions = [
  {
    _id: "1",
    title: "How to learn React",
    description: "i want to learn React, can anyone help me?",
    tags: [
      { _id: "1", name: "react" },
      { _id: "2", name: "Javascript" },
    ],
    author: {
      _id: "1",
      name: "John Doe",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV4UlS1Ehv87B7_HRdQWlKz8Jw13A0zxuiuQ&s",
    },
    upvotes: 12,
    downvotes: 0,
    answers: 3,
    views: 100,
    createdAt: new Date("2024-3-4"),
  },
  {
    _id: "2",
    title: "How to learn Next.Js",
    description: "i want to learn Next.Js, can anyone help me?",
    tags: [
      { _id: "1", name: "Next.js" },
      { _id: "2", name: "Javascript" },
    ],
    author: {
      _id: "1",
      name: "peter McClean",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMdBuvbsYu7WYAAUY2AqSQRGNESsYdkucDkQ&s",
    },
    upvotes: 10,
    answers: 32,
    views: 10,
    createdAt: new Date("2025-9-2"),
  },
];

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}
const Home = async ({ searchParams }: SearchParams) => {
  const { query = "", filter } = await searchParams;

  const filteredQuestions = questions.filter((item) =>
    item.title.toLowerCase().includes(query?.toLowerCase())
  );

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
      <section className="mt-11">
        <LocalSearch
          route="/"
          placeholder="Search Questions"
          imgSrc="/icons/search.svg"
          otherClasses=""
        />
      </section>
      <HomeFilter />
      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <QuestionCard key={question._id} question={question} />
          // <h1 key={question._id}>Questions</h1>
        ))}
      </div>
    </>
  );
};

export default Home;
