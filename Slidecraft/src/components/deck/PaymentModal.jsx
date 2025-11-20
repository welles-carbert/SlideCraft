import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Lock } from "lucide-react";

export default function PaymentModal({ isOpen, onClose, onPayment, isProcessing }) {
    const amount = 0.50;
    const title = "Continue Generating";
    const description = "Pay $0.50 to generate another slide deck";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-indigo-600" />
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-base mt-2">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-6 space-y-4">
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                        <div className="text-center">
                            <p className="text-sm text-slate-600 mb-2">Amount to pay</p>
                            <p className="text-5xl font-bold text-slate-900">${amount.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                            <Check className="w-4 h-4 text-green-600" />
                            Generate 1 slide deck
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                            <Check className="w-4 h-4 text-green-600" />
                            No subscription required
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                            <Check className="w-4 h-4 text-green-600" />
                            All features included
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-start gap-2 text-xs text-slate-600">
                            <Lock className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <p>
                                <strong>Demo Mode:</strong> In production, this would integrate with Stripe. 
                                For now, payment is simulated and credits are added instantly.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isProcessing}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onPayment}
                        disabled={isProcessing}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
                    >
                        {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}