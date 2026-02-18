"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { registerCoach } from "@/app/actions/coach-registration";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Upload, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";

export default function CoachRegistrationForm() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        // 1. Personal
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "",
        dob: "",
        nationality: "",
        phoneNumber: "",
        image: null as File | null,

        // 2. Professional
        specializations: [] as string[],
        otherSpecialization: "",
        experienceYears: 0,
        certifications: [] as File[],
        bio: "",
        languages: "",

        // 3. Coaching
        coachingTypes: [] as string[],
        pricingModel: "Monthly",
        priceAmount: 0,
        availability: "",

        // 4. Social
        instagram: "",
        youtube: "",
        tiktok: "",
        website: "",
        portfolio: [] as File[],

        // 5. Legal
        idDocument: null as File | null,
        agreeTerms: false,
        agreePrivacy: false,
        consentBackground: false,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxGroup = (group: "specializations" | "coachingTypes", value: string, checked: boolean) => {
        setFormData(prev => {
            const current = prev[group];
            if (checked) {
                return { ...prev, [group]: [...current, value] };
            } else {
                return { ...prev, [group]: current.filter(item => item !== value) };
            }
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "image" | "certifications" | "portfolio" | "idDocument") => {
        if (e.target.files && e.target.files.length > 0) {
            if (field === "certifications" || field === "portfolio") {
                setFormData(prev => ({ ...prev, [field]: Array.from(e.target.files!) }));
            } else {
                setFormData(prev => ({ ...prev, [field]: e.target.files![0] }));
            }
        }
    };

    const handleSubmit = async () => {
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (!formData.name || !formData.email || !formData.password) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        const data = new FormData();
        // Append all simple fields
        Object.entries(formData).forEach(([key, value]) => {
            if (key === "image" || key === "certifications" || key === "portfolio" || key === "idDocument") return;
            if (key === "specializations" || key === "coachingTypes") {
                data.append(key, JSON.stringify(value));
            } else {
                data.append(key, String(value));
            }
        });

        // Append files
        if (formData.image) data.append("image", formData.image);
        if (formData.idDocument) data.append("idDocument", formData.idDocument);
        formData.certifications.forEach(f => data.append("certifications", f));
        formData.portfolio.forEach(f => data.append("portfolio", f));

        const result = await registerCoach(data);
        setLoading(false);

        if (result.success) {
            toast.success("Application Submitted Successfully!");
            router.push("/login?message=Application under review");
        } else {
            toast.error(result.error || "Registration failed");
        }
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 max-w-3xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
                    <span>Personal</span>
                    <span>Professional</span>
                    <span>Coaching</span>
                    <span>Social</span>
                    <span>Legal</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand transition-all duration-300 ease-out" style={{ width: `${(step / 5) * 100}%` }}></div>
                </div>
            </div>

            <div className="space-y-6">
                {/* STEP 1: Personal Information */}
                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold text-black-rich">Personal Information</h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address *</Label>
                                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="john@example.com" />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password *</Label>
                                <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} required />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="+1 234 567 8900" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input id="dob" name="dob" type="date" value={formData.dob} onChange={handleInputChange} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Profile Photo</Label>
                            <div className="flex items-center gap-4">
                                <Input id="image" type="file" accept="image/*" onChange={(e) => handleFileChange(e, "image")} className="cursor-pointer" />
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: Professional Information */}
                {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold text-black-rich">Professional Information</h2>

                        <div className="space-y-2">
                            <Label>Fitness Specialization *</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {["Weight Loss", "Muscle Building", "Body Recomposition", "Strength Training", "CrossFit", "Yoga", "Pilates", "Senior Fitness"].map((spec) => (
                                    <div key={spec} className="flex items-center space-x-2">
                                        <Checkbox id={`spec-${spec}`}
                                            checked={formData.specializations.includes(spec)}
                                            onCheckedChange={(checked) => handleCheckboxGroup("specializations", spec, checked as boolean)}
                                        />
                                        <Label htmlFor={`spec-${spec}`}>{spec}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="experienceYears">Years of Experience</Label>
                            <Input id="experienceYears" name="experienceYears" type="number" min="0" value={formData.experienceYears} onChange={handleInputChange} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio / About Me</Label>
                            <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} placeholder="Tell us about your journey and coaching philosophy..." rows={5} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="certifications">Certifications (Upload)</Label>
                            <Input id="certifications" type="file" multiple accept=".pdf,.jpg,.png" onChange={(e) => handleFileChange(e, "certifications")} />
                        </div>
                    </div>
                )}

                {/* STEP 3: Coaching Details */}
                {step === 3 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold text-black-rich">Coaching Details</h2>

                        <div className="space-y-2">
                            <Label>Coaching Type *</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {["Online 1-on-1", "Group Coaching", "Nutrition Coaching", "Custom Plans"].map((type) => (
                                    <div key={type} className="flex items-center space-x-2">
                                        <Checkbox id={`type-${type}`}
                                            checked={formData.coachingTypes.includes(type)}
                                            onCheckedChange={(checked) => handleCheckboxGroup("coachingTypes", type, checked as boolean)}
                                        />
                                        <Label htmlFor={`type-${type}`}>{type}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="pricingModel">Pricing Model</Label>
                                <select
                                    id="pricingModel" name="pricingModel"
                                    value={formData.pricingModel}
                                    onChange={handleInputChange}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="Monthly">Monthly Subscription</option>
                                    <option value="Per Session">Per Session</option>
                                    <option value="Fixed Program">12-Week Program</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="priceAmount">Price Amount ($)</Label>
                                <Input id="priceAmount" name="priceAmount" type="number" min="0" value={formData.priceAmount} onChange={handleInputChange} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="availability">Availability / Time Zone</Label>
                            <Input id="availability" name="availability" value={formData.availability} onChange={handleInputChange} placeholder="e.g. EST, Mon-Fri 9am-5pm" />
                        </div>
                    </div>
                )}

                {/* STEP 4: Social */}
                {step === 4 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold text-black-rich">Social & Online Presence</h2>

                        <div className="space-y-2">
                            <Label htmlFor="instagram">Instagram Profile</Label>
                            <Input id="instagram" name="instagram" value={formData.instagram} onChange={handleInputChange} placeholder="@username" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="youtube">YouTube Channel</Label>
                            <Input id="youtube" name="youtube" value={formData.youtube} onChange={handleInputChange} placeholder="Channel URL" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="website">Personal Website</Label>
                            <Input id="website" name="website" value={formData.website} onChange={handleInputChange} placeholder="https://..." />
                        </div>
                    </div>
                )}

                {/* STEP 5: Legal */}
                {step === 5 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold text-black-rich">Legal & Verification</h2>

                        <div className="space-y-2">
                            <Label htmlFor="idDocument">Government ID Upload *</Label>
                            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors">
                                <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                                <Input id="idDocument" type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, "idDocument")} className="hidden" />
                                <Label htmlFor="idDocument" className="cursor-pointer text-brand font-medium">Click to upload ID</Label>
                                <p className="text-xs text-slate-400 mt-1">{formData.idDocument ? formData.idDocument.name : "PNG, JPG or PDF up to 5MB"}</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-start space-x-2">
                                <Checkbox id="agreeTerms" checked={formData.agreeTerms} onCheckedChange={(c) => setFormData(prev => ({ ...prev, agreeTerms: c as boolean }))} />
                                <Label htmlFor="agreeTerms" className="text-sm">I agree to the Terms & Conditions and acknowledge that my application is subject to approval.</Label>
                            </div>
                            <div className="flex items-start space-x-2">
                                <Checkbox id="agreePrivacy" checked={formData.agreePrivacy} onCheckedChange={(c) => setFormData(prev => ({ ...prev, agreePrivacy: c as boolean }))} />
                                <Label htmlFor="agreePrivacy" className="text-sm">I agree to the Privacy Policy.</Label>
                            </div>
                            <div className="flex items-start space-x-2">
                                <Checkbox id="consentBackground" checked={formData.consentBackground} onCheckedChange={(c) => setFormData(prev => ({ ...prev, consentBackground: c as boolean }))} />
                                <Label htmlFor="consentBackground" className="text-sm">I consent to a background check.</Label>
                            </div>
                        </div>
                    </div>
                )}


                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-slate-100 mt-8">
                    {step > 1 ? (
                        <Button variant="outline" onClick={prevStep}>
                            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                        </Button>
                    ) : <div></div>}

                    {step < 5 ? (
                        <Button onClick={nextStep} className="bg-brand text-black-rich font-bold hover:bg-brand/90">
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={loading || !formData.agreeTerms || !formData.agreePrivacy} className="bg-brand text-black-rich font-bold hover:bg-brand/90">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit Application"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
