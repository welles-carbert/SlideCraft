import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Sparkles } from "lucide-react";

export default function PurchaseCreditsModal({ isOpen, onClose, onPurchase, isPurchasing }) {
    const [selectedAmount, setSelectedAmount] = useState(5);

    const packages = [
        { credits: 10, price: 2.00, popular: false },
        { credits: 25, price: 5.00, popular: true },
        { credits: 50, price: 10.00, popular: false },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-indigo-600" />
                        Purchase Credits
                    </DialogTitle>
                    <DialogDescription className="text-base mt-2">
                        Each creation costs $0.20. Choose a package below.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {packages.map((pkg) => (
                        <button
                            key={pkg.credits}
                            onClick={() => setSelectedAmount(pkg.credits)}
                            className={`relative p-6 rounded-xl border-2 transition-all ${
                                selectedAmount === pkg.credits
                                    ? 'border-indigo-600 bg-indigo-50'
                                    : 'border-slate-200 hover:border-indigo-300'
                            }`}
                        >
                            {pkg.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" />
                                        Popular
                                    </span>
                                </div>
                            )}
                            <div className="text-center">
                                <p className="text-3xl font-bold text-slate-900">{pkg.credits}</p>
                                <p className="text-sm text-slate-600 mt-1">generations</p>
                                <p className="text-2xl font-bold text-indigo-600 mt-4">${pkg.price.toFixed(2)}</p>
                                <p className="text-xs text-slate-500 mt-1">
                                    ${(pkg.price / pkg.credits).toFixed(2)} each
                                </p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="space-y-2 text-sm text-slate-700">
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-600" />
                            <span>Credits never expire</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-600" />
                            <span>No subscription required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-600" />
                            <span>All features included</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isPurchasing}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => onPurchase(selectedAmount)}
                        disabled={isPurchasing}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
                    >
                        {isPurchasing ? 'Processing...' : `Purchase ${selectedAmount} Credits`}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}