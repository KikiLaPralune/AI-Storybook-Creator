
import React, { useState } from 'react';
import { StoryPage } from '../types';
import Page from './Page';

declare global {
    interface Window {
        jspdf: any;
        html2canvas: any;
    }
}

interface StoryPreviewProps {
  title: string;
  pages: StoryPage[];
  onReset: () => void;
}

const StoryPreview: React.FC<StoryPreviewProps> = ({ title, pages, onReset }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadPdf = async () => {
        setIsDownloading(true);
        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [400, 533] // Corresponds to page WxH
            });
            
            const pageElements = document.querySelectorAll('.storybook-page');

            for (let i = 0; i < pageElements.length; i++) {
                const page = pageElements[i] as HTMLElement;
                const canvas = await window.html2canvas(page, { 
                    scale: 2,
                    useCORS: true, 
                    backgroundColor: null,
                });
                const imgData = canvas.toDataURL('image/png');
                
                if (i > 0) {
                    pdf.addPage([400, 533], 'portrait');
                }
                pdf.addImage(imgData, 'PNG', 0, 0, 400, 533);
            }

            pdf.save(`${title.replace(/\s+/g, '-')}.pdf`);
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            alert("Sorry, there was an issue creating the PDF. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="w-full flex flex-col items-center">
            <h2 className="text-3xl font-bold text-stone-800 mb-2">Here's Your Storybook!</h2>
            <p className="text-stone-600 mb-6">Scroll to preview the pages, then download it as a PDF.</p>
            <div className="w-full flex items-center justify-center p-4">
                <div className="flex space-x-6 overflow-x-auto py-4 px-2 w-full snap-x snap-mandatory">
                    {/* Cover Page */}
                    <div className="snap-center">
                        <Page 
                            pageNumber={0} 
                            text={""}
                            imageUrl={pages[0]?.imageUrl}
                            isCover={true}
                            title={title}
                        />
                    </div>
                    {/* Story Pages */}
                    {pages.map((page) => (
                         <div key={page.id} className="snap-center">
                            <Page 
                                pageNumber={page.id} 
                                text={page.text}
                                imageUrl={page.imageUrl}
                            />
                         </div>
                    ))}
                </div>
            </div>
             <div className="flex space-x-4 mt-6">
                <button
                    onClick={handleDownloadPdf}
                    disabled={isDownloading}
                    className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 disabled:bg-stone-300 transition-transform transform hover:scale-105"
                >
                    {isDownloading ? 'Downloading...' : 'Download as PDF'}
                </button>
                 <button
                    onClick={onReset}
                    className="bg-amber-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-amber-600 transition-transform transform hover:scale-105"
                >
                    Create Another Story
                </button>
            </div>
        </div>
    );
};

export default StoryPreview;
