import axios from "axios";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";

export async function getResponseFromOpenAI(messages: any[]) {
  const headers = {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(
      OPENAI_ENDPOINT,
      { model: "gpt-3.5-turbo", messages },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}
