import React, { useState } from 'react';

interface StoryFormProps {
  onSubmit: (topic: string, numPages: number, language: string) => void;
  isLoading: boolean;
}

const languages = [
  { code: 'English', name: 'English' },
  { code: 'French', name: 'Français' },
  { code: 'Spanish', name: 'Español' },
  { code: 'German', name: 'Deutsch' },
  { code: 'Italian', name: 'Italiano' },
  { code: 'Portuguese', name: 'Português' },
];

const StoryForm: React.FC<StoryFormProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [numPages, setNumPages] = useState(5);
  const [language, setLanguage] = useState('French');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit(topic, numPages, language);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-amber-200">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-lg font-bold text-stone-700 mb-2">
            What should the story be about?
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., a brave little fox"
            className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-lg focus:ring-yellow-400 focus:border-yellow-400 transition"
            required
            disabled={isLoading}
          />
        </div>

        <div>
            <label htmlFor="language" className="block text-lg font-bold text-stone-700 mb-2">
                Language
            </label>
            <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-lg focus:ring-yellow-400 focus:border-yellow-400 transition"
                disabled={isLoading}
            >
                {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
            </select>
        </div>

        <div>
          <label htmlFor="pages" className="block text-lg font-bold text-stone-700 mb-2">
            How many pages? ({numPages})
          </label>
          <input
            type="range"
            id="pages"
            min="3"
            max="24"
            value={numPages}
            onChange={(e) => setNumPages(parseInt(e.target.value, 10))}
            className="w-full h-3 bg-amber-200 rounded-lg appearance-none cursor-pointer range-lg"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className="w-full bg-yellow-400 text-stone-800 font-bold text-xl py-4 px-6 rounded-lg hover:bg-yellow-500 disabled:bg-stone-300 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
        >
          {isLoading ? 'Creating...' : 'Create My Story!'}
        </button>
      </form>
    </div>
  );
};

export default StoryForm;