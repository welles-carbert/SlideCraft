import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Wand2, Loader2, Upload } from "lucide-react";
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function PresentationUploader({ onImprove, isImproving }) {
    const [content, setContent] = useState('');
    const [focusAreas, setFocusAreas] = useState(['clarity', 'design', 'speaker_notes']);
    const [isUploading, setIsUploading] = useState(false);

    const areas = [
        { id: 'clarity', label: 'Content Clarity & Impact' },
        { id: 'design', label: 'Design & Visual Elements' },
        { id: 'speaker_notes', label: 'Speaker Notes' },
        { id: 'structure', label: 'Flow & Structure' }
    ];

    const toggleArea = (areaId) => {
        setFocusAreas(prev =>
            prev.includes(areaId)
                ? prev.filter(id => id !== areaId)
                : [...prev, areaId]
        );
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const { file_url } = await base44.integrations.Core.UploadFile({ file });
            
            // Fetch file content
            const response = await fetch(file_url);
            const text = await response.text();
            
            setContent(text);
            toast.success('File uploaded successfully!');
        } catch (error) {
            toast.error('Failed to upload file');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (content.trim() && focusAreas.length > 0) {
            onImprove({ content, focusAreas });
        }
    };

    return (
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Upload or Paste */}
                    <div className="space-y-3">
                        <Label className="text-base font-medium text-slate-800">
                            Upload or Paste Your Presentation
                        </Label>
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('file-upload').click()}
                                disabled={isImproving || isUploading}
                                className="flex-1"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload File
                                    </>
                                )}
                            </Button>
                            <input
                                id="file-upload"
                                type="file"
                                accept=".txt,.doc,.docx"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </div>
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Or paste your presentation content here...&#10;&#10;Include slide titles and content, one slide at a time.&#10;&#10;Example:&#10;Slide 1: Introduction&#10;- Welcome to our presentation&#10;- Today we'll cover...&#10;&#10;Slide 2: Main Topic&#10;- Key points..."
                            className="min-h-[200px] resize-none text-base border-slate-200"
                            disabled={isImproving}
                        />
                    </div>

                    {/* Focus Areas */}
                    <div className="space-y-3">
                        <Label className="text-base font-medium text-slate-800">
                            AI Improvement Focus
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {areas.map((area) => (
                                <div key={area.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={area.id}
                                        checked={focusAreas.includes(area.id)}
                                        onCheckedChange={() => toggleArea(area.id)}
                                        disabled={isImproving}
                                    />
                                    <label
                                        htmlFor={area.id}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        {area.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={!content.trim() || focusAreas.length === 0 || isImproving}
                        className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium shadow-lg shadow-purple-200"
                    >
                        {isImproving ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                AI is Improving Your Presentation...
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-5 h-5 mr-2" />
                                Improve with AI
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}