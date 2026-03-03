import { formatNumber } from "@/lib/utils";
import Image from "next/image";

interface Props {
  totalAnswers: number;
  totalQuestions: number;
  badges: BadgeCounts;
}

interface StatsProps {
  imgUrl: string;
  value: number;
  title: string;
}

const StatsCard = ({ imgUrl, value, title }: StatsProps) => (
  <div className="flex flex-wrap items-center justify-start gap-4 rounded border p-6">
    <Image src={imgUrl} alt={title} width={40} height={50} />
    <div>
      <p>{value}</p>
      <p>{title}</p>
    </div>
  </div>
);

const Stats = ({ totalAnswers, totalQuestions, badges }: Props) => {
  return (
    <div className="mt-3">
      <h4 className="">Stats</h4>

      <div className="mt-5 grid grid-cols-1 gap5 xs:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-wrap items-center justify-evenly gap-4 rounded border p-6">
          <div>
            <p>{formatNumber(totalQuestions)}</p>
            <p>Questions</p>
          </div>
          <div>
            <p>{formatNumber(totalAnswers)}</p>
            <p>Answers</p>
          </div>
        </div>

        <StatsCard
          imgUrl="/icons/gold-medal.svg"
          value={badges.GOLD}
          title="Gold Badges"
        />

        <StatsCard
          imgUrl="/icons/silver-medal.svg"
          value={badges.SILVER}
          title="Silver Badges"
        />

        <StatsCard
          imgUrl="/icons/bronze-medal.svg"
          value={badges.BRONZE}
          title="Bronze Badges"
        />
      </div>
    </div>
  );
};

export default Stats;
