"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Plus, Loader2 } from "lucide-react";
import { logProgress, getPresignedUploadUrl, saveProgressPhoto } from "@/app/actions/progress";
import { toast } from "sonner";

export function LogProgressForm() {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);

        const result = await logProgress(formData);
        setLoading(false);

        if (result.success) {
            toast.success("Progress logged successfully!");
            (event.target as HTMLFormElement).reset();
        } else {
            toast.error(result.error || "Failed to log progress");
        }
    }

    return (
        <Card className="bg-black-light border-white/10 text-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-brand" />
                    Log New Metric
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="weight">Weight (lbs)</Label>
                            <Input
                                id="weight"
                                name="weight"
                                type="number"
                                step="0.1"
                                placeholder="185.0"
                                className="bg-white/5 border-white/10 text-white focus:border-brand"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bodyFat">Body Fat (%)</Label>
                            <Input
                                id="bodyFat"
                                name="bodyFat"
                                type="number"
                                step="0.1"
                                placeholder="15.0"
                                className="bg-white/5 border-white/10 text-white focus:border-brand"
                            />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand text-black-rich hover:bg-brand/90 font-bold uppercase tracking-widest"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Progress
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

export function PhotoUpload() {
    const [uploading, setUploading] = useState(false);

    async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const { url, key, error } = await getPresignedUploadUrl(file.name, file.type);

            if (error || !url) {
                toast.error(error || "Failed to get upload URL");
                return;
            }

            const uploadResponse = await fetch(url, {
                method: "PUT",
                body: file,
                headers: {
                    "Content-Type": file.type,
                },
            });

            if (uploadResponse.ok) {
                const saveResult = await saveProgressPhoto(key);
                if (saveResult.success) {
                    toast.success("Photo uploaded successfully!");
                } else {
                    toast.error("Failed to save photo record");
                }
            } else {
                toast.error("Upload failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred during upload");
        } finally {
            setUploading(false);
        }
    }

    return (
        <Card className="bg-black-light border-white/10 text-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-brand" />
                    Progress Photo
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-lg p-8 transition-colors hover:border-brand/50">
                    <input
                        type="file"
                        id="photo-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                    <label
                        htmlFor="photo-upload"
                        className={`flex flex-col items-center gap-2 cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {uploading ? (
                            <Loader2 className="h-10 w-10 text-brand animate-spin" />
                        ) : (
                            <Camera className="h-10 w-10 text-brand/50" />
                        )}
                        <span className="text-sm font-medium text-white/70">
                            {uploading ? "Uploading..." : "Click to upload progress photo"}
                        </span>
                        <span className="text-xs text-white/30 truncate max-w-[200px]">
                            Front, back, or side view
                        </span>
                    </label>
                </div>
            </CardContent>
        </Card>
    );
}
