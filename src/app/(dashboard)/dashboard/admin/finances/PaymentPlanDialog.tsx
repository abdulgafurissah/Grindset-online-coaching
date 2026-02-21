"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { createPaymentPlan, updatePaymentPlan } from "@/app/actions/finance";
import { toast } from "sonner";
import { Plus, Edit, PlusCircle, Trash2 } from "lucide-react";

interface PaymentPlan {
    id: string;
    name: string;
    price: number;
    interval: string;
    features: any;
    isActive: boolean;
    promoPercentage: number;
}

export default function PaymentPlanDialog({ plan }: { plan?: PaymentPlan }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [features, setFeatures] = useState<string[]>(plan?.features || ["Basic Access"]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            price: parseFloat(formData.get("price") as string) || 0,
            interval: formData.get("interval") as string,
            features: features.filter(f => f.trim() !== ""),
            isActive: formData.get("isActive") === "on",
            promoPercentage: parseFloat(formData.get("promoPercentage") as string) || 0
        };

        const result = plan
            ? await updatePaymentPlan(plan.id, data)
            : await createPaymentPlan(data);

        if (result.success) {
            toast.success(plan ? "Plan updated!" : "Plan created!");
            setOpen(false);
        } else {
            toast.error(result.error);
        }
        setIsLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {plan ? (
                    <Button variant="outline" size="sm" className="text-brand border-brand hover:bg-brand/5">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                ) : (
                    <Button className="bg-brand hover:bg-brand-600 text-white shadow-lg shadow-brand/20">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Plan
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{plan ? "Edit Plan" : "Create Payment Plan"}</DialogTitle>
                    <DialogDescription>
                        {plan ? "Modify subscription details." : "Add a new subscription tier for your clients."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-medium">Plan Name</label>
                            <input
                                name="name"
                                defaultValue={plan?.name}
                                required
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Base Price ($)</label>
                            <input
                                name="price"
                                type="number"
                                step="0.01"
                                defaultValue={plan?.price}
                                required
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Interval</label>
                            <select
                                name="interval"
                                defaultValue={plan?.interval || "month"}
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                            >
                                <option value="month">Monthly</option>
                                <option value="year">Yearly</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Promo (%)</label>
                            <select
                                name="promoPercentage"
                                defaultValue={plan?.promoPercentage || 0}
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                            >
                                <option value={0}>0% (No Promo)</option>
                                <option value={5}>5% Off</option>
                                <option value={10}>10% Off</option>
                                <option value={20}>20% Off</option>
                                <option value={50}>50% Off</option>
                                <option value={100}>100% Off (Free)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                        <label className="text-sm font-medium flex items-center justify-between">
                            Features List
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs text-brand hover:text-brand-600 hover:bg-transparent"
                                onClick={() => setFeatures([...features, ""])}
                            >
                                <PlusCircle className="w-3 h-3 mr-1" /> Add Feature
                            </Button>
                        </label>
                        <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                        value={feature}
                                        onChange={(e) => {
                                            const newFeatures = [...features];
                                            newFeatures[idx] = e.target.value;
                                            setFeatures(newFeatures);
                                        }}
                                        placeholder="e.g. 1-on-1 Coaching"
                                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="shrink-0 text-slate-400 hover:text-red-500 border-slate-200"
                                        onClick={() => setFeatures(features.filter((_, i) => i !== idx))}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-4">
                        <input
                            type="checkbox"
                            id={`isActive-${plan?.id || 'new'}`}
                            name="isActive"
                            defaultChecked={plan ? plan.isActive : true}
                            className="w-4 h-4 text-brand rounded border-slate-300 focus:ring-brand"
                        />
                        <label htmlFor={`isActive-${plan?.id || 'new'}`} className="text-sm font-medium leading-none">
                            Active (Visible to Clients)
                        </label>
                    </div>

                    <DialogFooter className="pt-4 border-t border-slate-100">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading} className="bg-brand text-white hover:bg-brand-600">
                            {isLoading ? "Saving..." : "Save Plan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
