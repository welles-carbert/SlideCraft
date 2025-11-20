import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";

export default function GeneratorForm({ onGenerate, isGenerating }) {
    const [topic, setTopic] = useState('');
    const [tone, setTone] = useState('professional');
    const [slideCount, setSlideCount] = useState('10');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (topic.trim()) {
            onGenerate({ topic, tone, slideCount: parseInt(slideCount) });
        }
    };

    return (
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-xl hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden ring-1 ring-slate-200/50">
            <CardContent className="p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                        <Label htmlFor="topic" className="text-base font-medium text-slate-800">
                            Your Topic or Ideas
                        </Label>
                        <Textarea
                            id="topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Enter your presentation topic, key points, or rough ideas...&#10;&#10;Example: 'The future of renewable energy, focusing on solar and wind power, cost reduction trends, and adoption challenges'"
                            className="min-h-[140px] resize-none text-base border-slate-200 focus:border-indigo-400 transition-colors"
                            disabled={isGenerating}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label htmlFor="tone" className="text-base font-medium text-slate-800">
                                Presentation Tone
                            </Label>
                            <Select value={tone} onValueChange={setTone} disabled={isGenerating}>
                                <SelectTrigger id="tone" className="border-slate-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="professional">Professional</SelectItem>
                                    <SelectItem value="academic">Academic</SelectItem>
                                    <SelectItem value="persuasive">Persuasive</SelectItem>
                                    <SelectItem value="simple">Simple</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="length" className="text-base font-medium text-slate-800">
                                Deck Length
                            </Label>
                            <Select value={slideCount} onValueChange={setSlideCount} disabled={isGenerating}>
                                <SelectTrigger id="length" className="border-slate-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5 Slides</SelectItem>
                                    <SelectItem value="10">10 Slides</SelectItem>
                                    <SelectItem value="15">15 Slides</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={!topic.trim() || isGenerating}
                        className="w-full h-14 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold text-lg shadow-2xl shadow-indigo-300 hover:shadow-3xl transition-all duration-300 rounded-xl"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Creating Your Deck...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5 mr-2" />
                                Create Slide Deck
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}