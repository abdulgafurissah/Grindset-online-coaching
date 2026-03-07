"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createCoach } from "@/app/actions/admin-coach";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Upload, X, ImageIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";

export default function AddCoachPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Image upload state
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size must be less than 5MB");
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData(e.currentTarget);
            let imageUrl = "";

            // 1. Upload image if selected
            if (imageFile) {
                console.log("Starting image upload for:", imageFile.name);
                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: JSON.stringify({
                        filename: imageFile.name,
                        contentType: imageFile.type,
                    }),
                });

                if (!uploadRes.ok) {
                    const errorText = await uploadRes.text();
                    console.error("Upload API error:", errorText);
                    throw new Error(`Failed to get upload URL: ${errorText}`);
                }

                const { uploadUrl, fileUrl } = await uploadRes.json();
                console.log("Got upload URL, proceeding to R2 PUT");

                // Upload to R2
                try {
                    const putRes = await fetch(uploadUrl, {
                        method: "PUT",
                        body: imageFile,
                        headers: {
                            "Content-Type": imageFile.type,
                        },
                    });

                    if (!putRes.ok) {
                        console.error("R2 PUT error:", putRes.status, putRes.statusText);
                        throw new Error(`Failed to upload image to storage (${putRes.status})`);
                    }
                    console.log("R2 upload successful");
                    imageUrl = fileUrl;
                } catch (fetchErr: any) {
                    console.error("R2 fetch exception:", fetchErr);
                    if (fetchErr.name === "TypeError" && fetchErr.message === "Failed to fetch") {
                        throw new Error("Failed to fetch: This is likely a CORS issue. Please ensure your R2 bucket CORS policy allows PUT requests from this domain.");
                    }
                    throw fetchErr;
                }
            }

            // 2. Add imageUrl to formData
            formData.set("image", imageUrl);

            // 3. Create coach
            console.log("Creating coach record in database...");
            const result = await createCoach(null, formData);

            if (result?.error) {
                setError(typeof result.error === "string" ? result.error : "Failed to create coach");
                setLoading(false);
            } else {
                toast.success("Coach created successfully");
                router.push("/dashboard/admin/coaches");
                router.refresh();
            }
        } catch (err: any) {
            console.error("handleSubmit caught error:", err);
            setError(err.message || "An unexpected error occurred");
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-2xl mx-auto">
            <Link href="/dashboard/admin/coaches" className="inline-flex items-center text-slate-500 hover:text-black-rich mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Coaches
            </Link>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-2xl font-bold text-black-rich">Add New Coach</h1>
                    <p className="text-slate-500">Create a profile for a new coach.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Profile Image Upload */}
                        <div className="grid gap-2">
                            <Label>Profile Image</Label>
                            <div
                                className={cn(
                                    "relative h-48 w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all overflow-hidden",
                                    imagePreview ? "border-brand" : "border-slate-200 hover:border-brand/50 bg-slate-50"
                                )}
                            >
                                {imagePreview ? (
                                    <>
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={removeImage}
                                                className="h-8 w-8 p-0 rounded-full"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div
                                        className="cursor-pointer flex flex-col items-center gap-2 p-4 w-full h-full justify-center"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <div className="p-3 bg-white rounded-full shadow-sm border border-slate-100 text-slate-400">
                                            <Upload className="h-6 w-6" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-bold text-black-rich">Click to upload photo</p>
                                            <p className="text-xs text-slate-400 mt-1">PNG, JPG or WebP (Max 5MB)</p>
                                        </div>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" required placeholder="John Doe" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" name="email" type="email" required placeholder="john@example.com" />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required minLength={6} placeholder="••••••••" />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="specialty">Specialty</Label>
                                <Input id="specialty" name="specialty" placeholder="e.g. Bodybuilding" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="commissionRate">Commission Rate (0-1)</Label>
                                <Input id="commissionRate" name="commissionRate" type="number" step="0.01" min="0" max="1" defaultValue="0.8" />
                                <p className="text-xs text-slate-400">0.8 = 80% to Coach</p>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="shortBio">Short Bio (Headline)</Label>
                            <Input id="shortBio" name="shortBio" placeholder="Expert Strength & Conditioning Coach" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="bio">Full Biography</Label>
                            <textarea
                                id="bio"
                                name="bio"
                                className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Describe the coach's background, philosophy, and experience..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Link href="/dashboard/admin/coaches">
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={loading} className="bg-brand text-black-rich hover:bg-brand/90 font-bold">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Create Coach
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Helper for class name joining if not imported
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}

