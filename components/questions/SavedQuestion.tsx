"use client";

import { toggleSaveQuestion } from "@/lib/actions/collection.action";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

const SavedQuestion = ({
  questionId,
  hasSaved,
}: {
  questionId: string;
  hasSaved: boolean;
}) => {
  const session = useSession();
  const userId = session?.data?.user?.id;

  const [saved, setSaved] = useState(hasSaved);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (isLoading) return;

    if (!userId) {
      return toast.error("Not Allowed", {
        description: "You need to be logged in to save a question.",
      });
    }

    setIsLoading(true);

    try {
      const { success, data, error } = await toggleSaveQuestion({ questionId });

      if (!success) throw new Error(error?.message || "An error occurred");

      setSaved(data?.saved ?? saved);

      toast.success(
        `Question ${data?.saved ? "saved" : "unsaved"} successfully.`
      );
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Image
        src={saved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
        alt="save"
        width={18}
        height={18}
        className={`cursor-pointer ${isLoading && "opacity-50"}`}
        aria-label="Save Question"
        onClick={handleSave}
      />
    </div>
  );
};

export default SavedQuestion;
