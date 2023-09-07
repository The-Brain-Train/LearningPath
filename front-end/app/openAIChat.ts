// import type { NextApiRequest, NextApiResponse } from "next";
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   console.log(req.body.messages);
//   const chatCompletion = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     messages: req.body.messages,
//   });
//   console.log(chatCompletion.choices[0].message);
// }


// openAiChat.ts
import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';



export async function getResponseFromOpenAI(messages: any[]) {
    const headers = {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post(OPENAI_ENDPOINT, { model: "gpt-3.5-turbo", messages }, { headers });
        return response.data;
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        throw error; // Propagate the error so you can handle it in your component
    }
}
