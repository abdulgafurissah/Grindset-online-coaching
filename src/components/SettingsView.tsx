"use client";

import { useState } from "react";
import { User, Lock, Bell, CreditCard, Save, Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "profile" | "security" | "notifications" | "billing";

export function SettingsView({ user }: { user: any }) {
    const [activeTab, setActiveTab] = useState<Tab>("profile");

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "security", label: "Security", icon: Lock },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "billing", label: "Billing", icon: CreditCard },
    ];

    return (
        <div className="grid gap-8 lg:grid-cols-4">
            {/* Settings Navigation Sidebar */}
            <div className="lg:col-span-1 space-y-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left",
                                isActive
                                    ? "bg-brand text-black-rich font-bold"
                                    : "text-white/70 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-8">
                {activeTab === "profile" && <ProfileSection user={user} />}
                {activeTab === "security" && <SecuritySection />}
                {activeTab === "notifications" && <NotificationsSection />}
                {activeTab === "billing" && <BillingSection />}
            </div>
        </div>
    );
}

function ProfileSection({ user }: { user: any }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-black-rich mb-6 flex items-center gap-2">
                <User className="h-5 w-5 text-brand" />
                Personal Information
            </h2>

            <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500">Full Name</label>
                        <input
                            type="text"
                            defaultValue={user?.name || ""}
                            className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-4 text-black-rich focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500">Email Address</label>
                        <input
                            type="email"
                            defaultValue={user?.email || ""}
                            disabled
                            className="w-full bg-slate-100 border border-slate-200 rounded-md py-2 px-4 text-slate-400 cursor-not-allowed"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500">Bio</label>
                    <textarea
                        rows={4}
                        placeholder="Tell us about your fitness journey..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-4 text-black-rich focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand resize-none"
                    />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button className="flex items-center gap-2 bg-brand text-white font-bold py-2 px-6 rounded-md hover:bg-brand-600 transition-colors shadow-sm">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

function SecuritySection() {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-black-rich mb-6 flex items-center gap-2">
                <Lock className="h-5 w-5 text-brand" />
                Security Settings
            </h2>
            <div className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-black-rich">Change Password</h3>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500">Current Password</label>
                        <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-4 text-black-rich focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500">New Password</label>
                        <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-4 text-black-rich focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500">Confirm New Password</label>
                        <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-md py-2 px-4 text-black-rich focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand" />
                    </div>
                    <div className="pt-2 flex justify-end">
                        <button className="flex items-center gap-2 bg-brand text-white font-bold py-2 px-6 rounded-md hover:bg-brand-600 transition-colors shadow-sm">
                            Update Password
                        </button>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <h3 className="text-lg font-bold text-black-rich mb-4">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-brand/10 rounded-full flex items-center justify-center text-brand">
                                <Lock className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-bold text-black-rich">Protect your account</p>
                                <p className="text-sm text-slate-500">Add an extra layer of security.</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 border border-slate-300 text-black-rich font-bold bg-white rounded-md hover:bg-slate-50 transition-colors text-sm shadow-sm">
                            Enable
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function NotificationsSection() {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-black-rich mb-6 flex items-center gap-2">
                <Bell className="h-5 w-5 text-brand" />
                Notification Preferences
            </h2>
            <div className="space-y-6">
                {[
                    "Email me when a coach messages me",
                    "Marketing and promotional offers"
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                        <span className="text-slate-600 font-medium">{item}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={i < 1} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                        </label>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
                <button className="flex items-center gap-2 bg-brand text-white font-bold py-2 px-6 rounded-md hover:bg-brand-600 transition-colors shadow-sm">
                    <Save className="w-4 h-4" />
                    Save Preferences
                </button>
            </div>
        </div>
    );
}

function BillingSection() {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-black-rich mb-6 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-brand" />
                Billing & Subscription
            </h2>

            <div className="space-y-8">
                <div className="p-6 bg-brand/5 border border-brand/20 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-brand font-bold uppercase tracking-widest text-sm mb-1">Current Plan</p>
                            <h3 className="text-2xl font-black text-black-rich">ELITE MEMBER</h3>
                        </div>
                        <span className="bg-brand text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Active</span>
                    </div>
                    <p className="text-slate-600 mb-6">Your next billing date is <span className="text-black-rich font-bold">March 15, 2026</span>.</p>
                    <div className="flex gap-4">
                        <button className="bg-brand text-white font-bold py-2 px-6 rounded-md hover:bg-brand-600 transition-colors shadow-sm">
                            Manage Subscription
                        </button>
                        <button className="border border-slate-200 text-slate-700 bg-white shadow-sm font-medium py-2 px-6 rounded-md hover:bg-slate-50 transition-colors">
                            View Invoices
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-black-rich mb-4">Payment Methods</h3>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 mb-4">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-14 bg-white border border-slate-200 rounded flex items-center justify-center">
                                <span className="font-bold text-slate-400 text-xs">VISA</span>
                            </div>
                            <div>
                                <p className="font-bold text-black-rich">Visa ending in 4242</p>
                                <p className="text-sm text-slate-500">Expires 12/28</p>
                            </div>
                        </div>
                        <button className="text-brand text-sm font-bold hover:underline">Edit</button>
                    </div>
                    <button className="flex items-center gap-2 text-brand hover:text-brand-600 text-sm font-bold uppercase tracking-wide">
                        + Add Payment Method
                    </button>
                </div>
            </div>
        </div>
    );
}
