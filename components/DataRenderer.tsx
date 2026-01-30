import { DEFAULT_ERROR, EMPTY_QUESTION } from "@/constants/states";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

interface Props<T> {
  success: boolean;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  data: T[] | null | undefined;
  empty: {
    title: string;
    message: string;
    button: {
      text: string;
      href: string;
    };
  };
  render: (data: T[]) => React.ReactNode;
}

interface StateSkeletonProps {
  title: string;
  image: {
    // light: string;
    // dark: string;
    src: string;
    alt: string;
  };
  message: string;
  button?: {
    text: string;
    href: string;
  };
}

const StateSkeleton = ({
  image,
  title,
  message,
  button,
}: StateSkeletonProps) => (
  <div className="mt-16 flex w-full flex-col items-center justify-center sm:mt-36">
    <>
      <Image
        src={image?.src}
        alt={image?.alt}
        width={270}
        height={200}
        className="object-contain"
      />

      <h2 className="h2-bold">{title}</h2>
      <p className="max-w-md text-center my-3.5">{message}</p>

      {button && (
        <Link href={button.href}>
          <Button className="mt-5 min-h-[46px] rounded-lg px-4 py-3">
            {button.text}
          </Button>
        </Link>
      )}
    </>
  </div>
);

const DataRenderer = <T,>({
  success,
  error,
  data,
  empty = EMPTY_QUESTION,
  render,
}: Props<T>) => {
  if (!success) {
    return (
      <StateSkeleton
        image={{
          src: "/images/errorMessage1.avif",
          alt: "Error State illustration",
        }}
        title={error?.message || DEFAULT_ERROR.title}
        message={
          error?.details
            ? JSON.stringify(error.details, null, 2)
            : DEFAULT_ERROR.message
        }
        button={DEFAULT_ERROR.button}
      />
    );
  }
  if (!data || data.length === 0)
    return (
      <StateSkeleton
        image={{
          src: "/images/noQuestion.avif",
          alt: "Empty State illustration",
        }}
        message={empty.message}
        title={empty.title}
        button={empty.button}
      />
    );
  return <div className="mt-5">{render(data)}</div>;
};

export default DataRenderer;
