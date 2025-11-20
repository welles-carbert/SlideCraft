import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Presentation, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GeneratorForm from '../components/deck/GeneratorForm';
import SlideCard from '../components/deck/SlideCard';
import DeckActions from '../components/deck/DeckActions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import CreditsDisplay from '../components/deck/CreditsDisplay';
import PurchaseCreditsModal from '../components/deck/PurchaseCreditsModal';
import { toast } from 'sonner';

export default function Generator() {
    const [generatedDeck, setGeneratedDeck] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [generationsCount, setGenerationsCount] = useState(0);
    const [credits, setCredits] = useState(0);
    const [user, setUser] = useState(null);
    const queryClient = useQueryClient();

    // Load user data on mount
    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await base44.auth.me();
                setUser(userData);
                setGenerationsCount(userData.generations_count || 0);
                setCredits(userData.credits || 0);
            } catch (error) {
                console.error('User not authenticated');
            }
        };
        loadUser();
    }, []);

    const handlePurchase = async (creditsToAdd) => {
        const newCredits = credits + (creditsToAdd * 0.2);
        await base44.auth.updateMe({ credits: newCredits });
        setCredits(newCredits);
        setShowPurchaseModal(false);
        toast.success('Credits added successfully!');
    };

    const generateMutation = useMutation({
        mutationFn: async ({ topic, tone, slideCount }) => {
            const prompt = `Create a professional ${slideCount}-slide presentation deck on the following topic:

Topic: ${topic}

Requirements:
- Tone: ${tone}
- Create exactly ${slideCount} slides
- Each slide must have:
  * A clear, concise title
  * 3-5 bullet points that are presentation-ready (short, impactful)
  * Speaker notes (2-3 sentences) providing additional context for the presenter
- Structure the deck logically with:
  * Slide 1: Title/Introduction
  * Middle slides: Core content organized thematically
  * Final slide: Conclusion/Call-to-action
- Make bullet points concise and impactful
- Avoid long paragraphs
- Ensure the content flows logically from slide to slide

Generate a cohesive, professional slide deck ready for presentation.`;

            const response = await base44.integrations.Core.InvokeLLM({
                prompt: prompt,
                response_json_schema: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        slides: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    slide_number: { type: "number" },
                                    title: { type: "string" },
                                    bullet_points: {
                                        type: "array",
                                        items: { type: "string" }
                                    },
                                    speaker_notes: { type: "string" }
                                },
                                required: ["slide_number", "title", "bullet_points", "speaker_notes"]
                            }
                        }
                    },
                    required: ["title", "slides"]
                }
            });

            return {
                ...response,
                topic,
                tone,
                slide_count: slideCount
            };
        },
        onSuccess: async (data) => {
            setGeneratedDeck(data);
            setIsSaved(false);

            // Update counts
            const newCount = generationsCount + 1;
            const newCredits = newCount > 2 ? Math.max(0, credits - 0.2) : credits;

            await base44.auth.updateMe({ 
                generations_count: newCount,
                credits: newCredits
            });

            setGenerationsCount(newCount);
            setCredits(newCredits);

            toast.success('Slide deck created successfully!');
        },
        onError: () => {
            toast.error('Failed to create slide deck. Please try again.');
        }
    });

    const saveMutation = useMutation({
        mutationFn: async (deck) => {
            // Save to localStorage
            const savedDecks = JSON.parse(localStorage.getItem('savedDecks') || '[]');
            const deckWithId = { ...deck, id: Date.now().toString(), saved_at: new Date().toISOString() };
            savedDecks.push(deckWithId);
            localStorage.setItem('savedDecks', JSON.stringify(savedDecks));
            return deckWithId;
        },
        onSuccess: () => {
            setIsSaved(true);
            toast.success('Deck saved successfully!');
        },
        onError: () => {
            toast.error('Failed to save deck');
        }
    });

    const handleGenerate = (params) => {
        // First 2 generations are free
        if (generationsCount < 2) {
            generateMutation.mutate(params);
            return;
        }
        
        // After 2, need $0.20 per generation
        if (generationsCount >= 2 && credits < 0.2) {
            setShowPurchaseModal(true);
            toast.error('Purchase credits to continue creating');
            return;
        }
        
        generateMutation.mutate(params);
    };

    const handleSave = () => {
        if (generatedDeck) {
            saveMutation.mutate(generatedDeck);
        }
    };

    const freeLimit = 2;
    const freeGenerationsLeft = Math.max(0, freeLimit - generationsCount);
    const paidGenerationsAvailable = Math.floor(credits / 0.2);
    const needsCredits = freeGenerationsLeft === 0 && credits < 0.2;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 md:mb-14"
                >
                    <div className="flex items-center gap-5 mb-4">
                        <motion.div 
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-indigo-200"
                        >
                            <Presentation className="w-8 h-8 text-white" />
                        </motion.div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                AI Slide Deck Generator
                            </h1>
                            <p className="text-slate-600 mt-2 text-lg">
                                Transform your ideas into stunning presentations ✨
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Free Generations Stats */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="mb-6 border-0 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                                        <span className="text-2xl">🎁</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Free Creations</p>
                                        <p className="text-3xl font-bold text-slate-900 mt-1">
                                            {freeGenerationsLeft} / {freeLimit}
                                        </p>
                                        <p className="text-sm text-slate-600 mt-1">
                                            {freeGenerationsLeft === 0 ? '🎉 All free creations used!' : `${freeGenerationsLeft} free ${freeGenerationsLeft === 1 ? 'creation' : 'creations'} remaining`}
                                        </p>
                                    </div>
                                </div>
                                <motion.div 
                                    whileHover={{ scale: 1.1 }}
                                    className="text-right"
                                >
                                    <span className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm font-bold shadow-lg">
                                        FREE
                                    </span>
                                </motion.div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Credits Display */}
                {freeGenerationsLeft === 0 && (
                    <div className="mb-6">
                        <CreditsDisplay 
                            credits={credits}
                            onPurchase={() => setShowPurchaseModal(true)}
                        />
                    </div>
                )}

                {/* Need Credits Warning */}
                {needsCredits && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Alert className="mb-6 border-0 bg-gradient-to-r from-amber-50 to-orange-50 shadow-lg">
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                            <AlertDescription className="text-amber-900 font-medium">
                                You've used your free creations. Purchase credits at $0.20 per creation to continue. 💳
                            </AlertDescription>
                        </Alert>
                    </motion.div>
                )}

                {/* Generator Form */}
                <div className="mb-8">
                    <GeneratorForm 
                        onGenerate={handleGenerate}
                        isGenerating={generateMutation.isPending}
                    />
                </div>

                {/* Generated Deck */}
                <AnimatePresence mode="wait">
                    {generatedDeck && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Deck Header */}
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border-0 ring-1 ring-slate-200/50">
                                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
                                    {generatedDeck.title}
                                </h2>
                                <div className="flex flex-wrap gap-3 mb-8 text-sm">
                                    <motion.span 
                                        whileHover={{ scale: 1.05 }}
                                        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-semibold shadow-lg"
                                    >
                                        ✨ {generatedDeck.tone} tone
                                    </motion.span>
                                    <motion.span 
                                        whileHover={{ scale: 1.05 }}
                                        className="px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 rounded-full font-semibold shadow-md"
                                    >
                                        📊 {generatedDeck.slide_count} slides
                                    </motion.span>
                                </div>
                                <DeckActions 
                                    deck={generatedDeck}
                                    onSave={handleSave}
                                    isSaving={saveMutation.isPending}
                                    isSaved={isSaved}
                                />
                            </div>

                            {/* Slides */}
                            <div className="space-y-6">
                                {generatedDeck.slides?.map((slide, index) => (
                                    <SlideCard
                                        key={index}
                                        slide={slide}
                                        index={index}
                                        total={generatedDeck.slide_count}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Purchase Credits Modal */}
                <PurchaseCreditsModal
                    isOpen={showPurchaseModal}
                    onClose={() => setShowPurchaseModal(false)}
                    onPurchase={handlePurchase}
                    isPurchasing={false}
                />
            </div>
        </div>
    );
}