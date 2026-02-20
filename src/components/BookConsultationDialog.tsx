
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createConsultation } from "@/app/actions/consultation";
import { toast } from "sonner";
import { Calendar, MessageSquare, Loader2 } from "lucide-react";

interface BookConsultationDialogProps {
    coachId: string;
    coachName: string;
}

export function BookConsultationDialog({ coachId, coachName }: BookConsultationDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        formData.append("coachId", coachId);

        const res = await createConsultation(formData);
        setLoading(false);

        if (res.success) {
            toast.success("Consultation request sent!");
            setOpen(false);
        } else {
            toast.error(res.error || "Failed to book consultation");
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full bg-white text-black-rich border-brand/20 hover:bg-brand/10 hover:border-brand font-bold transition-all">
                    Book Free Consultation
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Book Free Consultation</DialogTitle>
                    <DialogDescription>
                        Request a free 15-minute consultation with {coachName}.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="date" className="text-right">
                            Preferred Date & Time
                        </Label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                                id="date"
                                name="requestedAt"
                                type="datetime-local"
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-right">
                            Message (Optional)
                        </Label>
                        <div className="relative">
                            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Textarea
                                id="message"
                                name="message"
                                placeholder="Tell the coach about your goals..."
                                className="pl-10 min-h-[100px]"
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full bg-brand text-black-rich font-bold" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            "Request Consultation"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
