import axios from "axios";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/images/generations";

export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data[0].url;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};
