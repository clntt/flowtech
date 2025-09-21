import QuestionForm from "@/components/forms/QuestionForm";
import React from "react";

const AskQuestion = () => {
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
