import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CreditsDisplay({ credits, onPurchase }) {
    const availableGenerations = Math.floor(credits / 0.2);

    return (
        <Card className="border-0 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
            <CardContent className="p-7">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <motion.div 
                            whileHover={{ scale: 1.1, rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-xl"
                        >
                            <Coins className="w-8 h-8 text-white" />
                        </motion.div>
                        <div>
                            <p className="text-sm font-bold text-indigo-700 uppercase tracking-wide">Creations Available</p>
                            <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mt-1">{availableGenerations}</p>
                        </div>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            onClick={onPurchase}
                            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl transition-all duration-300 px-6 py-6 text-base font-semibold rounded-xl"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Credits
                        </Button>
                    </motion.div>
                </div>
            </CardContent>
        </Card>
    );
}