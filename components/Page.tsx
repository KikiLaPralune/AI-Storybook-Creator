
import React from 'react';

interface PageProps {
  pageNumber: number;
  text: string;
  imageUrl?: string;
  isCover?: boolean;
  title?: string;
}

const Page: React.FC<PageProps> = ({ pageNumber, text, imageUrl, isCover = false, title }) => {
  return (
    <div className="storybook-page flex-shrink-0 w-[300px] h-[400px] md:w-[400px] md:h-[533px] bg-white rounded-lg shadow-xl flex flex-col p-4 border-4 border-amber-200">
      <div className="w-full h-3/5 bg-amber-100 rounded-md flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={isCover ? title : `Illustration for page ${pageNumber}`} className="w-full h-full object-cover" />
        ) : (
          <div className="animate-pulse w-full h-full bg-amber-200 flex items-center justify-center">
            <svg className="w-10 h-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex-grow flex flex-col justify-center items-center text-center mt-4 px-2">
        {isCover ? (
          <h2 className="text-2xl md:text-3xl font-bold text-stone-700">{title}</h2>
        ) : (
           <p className="text-stone-700 text-base md:text-lg leading-relaxed">{text}</p>
        )}
      </div>
      {!isCover && (
        <div className="text-center text-sm text-stone-400 mt-2">
          {pageNumber}
        </div>
      )}
    </div>
  );
};

export default Page;
