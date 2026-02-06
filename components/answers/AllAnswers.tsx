import { EMPTY_ANSWERS } from "@/constants/states";
import DataRenderer from "../DataRenderer";
import AnswerCard from "../cards/AnswerCard";

interface Props extends ActionResponse<Answer[]> {
  totalAnswers: number;
}

const AllAnswers = ({ data, success, error, totalAnswers }: Props) => {
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        {/* <h3>{totalAnswers > 1 ? "Answers" : "Answer"}</h3> */}
        <h3 className="text-amber-500">
          {totalAnswers > 1
            ? `${totalAnswers} Answers`
            : `${totalAnswers} Answer`}
        </h3>
        <p>Filters</p>
      </div>

      <DataRenderer
        data={data}
        success={success}
        error={error}
        empty={EMPTY_ANSWERS}
        render={(answers) =>
          answers.map((answer) => <AnswerCard key={answer._id} {...answer} />)
        }
      />
    </div>
  );
};

export default AllAnswers;
