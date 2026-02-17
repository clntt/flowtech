"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlquery, removeKeysFromUrlquery } from "@/lib/url";

interface Props {
  imgSrc: string;
  route: string;
  iconPosition?: "right" | "left";
  otherClasses?: string;
  placeholder: string;
}

const LocalSearch = ({
  imgSrc,
  route,
  otherClasses,
  placeholder,
  iconPosition = "left",
}: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const router = useRouter();

  useEffect(() => {
    const debounced = setTimeout(() => {
      if (searchQuery) {
        const newUrl = formUrlquery({
          params: searchParams.toString(),
          key: "query",
          value: searchQuery,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromUrlquery({
            params: searchParams.toString(),
            keysToRemove: ["query"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 2000);

    return () => clearTimeout(debounced);
  }, [searchQuery, router, route, searchParams, pathname, query]);

  return (
    <div
      className={cn(
        `bg-gray-50 border border-gray-200 flex min-h-[56px] grow items-center  rounded-[10px] px-4 text-gray-700`,
        otherClasses
      )}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          width={24}
          height={24}
          alt="Search"
          className="cursor-pointer"
        />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border-none shadow-none outline-none focus:outline-none focus:border-none focus:ring-0 placeholder-gray-400"
      />
      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          width={24}
          height={24}
          alt="Search"
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearch;
