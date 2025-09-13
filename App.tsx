import React, { useState } from 'react';
import StoryForm from './components/StoryForm';
import StoryPreview from './components/StoryPreview';
import LoadingState from './components/LoadingState';
import { generateStoryContent, generateImage } from './services/geminiService';
import { StoryPage } from './types';

const App: React.FC = () => {
  const [storyTitle, setStoryTitle] = useState('');
  const [storyPages, setStoryPages] = useState<StoryPage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setStoryTitle('');
    setStoryPages([]);
    setIsLoading(false);
    setGenerationStep('');
    setError(null);
  }

  const handleCreateStory = async (topic: string, numPages: number, language: string) => {
    resetState();
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Generate story text and image prompts
      setGenerationStep("Thinking up a magical story...");
      const storyContent = await generateStoryContent(topic, numPages, language);
      setStoryTitle(storyContent.title);

      const initialPages: StoryPage[] = storyContent.pages.map((page, index) => ({
        id: index + 1,
        text: page.text,
        imagePrompt: page.imagePrompt,
        imageUrl: undefined,
      }));
      setStoryPages(initialPages);

      // Step 2: Generate images for each page sequentially with a delay
      setGenerationStep("Painting with digital watercolors...");
      
      const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

      for (const pageToUpdate of initialPages) {
          try {
              const imageUrl = await generateImage(pageToUpdate.imagePrompt);
              setStoryPages(prevPages => 
                  prevPages.map(p => p.id === pageToUpdate.id ? { ...p, imageUrl } : p)
              );
          } catch (imgError) {
              console.error(`Failed to generate image for page ${pageToUpdate.id}:`, imgError);
              // Optionally set a placeholder error image
          }
          await delay(1000); // Wait for 1 second to avoid rate limiting
      }

      setGenerationStep("Binding the book together...");
      // Short delay to appreciate the final step
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
      setGenerationStep('');
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState step={generationStep} />;
    }
    if (error) {
      return (
        <div className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
          <strong className="font-bold">Oh no! </strong>
          <span className="block sm:inline">{error}</span>
           <button onClick={resetState} className="mt-4 bg-yellow-400 text-stone-800 font-bold py-2 px-4 rounded-lg hover:bg-yellow-500">
            Try Again
          </button>
        </div>
      );
    }
    if (storyPages.length > 0) {
      return <StoryPreview title={storyTitle} pages={storyPages} onReset={resetState}/>;
    }
    return <StoryForm onSubmit={handleCreateStory} isLoading={isLoading} />;
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8">
       <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-stone-800">
            AI Storybook Creator
        </h1>
        <p className="text-stone-600 text-lg mt-2">
            Bring your child's imagination to life with a one-of-a-kind story.
        </p>
      </div>
      <div className="w-full">
        {renderContent()}
      </div>
    </main>
  );
};

export default App;
