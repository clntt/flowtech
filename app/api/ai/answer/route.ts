import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { AIAnswerSchema } from "@/lib/validations";
import { generateText } from "ai";

import { groq } from "@ai-sdk/groq";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { question, content } = await req.json();

  try {
    const validatedData = AIAnswerSchema.safeParse({ question, content });

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `Generate a markdown-formatted response to the following question: ${question}. Base it on the provided content: ${content}.`,
      system: `You are a helpful assistant that provides informative responses in markdown format. Use appropriate markdown syntax for headings, lists, code blocks, and empahsis where neccessary. For code blocks, use short-form smaller case language identitfiers (e.g, 'js' for javascript, 'py' for python, 'ts' for typesrcipt, 'html' for HTML 'css' from CSS, etc.).`,
    });

    return NextResponse.json({ success: true, data: text }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
}
