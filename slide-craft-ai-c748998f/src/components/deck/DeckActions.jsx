import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Copy, Save, Check } from "lucide-react";
import { toast } from "sonner";

export default function DeckActions({ deck, onSave, isSaving, isSaved }) {
    const formatDeckAsText = () => {
        let text = `${deck.title}\n`;
        text += `${'='.repeat(deck.title.length)}\n\n`;
        text += `Tone: ${deck.tone}\n`;
        text += `Slides: ${deck.slide_count}\n\n`;
        text += `${'='.repeat(50)}\n\n`;

        deck.slides.forEach((slide) => {
            text += `SLIDE ${slide.slide_number}: ${slide.title}\n`;
            text += `${'-'.repeat(50)}\n\n`;
            
            slide.bullet_points?.forEach((point) => {
                text += `• ${point}\n`;
            });
            
            if (slide.speaker_notes) {
                text += `\nSpeaker Notes:\n${slide.speaker_notes}\n`;
            }
            
            text += `\n${'='.repeat(50)}\n\n`;
        });

        return text;
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(formatDeckAsText());
            toast.success('Copied to clipboard!');
        } catch (error) {
            toast.error('Failed to copy to clipboard');
        }
    };

    const handleDownload = () => {
        const text = formatDeckAsText();
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${deck.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Download started!');
    };

    return (
        <div className="flex flex-wrap gap-3">
            <Button
                onClick={onSave}
                disabled={isSaving || isSaved}
                className="flex items-center gap-2 bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-md hover:shadow-lg transition-all duration-200 px-5 py-5 font-semibold rounded-xl"
            >
                {isSaved ? (
                    <>
                        <Check className="w-4 h-4 text-green-600" />
                        Saved
                    </>
                ) : (
                    <>
                        <Save className="w-4 h-4" />
                        Save Deck
                    </>
                )}
            </Button>

            <Button
                onClick={handleCopy}
                variant="outline"
                className="flex items-center gap-2 bg-white border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-md hover:shadow-lg transition-all duration-200 px-5 py-5 font-semibold rounded-xl"
            >
                <Copy className="w-4 h-4" />
                Copy to Clipboard
            </Button>

            <Button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-5 py-5 font-semibold rounded-xl"
            >
                <Download className="w-4 h-4" />
                Download as Text
            </Button>
        </div>
    );
}