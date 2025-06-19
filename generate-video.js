import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DID_API_KEY = process.env.DID_API_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { query } = req.body;

  try {
    const prompt = `You are a logistics expert. Answer this question in 50-75 words using clear and visual language, suitable for a 30-second avatar video: \"${query}\"`;

    const completion = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const script = completion.data.choices[0].message.content.trim();

    const didResponse = await axios.post(
      "https://api.d-id.com/talks",
      {
        script: { type: "text", input: script },
        presenter_id: "amy-jv3l6t5q",
        config: { fluent: true, pad_audio: 0.5 },
      },
      {
        headers: {
          Authorization: `Bearer ${DID_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const talkId = didResponse.data.id;

    let videoUrl = null;
    for (let i = 0; i < 10; i++) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const status = await axios.get(`https://api.d-id.com/talks/${talkId}`, {
        headers: { Authorization: `Bearer ${DID_API_KEY}` },
      });

      if (status.data.result_url) {
        videoUrl = status.data.result_url;
        break;
      }
    }

    if (!videoUrl) {
      return res.status(500).json({ message: "Video generation timed out" });
    }

    return res.status(200).json({ videoUrl });
  } catch (error) {
    console.error("Error generating avatar video:", error.response?.data || error.message);
    return res.status(500).json({ message: "Failed to generate video" });
  }
}
