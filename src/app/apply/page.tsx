"use client";

import { Navbar } from "@/components/Navbar";
import { useState } from "react";
import { submitApplication } from "@/app/actions/application";

export default function ApplyPage() {
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(formData: FormData) {
        setSubmitting(true);
        const result = await submitApplication(formData);
        setSubmitting(false);
        if (result.success) {
            setSuccess(true);
        } else {
            alert("Something went wrong. Please try again.");
        }
    }

    if (success) {
        return (
            <main className="min-h-screen bg-black-rich text-white">
                <Navbar />
                <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <h1 className="text-4xl font-bold text-brand mb-4">Application Received</h1>
                    <p className="text-white/60 max-w-md">
                        We have received your application. A team member will review it and get back to you shortly.
                    </p>
                    <a href="/" className="mt-8 text-white hover:text-brand underline underline-offset-4">Return Home</a>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black-rich text-white">
            <Navbar />
            <div className="container mx-auto px-4 py-24 max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 text-center">
                    Join the <span className="text-brand">Movement</span>
                </h1>
                <p className="text-center text-white/60 mb-12">
                    Apply to become a client or join our team of elite coaches.
                </p>

                <form action={handleSubmit} className="bg-black-light border border-white/10 p-8 rounded-2xl space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wide text-white/80">Application Type</label>
                        <select name="type" className="w-full bg-black-rich border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand transition-colors">
                            <option value="CLIENT">I want to be Coached (Client)</option>
                            <option value="COACH">I want to Coach (Coach)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wide text-white/80">Full Name</label>
                        <input name="name" type="text" required placeholder="John Doe" className="w-full bg-black-rich border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand transition-colors" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wide text-white/80">Email Address</label>
                        <input name="email" type="email" required placeholder="john@example.com" className="w-full bg-black-rich border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand transition-colors" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wide text-white/80">Tell us about your goals / experience</label>
                        <textarea name="details" required rows={4} className="w-full bg-black-rich border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand transition-colors" placeholder="I want to lose 10lbs..." />
                    </div>

                    <button disabled={submitting} type="submit" className="w-full bg-brand hover:bg-brand-600 text-black-rich font-bold py-4 rounded-lg uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        {submitting ? "Submitting..." : "Submit Application"}
                    </button>
                </form>
            </div>
        </main>
    );
}
