
export interface StoryPage {
  id: number;
  text: string;
  imagePrompt: string;
  imageUrl?: string;
}

export interface StoryContent {
    title: string;
    pages: {
        text: string;
        imagePrompt: string;
    }[];
}
