"use client";

import { deletePayment, clearAllPayments } from "@/app/actions/finance";
import { Button } from "@/components/ui/button";
import { Trash2, RotateCcw, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeletePaymentButton({ id }: { id: string }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        const result = await deletePayment(id);
        setLoading(false);

        if (result.success) {
            toast.success("Payment deleted");
        } else {
            toast.error("Failed to delete payment");
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={loading}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
        >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
    );
}

export function ClearAllButton() {
    const [loading, setLoading] = useState(false);

    const handleClear = async () => {
        setLoading(true);
        const result = await clearAllPayments();
        setLoading(false);

        if (result.success) {
            toast.success("All payments cleared");
        } else {
            toast.error("Failed to clear payments");
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700 text-white font-bold">
                    <Trash2 className="mr-2 h-4 w-4" /> Clear All Data
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white border-slate-200">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-black-rich">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-500">
                        This action cannot be undone. This will permanently delete all financial transaction records from the database.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="border-slate-200 text-slate-700 hover:bg-slate-50">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClear} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white font-bold">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Yes, Delete Everything"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
