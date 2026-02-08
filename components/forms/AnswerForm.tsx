"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AnswerSchema } from "@/lib/validations";
import { useRef, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import { useSession } from "next-auth/react";
import handleError from "@/lib/handlers/error";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

interface Props {
  questionId: string;
  questionTitle: string;
  questionContent: string;
}

const AnswerForm = ({ questionId, questionTitle, questionContent }: Props) => {
  const editorRef = useRef<MDXEditorMethods>(null);

  const [isAnswering, startAnsweringTransition] = useTransition();
  const [isAISubmitting, setIsAISubmitting] = useState(false);
  const session = useSession();
  const router = useRouter();

  // 1. Define your form.

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: "",
    },
  });

  const generateAIAnswer = async () => {
    if (session.status !== "authenticated") {
      return toast.error("Please log in", {
        description: "You need to be logged in to use this feature.",
      });
    }
    setIsAISubmitting(true);
    const userAnswer = editorRef.current?.getMarkdown();

    try {
      const { success, data, error } = await api.ai.getAnswer(
        questionTitle,
        questionContent,
        userAnswer
      );

      if (!success) {
        return toast.error("Error", {
          description: error.message,
        });
      }

      const formattedAnswer = data.replace(/<br>/g, "").toString().trim();
      form.setValue("content", formattedAnswer, {
        shouldValidate: true,
        shouldDirty: true,
      });
      editorRef.current?.setMarkdown(formattedAnswer);
      toast.success("Success", {
        description: "AI Answer has been generated successfully.",
      });
    } catch (err) {
      toast.error("Error", {
        description:
          err instanceof Error ? err.message : "Failed to Generate Answer.",
      });
      return handleError(err) as ErrorResponse;
    } finally {
      setIsAISubmitting(false);
    }
  };

  const handleSubmit = async (values: z.infer<typeof AnswerSchema>) => {
    startAnsweringTransition(async () => {
      const result = await createAnswer({
        questionId,
        content: values.content,
      });

      if (result.success) {
        toast.success("Success", {
          description: "Answer posted successfully",
        });

        if (editorRef.current) {
          editorRef.current.setMarkdown("");
        }

        router.refresh();
      } else {
        toast.error("Error", {
          description: result?.error?.message,
        });
      }
    });
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="">AI Answer here</h4>
        <Button
          className="rounded-md border px-4 py-2.5 text-amber-500"
          disabled={isAISubmitting}
          onClick={generateAIAnswer}
        >
          {isAISubmitting ? (
            <>
              <p>Generating...</p>
            </>
          ) : (
            <>
              <Image
                src="/icons/stars.svg"
                alt="Generate AI Answer"
                width={12}
                height={12}
                className="object-contain"
              />
              Generate AI Answer
            </>
          )}
        </Button>
      </div>

      <Form {...form}>
        <form
          className="mt-10 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5 ">
                  <Editor
                    key={field.value}
                    value={field.value}
                    editorRef={editorRef}
                    fieldChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <p>Write your Answer here.</p>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col gap-3">
                  <FormControl className="mt-3.5 ">
                    <Editor
                      // key={field.value}
                      value={field.value}
                      editorRef={editorRef}
                      fieldChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button className="w-fit hover:bg-amber-500" type="submit">
              {isAnswering ? (
                <>
                  <p>Posting...</p>
                </>
              ) : (
                "Post Answer"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AnswerForm;
