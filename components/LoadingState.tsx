
import React from 'react';

interface LoadingStateProps {
  step: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ step }) => {
  const steps = [
    "Thinking up a magical story...",
    "Painting with digital watercolors...",
    "Binding the book together...",
  ];

  const currentStepIndex = steps.indexOf(step);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
        <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-yellow-300 rounded-full opacity-75 animate-ping"></div>
            <div className="relative w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-yellow-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v1.5M12 9.75v1.5M12 13.25v1.5M12 16.75v1.5M12 3.75c-4.83 0-8.75 3.92-8.75 8.75s3.92 8.75 8.75 8.75 8.75-3.92 8.75-8.75S16.83 3.75 12 3.75z" /></svg>
            </div>
        </div>
      <h2 className="text-2xl font-bold text-stone-700 mb-4">Creating Your Storybook!</h2>
      <p className="text-stone-600">{step}</p>

      <div className="w-full max-w-sm mt-8">
        <div className="flex justify-between mb-1">
          {steps.map((s, index) => (
             <div key={s} className={`text-xs ${index <= currentStepIndex ? 'text-yellow-600 font-bold' : 'text-stone-400'}`}>
                Step {index + 1}
             </div>
          ))}
        </div>
        <div className="w-full bg-stone-200 rounded-full h-2.5">
          <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%`, transition: 'width 0.5s ease-in-out' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
