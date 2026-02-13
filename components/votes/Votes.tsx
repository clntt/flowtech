"use client";
import { createVote } from "@/lib/actions/votes.action";
import handleError from "@/lib/handlers/error";
import { formatNumber } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  targetType: "question" | "answer";
  targetId: string;
  upvotes: number;
  downvotes: number;
  hasVotedPromise?: Promise<ActionResponse<HasVotedResponse>>;
  hasVotedData?: HasVotedResponse;
}

const Votes = ({
  upvotes,
  downvotes,
  targetId,
  targetType,
  hasVotedData,
}: Props) => {
  const router = useRouter();

  const session = useSession();
  const userId = session.data?.user?.id;

  // const { success, data } = use(hasVotedPromise);
  // const { hasUpvoted, hasDownvoted } = data || {};
  const { hasUpvoted, hasDownvoted } = hasVotedData || {};

  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!userId) {
      return toast.error("Please log in to vote", {
        description: "Only logged in users can vote",
      });
    }

    setIsLoading(true);

    try {
      const result = await createVote({
        targetId,
        targetType,
        voteType,
      });

      if (!result.success) {
        toast.error("Failed to vote", {
          description: result?.error?.message,
        });
      }

      router.refresh();

      const successMessage =
        voteType === "upvote"
          ? `Upvote ${!hasUpvoted ? "added" : "removed"} successfully.`
          : `Downvotes ${!hasDownvoted ? "added" : "remove"} successfully`;

      toast.success(successMessage, {
        description: "Your vote has been recorded..",
      });
    } catch (error) {
      return handleError(error) as ErrorResponse;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <Image
          src={hasUpvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"}
          alt="upvote"
          width={18}
          height={18}
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Upvote"
          onClick={() => !isLoading && handleVote("upvote")}
        />

        <div className="flex-center ">
          <p>{formatNumber(upvotes)}</p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <Image
          src={hasDownvoted ? "/icons/downvoted.svg" : "/icons/downvote.svg"}
          alt="Downvote"
          width={18}
          height={18}
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Downvote"
          onClick={() => !isLoading && handleVote("downvote")}
        />

        <div className="flex-center ">
          <p>{formatNumber(downvotes)}</p>
        </div>
      </div>
    </div>
  );
};

export default Votes;
