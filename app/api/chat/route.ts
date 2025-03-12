import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 30;

function errorHandler(error: unknown) {
  if (error == null) {
    return "Error desconocido";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return JSON.stringify(error);
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      messages,
    });

    return result.toDataStreamResponse({
      getErrorMessage: errorHandler,
    });
  } catch (error) {
    console.error("Error en el chat:", error);
    return new Response(JSON.stringify({ error: errorHandler(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
