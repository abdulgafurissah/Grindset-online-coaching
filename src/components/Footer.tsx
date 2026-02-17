import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-black-rich border-t border-white/5 py-12 md:py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="relative h-10 w-10">
                                <Image src="/logo.svg" alt="Grindset Logo" fill className="object-contain" />
                            </div>
                            <span className="text-xl font-bold text-white uppercase tracking-tighter">Grindset</span>
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed mb-6">
                            The ultimate fusion of physical training and psychological conditioning. Unlock your true potential today.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="text-white/60 hover:text-brand transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-white/60 hover:text-brand transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-white/60 hover:text-brand transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wider mb-6 text-sm">Navigation</h4>
                        <ul className="space-y-3">
                            <li><Link href="/" className="text-white/60 hover:text-brand text-sm transition-colors">Home</Link></li>
                            <li><Link href="/coaches" className="text-white/60 hover:text-brand text-sm transition-colors">Coaches</Link></li>
                            <li><Link href="/pricing" className="text-white/60 hover:text-brand text-sm transition-colors">Pricing</Link></li>
                            <li><Link href="/register" className="text-white/60 hover:text-brand text-sm transition-colors">Join Now</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wider mb-6 text-sm">Legal</h4>
                        <ul className="space-y-3">
                            <li><Link href="#" className="text-white/60 hover:text-brand text-sm transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-white/60 hover:text-brand text-sm transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="text-white/60 hover:text-brand text-sm transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wider mb-6 text-sm">Contact</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-white/60 text-sm">
                                <Mail className="w-4 h-4 text-brand" />
                                support@grindset.com
                            </li>
                            <li className="text-white/60 text-sm">
                                Dubai, UAE
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/40 text-xs">
                        &copy; {new Date().getFullYear()} Grindset Online Coaching. All rights reserved.
                    </p>
                    <p className="text-white/40 text-xs text-center md:text-right">
                        Forged in Iron & Will.
                    </p>
                </div>
            </div>
        </footer>
    );
}
