"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "./ui/button";
import { formUrlquery } from "@/lib/url";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  page: number | undefined | string;
  isNext: boolean;
  containerClasses?: string;
}

const Pagination = ({ page = 1, isNext, containerClasses }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleNavigation = (type: "prev" | "next") => {
    const nextPageNumber =
      type === "prev" ? Number(page) - 1 : Number(page) + 1;

    const value = nextPageNumber > 1 ? nextPageNumber.toString() : null;

    const newUrl = formUrlquery({
      params: searchParams.toString(),
      key: "page",
      value,
    });

    router.push(newUrl);
  };
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center gap-2 mt-5",
        containerClasses
      )}
    >
      {Number(page) > 1 && (
        <Button
          className="flex min-h-[36px] items-center justify-center gap-2 border"
          onClick={() => handleNavigation("prev")}
        >
          <p className="">Prev</p>
        </Button>
      )}

      <div className="flex items-center justify-center rounded-md bg-amber-500 px-3.5 py-2 text-white">
        <p>{page}</p>
      </div>

      {isNext && (
        <Button
          className="flex min-h-[36px] items-center justify-center gap-2 border"
          onClick={() => handleNavigation("next")}
        >
          <p className="">Next</p>
        </Button>
      )}
    </div>
  );
};

export default Pagination;
