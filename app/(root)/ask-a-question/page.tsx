import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import { redirect } from "next/navigation";
import React from "react";

const AskQuestion = async () => {
  const session = await auth();

  if (!session) redirect("/sign-in");
  return (
    <>
      <h1 className="font-bold">Ask a Question</h1>

      <div className="mt-9">
        <QuestionForm />
      </div>
    </>
  );
};

export default AskQuestion;
