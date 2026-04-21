import React, { useState, useEffect } from 'react';
import { Facebook, Twitter, Instagram, Youtube, Truck, Mail, Phone, MapPin, Heart, ShieldCheck, Star } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import hgLogoPremium from '../assets/logo_final.jpg';
import { useShop } from '../../../context/ShopContext';


const Footer = () => {
    const { settings: globalSettings } = useShop();
    const location = useLocation();
    const isOrderSuccess = location.pathname === '/order-success';


    const [settings, setSettings] = useState({
        footerTagline: 'Timeless Elegance,',
        footerSubTagline: 'Crafted for You.',
        footerDescription: 'HG Enterprises brings you the finest handcrafted jewellery, blending traditional artistry with modern sophistication. Discover a world of exquisite brilliance.',
        address: 'RNO.4 GULBERG CHAWL DAMU, NAGAR AKURLI ROAD, Kandivali East, Mumbai, Maharashtra, India, 400101',
        phone: '+91 877 900 7979',
        email: 'concierge@hgjewels.com',

        footerColumn1Title: 'Experience',
        footerColumn2Title: 'Policies',
        footerColumn3Title: 'Our World',

        footerExperienceLinks: [
            { name: "Easy Returns", path: "/returns" },
            { name: "Contact Us", path: "/contact" },
            { name: "FAQs", path: "/help" },
            { name: "Blogs", path: "/blogs" },
        ],
        footerPoliciesLinks: [
            { name: "Shipping Policy", path: "/shipping-policy" },
            { name: "Privacy Policy", path: "/privacy" },
            { name: "Cancellation Policy", path: "/cancellation-policy" },
            { name: "Terms & Conditions", path: "/terms" },
        ],
        footerWorldLinks: [
            { name: "About Us", path: "/about" },
            { name: "Jewellery Care Guide", path: "/care-guide" },
            { name: "Store Locator", path: "/stores" },
            { name: "Our Craft", path: "/craft" },
        ],
        socialLinks: {
            facebook: '#',
            twitter: '#',
            instagram: '#',
            youtube: '#'
        },
        footerDeliveryText: 'Safe & Express Pan India Delivery',
        footerCopyrightText: `HG Enterprises. All Rights Reserved.`
    });

    useEffect(() => {
        if (globalSettings) {
            setSettings(prev => ({ ...prev, ...globalSettings }));
        }
    }, [globalSettings]);


    if (isOrderSuccess) return null;

    return (
        <footer className="relative bg-[#0a0a0a] pt-6 md:pt-12 pb-3 md:pb-6 overflow-hidden text-white">
            {/* Decorative Top Border - Luxury Gold Gradient */}
            <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#8B4356] via-[#eecad5] to-[#8B4356]"></div>

            {/* Background Accent - Deep Charcoal */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-zinc-900/50 -z-0 skew-x-[-15deg] translate-x-1/2 md:block hidden"></div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 mb-6 md:mb-12">

                    {/* Brand Identity Section - Synced with Navbar */}
                    <div className="lg:col-span-4 space-y-4">
                        <Link to="/" aria-label="Harshad Gauri Enterprises Home" className="flex items-center gap-4 group">
                            <div className="relative">
                                <img src={hgLogoPremium} alt="HG Enterprises Logo" className="h-[50px] md:h-[60px] w-auto object-contain brightness-110" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-serif text-lg md:text-xl font-light tracking-wider leading-none group-hover:text-[#8B4356] transition-colors">
                                    Harshad Gauri
                                </span>
                                <span className="text-[#8B4356] font-serif italic text-[10px] md:text-[12px] tracking-[0.25em] pb-1">
                                    enterprises
                                </span>
                            </div>
                        </Link>
                        <div className="space-y-1 md:space-y-2">
                            <h3 className="text-xl md:text-2xl font-display text-white leading-tight font-bold">
                                {settings.footerTagline} <br className="hidden md:block" />
                                <span className="italic font-serif text-[#8B4356] font-normal text-lg md:text-2xl">{settings.footerSubTagline}</span>
                            </h3>
                            <p className="text-zinc-400 font-serif text-[11px] md:text-sm leading-relaxed max-w-sm hidden md:block">
                                {settings.footerDescription}
                            </p>
                        </div>

                        {/* Trust Badges - More Compact */}
                        <div className="flex gap-4 pt-1">
                            <div className="flex flex-col items-center gap-1">
                                <div className="w-8 h-8 rounded-full bg-zinc-800/80 flex items-center justify-center text-[#8B4356] border border-zinc-700/50">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                                <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Secure</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="w-8 h-8 rounded-full bg-zinc-800/80 flex items-center justify-center text-[#8B4356] border border-zinc-700/50">
                                    <Star className="w-4 h-4" />
                                </div>
                                <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Premium</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="w-8 h-8 rounded-full bg-zinc-800/80 flex items-center justify-center text-[#8B4356] border border-zinc-700/50">
                                    <Heart className="w-4 h-4" />
                                </div>
                                <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Verified</span>
                            </div>
                        </div>
                    </div>

                    {/* Links Grid - High Contrast */}
                    <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        <div className="space-y-4">
                            <h4 className="font-display text-white font-bold uppercase tracking-[0.25em] text-[11px] border-b border-zinc-800 pb-2 inline-block transition-all hover:border-[#8B4356] cursor-default">{settings.footerColumn1Title}</h4>
                            <ul className="space-y-3">
                                {settings.footerExperienceLinks?.map((link, idx) => (
                                    <li key={idx}>
                                        <Link to={link.path} className="text-xs text-zinc-400 font-medium hover:text-white transition-all hover:pl-2 flex items-center gap-2 group">
                                            <span className="w-1 h-1 bg-[#8B4356] rounded-full opacity-0 group-hover:opacity-100 transition-all"></span>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-display text-white font-bold uppercase tracking-[0.25em] text-[10px] border-b border-zinc-800 pb-1 inline-block">{settings.footerColumn2Title}</h4>
                            <ul className="space-y-2">
                                {settings.footerPoliciesLinks?.map((link, idx) => (
                                    <li key={idx}>
                                        <Link to={link.path} className="text-xs text-zinc-400 font-medium hover:text-white transition-all hover:pl-2 flex items-center gap-2 group">
                                            <span className="w-1 h-1 bg-[#8B4356] rounded-full opacity-0 group-hover:opacity-100 transition-all"></span>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-display text-white font-bold uppercase tracking-[0.25em] text-[11px] border-b border-zinc-800 pb-2 inline-block transition-all hover:border-[#8B4356] cursor-default">{settings.footerColumn3Title}</h4>
                            <ul className="space-y-3">
                                {settings.footerWorldLinks?.map((link, idx) => (
                                    <li key={idx}>
                                        <Link to={link.path} className="text-xs text-zinc-400 font-medium hover:text-white transition-all hover:pl-2 flex items-center gap-2 group">
                                            <span className="w-1 h-1 bg-[#8B4356] rounded-full opacity-0 group-hover:opacity-100 transition-all"></span>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Contact & Social Section - Compact Dark Glassmorphism */}
                    <div className="lg:col-span-3 space-y-4 bg-white/5 backdrop-blur-md p-4 md:p-6 rounded-[2rem] border border-white/10 shadow-xl">
                        <div className="space-y-3">
                            <h4 className="font-display text-[#8B4356] font-bold uppercase tracking-[0.2em] text-[10px]">Connect Directly</h4>
                            <div className="space-y-2">
                                <a href={`mailto:${settings.email}`} className="flex items-center gap-3 group">
                                    <div className="w-8 h-8 bg-zinc-800 text-white rounded-lg flex items-center justify-center border border-white/5">
                                        <Mail className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-[11px] md:text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">{settings.email}</span>
                                </a>
                                <a href={`tel:${settings.phone}`} className="flex items-center gap-3 group">
                                    <div className="w-8 h-8 bg-zinc-800 text-white rounded-lg flex items-center justify-center border border-white/5">
                                        <Phone className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-[11px] md:text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">{settings.phone}</span>
                                </a>
                                <div className="flex items-start gap-3 group">
                                    <div className="w-8 h-8 bg-zinc-800 text-white rounded-lg flex items-center justify-center border border-white/5 shrink-0">
                                        <MapPin className="w-3.5 h-3.5 text-[#8B4356]" />
                                    </div>
                                    <span className="text-[10px] md:text-xs font-serif italic text-zinc-400 leading-tight pt-0.5">{settings.address}</span>
                                </div>
                            </div>
                        </div>

                        {/* Social Icons - Gold Border Style */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-zinc-500">Social Gallery</p>
                            <div className="flex gap-4">
                                {[
                                    { Icon: Facebook, link: settings.socialLinks?.facebook, label: "Facebook" },
                                    { Icon: Twitter, link: settings.socialLinks?.twitter, label: "Twitter" },
                                    { Icon: Instagram, link: settings.socialLinks?.instagram, label: "Instagram" },
                                    { Icon: Youtube, link: settings.socialLinks?.youtube, label: "Youtube" }
                                ].map((social, i) => (
                                    <a key={i} href={social.link || '#'} target="_blank" rel="noreferrer" aria-label={`Follow us on ${social.label}`} className="w-9 h-9 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 hover:border-[#8B4356] hover:bg-[#8B4356] hover:text-white hover:-translate-y-1 transition-all duration-500 shadow-xl">
                                        <social.Icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fraud Disclaimer - Warning Tone Redefined */}
                <div className="mb-4 border border-red-900/30 bg-red-950/20 rounded-lg p-2 flex items-center justify-center max-w-4xl mx-auto backdrop-blur-sm">
                    <ShieldCheck className="w-4 h-4 text-red-500 shrink-0" />
                    <p className="text-[9px] text-zinc-400 font-medium leading-tight text-center px-1">
                        {settings.fraudWarning || "BEWARE OF FRAUD: HG Enterprises will NEVER ask for OTPs or personal info."}
                    </p>
                </div>

                {/* Bottom Bar: Compact Brand Promise */}
                <div className="pt-4 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3 bg-[#8B4356]/10 px-4 py-1.5 rounded-full border border-[#8B4356]/20 shadow-inner">
                        <Truck className="w-4 h-4 text-[#8B4356]" />
                        <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#8B4356]">{settings.footerDeliveryText}</span>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-1.5">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-medium">
                            &copy; {new Date().getFullYear()} {settings.footerCopyrightText}
                        </p>
                        <p className="text-[10px] text-zinc-600 font-serif italic tracking-wide">Industrial & Creative Perfection</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
