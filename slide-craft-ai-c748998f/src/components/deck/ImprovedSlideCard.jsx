import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, MessageSquare, Lightbulb, Palette, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ImprovedSlideCard({ slide, index, total }) {
    const [showNotes, setShowNotes] = useState(false);
    const [showDesign, setShowDesign] = useState(false);
    const [showOriginal, setShowOriginal] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <Card className="border border-purple-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-br from-purple-50 to-white border-b border-purple-100 pb-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="text-sm font-medium text-purple-600 mb-2">
                                Slide {slide.slide_number} of {total}
                            </div>
                            <CardTitle className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                                {slide.improved_title}
                            </CardTitle>
                            {slide.original_title && slide.original_title !== slide.improved_title && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowOriginal(!showOriginal)}
                                    className="mt-2 text-xs text-slate-500 hover:text-slate-700"
                                >
                                    <Eye className="w-3 h-3 mr-1" />
                                    {showOriginal ? 'Hide' : 'Show'} Original
                                </Button>
                            )}
                        </div>
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                            <span className="text-lg font-bold text-purple-700">{slide.slide_number}</span>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showOriginal && slide.original_title && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-3 p-3 bg-slate-100 rounded-lg border border-slate-200"
                            >
                                <p className="text-sm text-slate-600 font-medium">Original: {slide.original_title}</p>
                                {slide.original_content && (
                                    <p className="text-xs text-slate-500 mt-1">{slide.original_content}</p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                    {/* Improved Content */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-semibold text-slate-700">Improved Content</span>
                        </div>
                        <ul className="space-y-3">
                            {slide.improved_content?.map((point, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-purple-600 mt-2" />
                                    <span className="text-slate-700 leading-relaxed">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Visual Elements */}
                    {slide.visual_elements && slide.visual_elements.length > 0 && (
                        <div className="pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Palette className="w-4 h-4 text-indigo-600" />
                                <span className="text-sm font-semibold text-slate-700">Suggested Visuals</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {slide.visual_elements.map((element, idx) => (
                                    <Badge key={idx} variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                                        {element}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Design Suggestions */}
                    {slide.design_suggestions && (
                        <div className="pt-3 border-t border-slate-100">
                            <Button
                                variant="ghost"
                                onClick={() => setShowDesign(!showDesign)}
                                className="w-full justify-between text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                            >
                                <span className="flex items-center gap-2">
                                    <Palette className="w-4 h-4" />
                                    Design Suggestions
                                </span>
                                {showDesign ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </Button>

                            <AnimatePresence>
                                {showDesign && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-3 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                                            <p className="text-sm text-slate-700 leading-relaxed">
                                                {slide.design_suggestions}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Speaker Notes */}
                    {slide.speaker_notes && (
                        <div className="pt-3 border-t border-slate-100">
                            <Button
                                variant="ghost"
                                onClick={() => setShowNotes(!showNotes)}
                                className="w-full justify-between text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                            >
                                <span className="flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Speaker Notes
                                </span>
                                {showNotes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </Button>

                            <AnimatePresence>
                                {showNotes && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-3 p-4 bg-amber-50 rounded-lg border border-amber-100">
                                            <p className="text-sm text-slate-700 leading-relaxed italic">
                                                {slide.speaker_notes}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}