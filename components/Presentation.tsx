import React, { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon } from './icons';

interface Slide {
  id: string;
  title: string;
  content: string;
}

const initialSlides: Slide[] = [
  { id: '1', title: 'Zenith Suite', content: 'The All-in-One Productivity App' },
  { id: '2', title: 'Features', content: '- Jira Board\n- To-Do List\n- Notes\n- Expenses' },
  { id: '3', title: 'Thank You', content: 'Q&A Session' },
];

const Presentation: React.FC = () => {
    const [slides, setSlides] = useState<Slide[]>(initialSlides);
    const [activeSlideId, setActiveSlideId] = useState<string | null>(initialSlides[0]?.id || null);
    const [isPresenting, setIsPresenting] = useState(false);
    const [presentationSlideIndex, setPresentationSlideIndex] = useState(0);

    const activeSlide = slides.find(s => s.id === activeSlideId);

    const handleAddSlide = () => {
        const newSlide: Slide = { id: Date.now().toString(), title: 'New Slide', content: '' };
        setSlides([...slides, newSlide]);
        setActiveSlideId(newSlide.id);
    };

    const handleDeleteSlide = (id: string) => {
        const newSlides = slides.filter(s => s.id !== id);
        setSlides(newSlides);
        if (activeSlideId === id) {
            setActiveSlideId(newSlides.length > 0 ? newSlides[0].id : null);
        }
    };
    
    const handleUpdateSlide = (field: 'title' | 'content', value: string) => {
        if (!activeSlideId) return;
        setSlides(slides.map(s => s.id === activeSlideId ? { ...s, [field]: value } : s));
    };

    const startPresentation = () => {
        setPresentationSlideIndex(activeSlideId ? slides.findIndex(s => s.id === activeSlideId) : 0);
        setIsPresenting(true);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isPresenting) return;
            if (e.key === 'ArrowRight' || e.key === ' ') {
                setPresentationSlideIndex(i => Math.min(i + 1, slides.length - 1));
            } else if (e.key === 'ArrowLeft') {
                setPresentationSlideIndex(i => Math.max(i - 1, 0));
            } else if (e.key === 'Escape') {
                setIsPresenting(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPresenting, slides.length]);

    if (isPresenting) {
        const currentSlide = slides[presentationSlideIndex];
        return (
            <div className="fixed inset-0 bg-primary z-50 flex flex-col items-center justify-center text-text-primary p-8 transition-all duration-300">
                <h1 className="text-6xl font-bold mb-8 text-center">{currentSlide.title}</h1>
                <div className="text-3xl whitespace-pre-wrap text-center">{currentSlide.content}</div>
                <div className="absolute bottom-4 right-4 text-text-secondary bg-secondary/50 px-2 py-1 rounded">
                    {presentationSlideIndex + 1} / {slides.length}
                </div>
                 <button onClick={() => setIsPresenting(false)} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary">
                    Exit (Esc)
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Presentation</h2>
                <button onClick={startPresentation} disabled={!slides.length} className="bg-accent hover:bg-accent-hover text-accent-text font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Present
                </button>
            </div>
            <div className="flex h-[calc(100vh-150px)] bg-secondary rounded-lg">
                {/* Slide sorter */}
                <div className="w-1/4 border-r border-border-color flex flex-col">
                    <div className="p-4 border-b border-border-color flex justify-between items-center">
                        <h3 className="text-xl font-semibold">Slides</h3>
                        <button onClick={handleAddSlide} className="text-accent hover:opacity-80">
                            <PlusIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="overflow-y-auto">
                        {slides.map((slide, index) => (
                            <div key={slide.id} onClick={() => setActiveSlideId(slide.id)}
                                className={`p-2 cursor-pointer border-l-4 ${slide.id === activeSlideId ? 'bg-tertiary border-accent' : 'border-transparent hover:bg-tertiary/50'}`}>
                                <div className="text-text-secondary text-sm mb-1 ml-1">{index + 1}</div>
                                <div className="bg-primary p-2 rounded aspect-video flex flex-col justify-center items-center text-center">
                                    <p className="text-xs font-bold truncate text-text-primary">{slide.title || 'Untitled'}</p>
                                    <p className="text-[8px] text-text-secondary truncate mt-1">{slide.content || 'No content'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Slide Editor */}
                <div className="w-3/4 flex flex-col">
                    {activeSlide ? (
                        <>
                            <div className="p-2 border-b border-border-color flex justify-end">
                                <button onClick={() => handleDeleteSlide(activeSlide.id)} className="text-text-secondary hover:text-danger p-2">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-grow flex flex-col items-center justify-center p-8 bg-primary">
                                <input
                                    type="text"
                                    value={activeSlide.title}
                                    onChange={e => handleUpdateSlide('title', e.target.value)}
                                    placeholder="Slide Title"
                                    className="w-full bg-transparent text-4xl font-bold text-center focus:outline-none mb-6 text-text-primary"
                                />
                                <textarea
                                    value={activeSlide.content}
                                    onChange={e => handleUpdateSlide('content', e.target.value)}
                                    placeholder="Slide content..."
                                    className="w-full h-48 bg-transparent text-xl text-center focus:outline-none resize-none text-text-primary"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-text-secondary">
                            <p>Create a new slide to begin.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Presentation;
