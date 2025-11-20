import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Upload, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PresentationUploader from '../components/deck/PresentationUploader';
import ImprovedSlideCard from '../components/deck/ImprovedSlideCard';
import DeckActions from '../components/deck/DeckActions';
import { toast } from 'sonner';

export default function ImproveDeck() {
    const [improvedDeck, setImprovedDeck] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [generationsCount, setGenerationsCount] = useState(0);
    const [credits, setCredits] = useState(0);

    React.useEffect(() => {
        const count = parseInt(localStorage.getItem('generationsCount') || '0');
        const storedCredits = parseFloat(localStorage.getItem('credits') || '0');
        setGenerationsCount(count);
        setCredits(storedCredits);
    }, []);

    const improveMutation = useMutation({
        mutationFn: async ({ content, focusAreas }) => {
            const prompt = `You are an expert presentation consultant. Analyze and improve the following presentation draft:

${content}

Tasks:
1. Refine each slide's content for clarity, impact, and professionalism
2. Suggest specific design improvements (layouts, visual elements, color schemes)
3. Generate detailed speaker notes for each slide (3-5 sentences per slide)
4. Maintain the original slide count and structure
5. Focus on: ${focusAreas.join(', ')}

Return the improved presentation with clear, actionable improvements.`;

            const response = await base44.integrations.Core.InvokeLLM({
                prompt: prompt,
                response_json_schema: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        overall_suggestions: { type: "string" },
                        slides: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    slide_number: { type: "number" },
                                    original_title: { type: "string" },
                                    improved_title: { type: "string" },
                                    original_content: { type: "string" },
                                    improved_content: {
                                        type: "array",
                                        items: { type: "string" }
                                    },
                                    design_suggestions: { type: "string" },
                                    speaker_notes: { type: "string" },
                                    visual_elements: {
                                        type: "array",
                                        items: { type: "string" }
                                    }
                                },
                                required: ["slide_number", "improved_title", "improved_content", "design_suggestions", "speaker_notes"]
                            }
                        }
                    },
                    required: ["title", "slides"]
                }
            });

            return response;
        },
        onSuccess: async (data) => {
            setImprovedDeck(data);
            setIsSaved(false);
            
            // Update counts and deduct credits
            const newCount = generationsCount + 1;
            setGenerationsCount(newCount);
            localStorage.setItem('generationsCount', newCount.toString());
            
            if (newCount > 2) {
                const newCredits = Math.max(0, credits - 0.2);
                setCredits(newCredits);
                localStorage.setItem('credits', newCredits.toString());
            }
            
            toast.success('Presentation improved successfully!');
        },
        onError: () => {
            toast.error('Failed to improve presentation. Please try again.');
        }
    });

    const handleImprove = (params) => {
        const freeLimit = 2;
        const freeGenerationsLeft = Math.max(0, freeLimit - generationsCount);
        
        if (generationsCount >= 2 && credits < 0.2) {
            toast.error('Purchase credits to continue improving presentations');
            return;
        }
        
        improveMutation.mutate(params);
    };

    const saveMutation = useMutation({
        mutationFn: async (deck) => {
            const savedDecks = JSON.parse(localStorage.getItem('savedDecks') || '[]');
            const deckWithId = { ...deck, id: Date.now().toString(), saved_at: new Date().toISOString(), type: 'improved' };
            savedDecks.push(deckWithId);
            localStorage.setItem('savedDecks', JSON.stringify(savedDecks));
            return deckWithId;
        },
        onSuccess: () => {
            setIsSaved(true);
            toast.success('Improved deck saved!');
        }
    });

    const handleSave = () => {
        if (improvedDeck) {
            saveMutation.mutate(improvedDeck);
        }
    };

    const freeLimit = 2;
    const freeGenerationsLeft = Math.max(0, freeLimit - generationsCount);
    const needsCredits = freeGenerationsLeft === 0 && credits < 0.2;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
            <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
                {/* Header */}
                <div className="mb-8 md:mb-12">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg">
                            <Wand2 className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                                AI Presentation Improver
                            </h1>
                            <p className="text-slate-600 mt-1">
                                Upload your draft and let AI refine it to perfection
                            </p>
                        </div>
                    </div>
                </div>

                {/* Warning */}
                {needsCredits && (
                    <Alert className="mb-6 border-amber-300 bg-amber-50">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-800">
                            Purchase credits to continue improving presentations ($0.20 per improvement).
                        </AlertDescription>
                    </Alert>
                )}

                {/* Uploader */}
                <div className="mb-8">
                    <PresentationUploader
                        onImprove={handleImprove}
                        isImproving={improveMutation.isPending}
                    />
                </div>

                {/* Improved Deck */}
                <AnimatePresence mode="wait">
                    {improvedDeck && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Deck Header */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-200">
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                                    {improvedDeck.title}
                                </h2>
                                {improvedDeck.overall_suggestions && (
                                    <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                                        <h3 className="font-semibold text-purple-900 mb-2">Overall Suggestions</h3>
                                        <p className="text-slate-700 leading-relaxed">{improvedDeck.overall_suggestions}</p>
                                    </div>
                                )}
                                <DeckActions
                                    deck={improvedDeck}
                                    onSave={handleSave}
                                    isSaving={saveMutation.isPending}
                                    isSaved={isSaved}
                                />
                            </div>

                            {/* Improved Slides */}
                            <div className="space-y-6">
                                {improvedDeck.slides?.map((slide, index) => (
                                    <ImprovedSlideCard
                                        key={index}
                                        slide={slide}
                                        index={index}
                                        total={improvedDeck.slides.length}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}