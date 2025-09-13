import { GoogleGenAI, Type } from "@google/genai";
import { StoryContent } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const storySchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A creative, short title for the story book. Max 5 words."
    },
    pages: {
      type: Type.ARRAY,
      description: "The pages of the story.",
      items: {
        type: Type.OBJECT,
        properties: {
          text: {
            type: Type.STRING,
            description: "The text for this page of the story. Should be 1-3 sentences long, appropriate for a young child."
          },
          imagePrompt: {
            type: Type.STRING,
            description: "A detailed, descriptive prompt for an AI image generator to create a whimsical, child-friendly illustration for this page. The style should be like a beautiful watercolor children's book illustration."
          }
        },
        required: ["text", "imagePrompt"]
      }
    }
  },
  required: ["title", "pages"]
};

export const generateStoryContent = async (topic: string, numPages: number, language: string): Promise<StoryContent> => {
    const prompt = `Write a children's story about "${topic}" in ${language}. The story must have exactly ${numPages} pages, plus a title. The tone should be cheerful, simple, and magical, suitable for children aged 3-6. For each page, provide the story text and a detailed prompt to generate an accompanying illustration. The entire JSON response (title, page text, and image prompts) must be in ${language}.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: storySchema,
        },
    });

    const responseText = response.text.trim();
    try {
        const storyData = JSON.parse(responseText);
        // Ensure the number of pages matches the request
        if (storyData.pages && storyData.pages.length !== numPages) {
            console.warn(`Requested ${numPages} pages, but AI generated ${storyData.pages.length}. Using generated count.`);
        }
        return storyData as StoryContent;
    } catch (error) {
        console.error("Failed to parse story JSON:", error);
        console.error("Raw response text:", responseText);
        throw new Error("The AI returned an unexpected story format. Please try again.");
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `${prompt}, beautiful watercolor children's book illustration, soft colors, friendly characters, magical`,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '3:4',
        },
    });
    
    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
        throw new Error("Image generation failed to return an image.");
    }
};