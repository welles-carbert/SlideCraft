import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SlideCard({ slide, index, total }) {
    const [showNotes, setShowNotes] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
        >
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden ring-1 ring-slate-200/50 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-b border-slate-100 pb-5">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="text-sm font-bold text-indigo-600 mb-3 uppercase tracking-wider">
                                Slide {slide.slide_number} of {total}
                            </div>
                            <CardTitle className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                                {slide.title}
                            </CardTitle>
                        </div>
                        <motion.div 
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg"
                        >
                            <span className="text-xl font-bold text-white">{slide.slide_number}</span>
                        </motion.div>
                    </div>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                    <ul className="space-y-3">
                        {slide.bullet_points?.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2" />
                                <span className="text-slate-700 leading-relaxed">{point}</span>
                            </li>
                        ))}
                    </ul>

                    {slide.speaker_notes && (
                        <div className="pt-4 border-t border-slate-100">
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
                                        transition={{ duration: 0.2 }}
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