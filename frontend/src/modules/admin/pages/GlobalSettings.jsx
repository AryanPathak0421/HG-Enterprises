import React, { useState, useEffect } from 'react';
import {
    Save, Truck, AlertTriangle, MapPin, Phone, Mail, Globe, Check, Edit3,
    RefreshCw, Repeat, CreditCard, Shield, Bell, Plus, Trash2, Tag, Gift,
    Star, Zap, Headset, Upload, X, ChevronDown, ChevronUp, Eye, EyeOff, Facebook, Twitter, Instagram, Youtube, Layout
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { useShop } from '../../../context/ShopContext';
import api from '../../../utils/api';


const GlobalSettings = () => {
    const { settings: globalSettings, setSettings: setGlobalSettings } = useShop();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Initial State from Context or Defaults
    const [settings, setSettings] = useState(globalSettings || {
        productHeader: 'ESTIMATED DELIVERY DATE',
        returnPolicy: '2 Days Return',

        exchangePolicy: '10 Days Exchange',
        codPolicy: 'Cash On Delivery',
        warrantyText: 'Lifetime Warranty',
        safetyText: 'Skin Safe Jewellery',
        platingText: '18k Gold Tone Plated',
        announcementItems: [
            { id: 1, icon: 'Truck', text: 'Free Shipping' },
            { id: 2, icon: 'Shield', text: 'Secure Payments' },
            { id: 3, icon: 'RefreshCw', text: 'Easy Returns & Refunds' },
            { id: 4, icon: 'Headset', text: 'Dedicated Support Team' }
        ],
        fraudWarning: 'BEWARE OF FRAUD: HG Enterprises never asks for confidential banking details over phone or email.',
        address: '45/2, Golden Plaza, Business District, Jaipur',
        phone: '+91 91234 56789',
        email: 'admin@hgenterprises.com',
        website: 'www.hgenterprises.com',

        // Footer Settings
        footerTagline: 'Exquisite Artistry,',
        footerSubTagline: 'Individually Crafted for You.',
        footerDescription: 'Every piece at HG Enterprises tells a story of modern luxury and timeless craftsmanship. Join us in celebrating life\'s most precious moments.',

        footerColumn1Title: 'Experience',
        footerColumn2Title: 'Policies',
        footerColumn3Title: 'Our World',

        // ... (rest should be fine as path based)
        footerExperienceLinks: [
            { id: 1, name: "Easy Returns", path: "/returns" },
            { id: 2, name: "Contact Us", path: "/contact" },
            { id: 3, name: "FAQs", path: "/help" },
            { id: 4, name: "Blogs", path: "/blogs" },
        ],
        footerPoliciesLinks: [
            { id: 1, name: "Shipping Policy", path: "/shipping-policy" },
            { id: 2, name: "Privacy Policy", path: "/privacy" },
            { id: 3, name: "Cancellation Policy", path: "/cancellation-policy" },
            { id: 4, name: "Terms & Conditions", path: "/terms" },
        ],
        footerWorldLinks: [
            { id: 1, name: "About Us", path: "/about" },
            { id: 2, name: "Jewellery Care Guide", path: "/care-guide" },
            { id: 3, name: "Store Locator", path: "/stores" },
            { id: 4, name: "Our Craft", path: "/craft" },
        ],

        socialLinks: {
            facebook: '#',
            twitter: '#',
            instagram: '#',
            youtube: '#'
        },

        footerDeliveryText: 'Safe & Insured Express Worldwide Delivery',
        footerCopyrightText: 'HG Enterprises Pvt Ltd. All Rights Reserved.'
    });


    useEffect(() => {
        if (globalSettings) {
            setSettings(globalSettings);
        }
    }, [globalSettings]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await api.post('/settings', settings);
            setGlobalSettings(res.data);
            setIsSaving(false);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating settings:', error);
            setIsSaving(false);
        }
    };


    const handleChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (parentField, key, value) => {
        setSettings(prev => ({
            ...prev,
            [parentField]: {
                ...prev[parentField],
                [key]: value
            }
        }));
    };

    // Announcement Handlers
    const handleAnnouncementChange = (id, field, value) => {
        setSettings(prev => ({
            ...prev,
            announcementItems: prev.announcementItems.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        }));
    };

    const addAnnouncement = () => {
        const newId = Math.max(...settings.announcementItems.map(i => i.id), 0) + 1;
        setSettings(prev => ({
            ...prev,
            announcementItems: [...prev.announcementItems, { id: newId, icon: 'Tag', text: '' }]
        }));
    };

    const removeAnnouncement = (id) => {
        setSettings(prev => ({
            ...prev,
            announcementItems: prev.announcementItems.filter(item => item.id !== id)
        }));
    };

    // Generic Link List Handlers (for Footer)
    const handleLinkChange = (listName, id, field, value) => {
        setSettings(prev => ({
            ...prev,
            [listName]: prev[listName].map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        }));
    };

    const addLink = (listName) => {
        const newId = Math.max(...settings[listName].map(i => i.id), 0) + 1;
        setSettings(prev => ({
            ...prev,
            [listName]: [...prev[listName], { id: newId, name: 'New Link', path: '/' }]
        }));
    };

    const removeLink = (listName, id) => {
        setSettings(prev => ({
            ...prev,
            [listName]: prev[listName].filter(item => item.id !== id)
        }));
    };

    // Dashboard Layout Handlers
    const moveSection = (index, direction) => {
        if (!settings.dashboardLayout) return;
        const newLayout = [...settings.dashboardLayout];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newLayout.length) return;

        [newLayout[index], newLayout[newIndex]] = [newLayout[newIndex], newLayout[index]];

        // Update orders
        const finalLayout = newLayout.map((s, i) => ({ ...s, order: i + 1 }));
        setSettings(prev => ({ ...prev, dashboardLayout: finalLayout }));
    };

    const toggleSection = (id) => {
        if (!settings.dashboardLayout) return;
        setSettings(prev => ({
            ...prev,
            dashboardLayout: prev.dashboardLayout.map(s =>
                s.id === id ? { ...s, enabled: !s.enabled } : s
            )
        }));
    };

    return (
        <div className="max-w-[1200px] mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-20 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                <PageHeader
                    title="Global Settings"
                    subtitle="Manage store-wide text, alerts, and contact information"
                />

                <div className="flex items-center gap-3">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => setIsEditing(false)}
                                disabled={isSaving}
                                className="px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-[#3E2723] text-white hover:bg-[#5D4037] transition-all shadow-sm active:scale-95"
                            >
                                {isSaving ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                <span>{isSaving ? 'Saved' : 'Save Changes'}</span>
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                        >
                            <Edit3 className="w-4 h-4" />
                            <span>Edit Settings</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Product Highlights Section */}
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                    <div>
                        <h3 className="text-xl font-serif font-bold text-[#3E2723]">Product Page Policies</h3>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Manage delivery, return, and payment text</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                <Truck className="w-3 h-3" />
                                <span>Section Header Title</span>
                            </label>
                            <input
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3E2723]/10 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                                value={settings.productHeader}
                                onChange={(e) => handleChange('productHeader', e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                <RefreshCw className="w-3 h-3" />
                                <span>Return Policy Text</span>
                            </label>
                            <input
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3E2723]/10 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                                value={settings.returnPolicy}
                                onChange={(e) => handleChange('returnPolicy', e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                <Repeat className="w-3 h-3" />
                                <span>Exchange Policy Text</span>
                            </label>
                            <input
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3E2723]/10 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                                value={settings.exchangePolicy}
                                onChange={(e) => handleChange('exchangePolicy', e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                <CreditCard className="w-3 h-3" />
                                <span>COD / Payment Text</span>
                            </label>
                            <input
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3E2723]/10 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                                value={settings.codPolicy}
                                onChange={(e) => handleChange('codPolicy', e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                </div>

                {/* Value Propositions Section */}
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                    <div>
                        <h3 className="text-xl font-serif font-bold text-[#3E2723]">Value Propositions</h3>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Key benefits shown on pink banner</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                <Shield className="w-3 h-3" />
                                <span>Warranty Text</span>
                            </label>
                            <input
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3E2723]/10 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                                value={settings.warrantyText}
                                onChange={(e) => handleChange('warrantyText', e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                <Check className="w-3 h-3" />
                                <span>Safety Feature (e.g. Skin Safe)</span>
                            </label>
                            <input
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3E2723]/10 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                                value={settings.safetyText}
                                onChange={(e) => handleChange('safetyText', e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                <Check className="w-3 h-3" />
                                <span>Plating/Material Text</span>
                            </label>
                            <input
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3E2723]/10 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                                value={settings.platingText}
                                onChange={(e) => handleChange('platingText', e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                </div>

                {/* Announcement Bar Section */}
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-serif font-bold text-[#3E2723]">Announcement Bar</h3>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Manage scrolling items in navbar</p>
                        </div>
                        {isEditing && (
                            <button
                                onClick={addAnnouncement}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-[#3E2723]/10 text-[#3E2723] hover:bg-[#3E2723]/20 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Item</span>
                            </button>
                        )}
                    </div>

                    <div className="space-y-3">
                        {settings.announcementItems && settings.announcementItems.map((item, index) => (
                            <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 border border-gray-200 rounded-lg animate-in slide-in-from-left-2 duration-300">
                                {/* Leading: Icon Select OR Image Preview */}
                                <div className="shrink-0 flex items-center gap-2">
                                    <div className="relative">
                                        <select
                                            className="w-28 pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3E2723]/10 appearance-none cursor-pointer"
                                            value={item.icon || 'Truck'}
                                            onChange={(e) => handleAnnouncementChange(item.id, 'icon', e.target.value)}
                                            disabled={!isEditing}
                                        >
                                            <option value="Truck">Truck</option>
                                            <option value="Shield">Secure</option>
                                            <option value="RefreshCw">Return</option>
                                            <option value="Headset">Support</option>
                                            <option value="Tag">Offer</option>
                                            <option value="Gift">Gift</option>
                                            <option value="Star">Star</option>
                                            <option value="Bell">Alert</option>
                                            <option value="Zap">New</option>
                                        </select>
                                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <Tag className="w-4 h-4" />
                                        </div>
                                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <ChevronDown className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>

                                {/* Text Input */}
                                <div className="flex-1">
                                    <input
                                        className="w-full px-3 py-2 bg-transparent text-sm font-bold text-gray-900 placeholder-gray-400 focus:outline-none border-b border-transparent focus:border-[#3E2723]/20 transition-colors"
                                        value={item.text}
                                        onChange={(e) => handleAnnouncementChange(item.id, 'text', e.target.value)}
                                        disabled={!isEditing}
                                        placeholder="Announcement text..."
                                    />
                                </div>

                                {/* Delete */}
                                {isEditing && (
                                    <button
                                        onClick={() => removeAnnouncement(item.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fraud Alert Section */}
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                    <div>
                        <h3 className="text-xl font-serif font-bold text-[#3E2723]">Fraud & Safety Alerts</h3>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Important warnings for customers</p>
                    </div>

                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                        <label className="flex items-center gap-2 text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Global Fraud Warning Text</span>
                        </label>
                        <textarea
                            className="w-full p-3 bg-white border border-red-200 rounded-xl text-sm font-bold text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500/10 disabled:bg-white disabled:text-gray-500 h-32 resize-none transition-all"
                            value={settings.fraudWarning}
                            onChange={(e) => handleChange('fraudWarning', e.target.value)}
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                {/* Contact Details Section - Full Width */}
                <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                    <div>
                        <h3 className="text-xl font-serif font-bold text-[#3E2723]">Company Contact Details</h3>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Displayed in Footer and Contact Page</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div>
                            <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                <MapPin className="w-3 h-3" />
                                <span>Official Address</span>
                            </label>
                            <textarea
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3E2723]/10 disabled:bg-gray-50 disabled:text-gray-500 h-24 resize-none transition-all"
                                value={settings.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                    <Phone className="w-3 h-3" />
                                    <span>Support Phone</span>
                                </label>
                                <input
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3E2723]/10 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                                    value={settings.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                    <Mail className="w-3 h-3" />
                                    <span>Support Email</span>
                                </label>
                                <input
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3E2723]/10 disabled:bg-gray-50 disabled:text-gray-500 transition-all"
                                    value={settings.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Configuration Section */}
                <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-8">
                    <div>
                        <h3 className="text-xl font-serif font-bold text-[#3E2723]">Footer Configuration</h3>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Fully customize the website footer content</p>
                    </div>

                    {/* Footer Brand Identity */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h4 className="flex items-center gap-2 font-bold text-[#3E2723]"><Layout className="w-4 h-4" /> Brand Identity</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Footer Tagline</label>
                                    <input
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 disabled:text-gray-500"
                                        value={settings.footerTagline || ''}
                                        onChange={(e) => handleChange('footerTagline', e.target.value)}
                                        disabled={!isEditing}
                                        placeholder="timeless Elegance,"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Footer Sub-Tagline</label>
                                    <input
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 disabled:text-gray-500"
                                        value={settings.footerSubTagline || ''}
                                        onChange={(e) => handleChange('footerSubTagline', e.target.value)}
                                        disabled={!isEditing}
                                        placeholder="Handcrafted for You."
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Brand Description</label>
                                <textarea
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 disabled:text-gray-500 h-32 resize-none leading-relaxed"
                                    value={settings.footerDescription || ''}
                                    onChange={(e) => handleChange('footerDescription', e.target.value)}
                                    disabled={!isEditing}
                                    placeholder="Company description..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Links Columns */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h4 className="flex items-center gap-2 font-bold text-[#3E2723]"><Layout className="w-4 h-4" /> Footer Links</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {['footerExperienceLinks', 'footerPoliciesLinks', 'footerWorldLinks'].map((listName, idx) => (
                                <div key={listName} className="bg-gray-50 p-4 rounded-xl space-y-3">
                                    <div className="flex items-center justify-between mb-2">
                                        {isEditing ? (
                                            <input
                                                className="font-bold text-[#3E2723] uppercase text-xs bg-white border border-gray-200 rounded px-2 py-1 w-32 focus:outline-none focus:ring-1 focus:ring-[#3E2723]/30"
                                                value={settings[`footerColumn${idx + 1}Title`] || (idx === 0 ? 'Experience' : idx === 1 ? 'Policies' : 'Our World')}
                                                onChange={(e) => handleChange(`footerColumn${idx + 1}Title`, e.target.value)}
                                                placeholder="Column Title"
                                            />
                                        ) : (
                                            <h5 className="text-xs font-bold text-[#3E2723] uppercase">
                                                {settings[`footerColumn${idx + 1}Title`] || (idx === 0 ? 'Experience' : idx === 1 ? 'Policies' : 'Our World')}
                                            </h5>
                                        )}
                                        {isEditing && <button onClick={() => addLink(listName)} className="p-1 hover:bg-white rounded-full transition-colors"><Plus className="w-3 h-3" /></button>}
                                    </div>
                                    <div className="space-y-2">
                                        {settings[listName] && settings[listName].map(link => (
                                            <div key={link.id} className="flex gap-2">
                                                <input
                                                    className="w-1/2 p-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg disabled:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#3E2723]/30"
                                                    value={link.name}
                                                    onChange={(e) => handleLinkChange(listName, link.id, 'name', e.target.value)}
                                                    disabled={!isEditing}
                                                    placeholder="Link Name"
                                                />
                                                <input
                                                    className="w-1/2 p-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg disabled:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#3E2723]/30"
                                                    value={link.path}
                                                    onChange={(e) => handleLinkChange(listName, link.id, 'path', e.target.value)}
                                                    disabled={!isEditing}
                                                    placeholder="/path"
                                                />
                                                {isEditing && (
                                                    <button onClick={() => removeLink(listName, link.id)} className="text-gray-400 hover:text-red-500">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Social & Bottom Bar */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h4 className="flex items-center gap-2 font-bold text-[#3E2723]"><Layout className="w-4 h-4" /> Social & Bottom Bar</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Social Media Links</label>
                                {[
                                    { icon: Facebook, key: 'facebook', label: 'Facebook URL' },
                                    { icon: Twitter, key: 'twitter', label: 'Twitter URL' },
                                    { icon: Instagram, key: 'instagram', label: 'Instagram URL' },
                                    { icon: Youtube, key: 'youtube', label: 'YouTube URL' }
                                ].map((social) => (
                                    <div key={social.key} className="flex items-center gap-3">
                                        <social.icon className="w-4 h-4 text-gray-400" />
                                        <input
                                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-900 disabled:text-gray-500"
                                            value={settings.socialLinks?.[social.key] || ''}
                                            onChange={(e) => handleNestedChange('socialLinks', social.key, e.target.value)}
                                            disabled={!isEditing}
                                            placeholder={social.label}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Delivery Text</label>
                                    <input
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 disabled:text-gray-500"
                                        value={settings.footerDeliveryText || ''}
                                        onChange={(e) => handleChange('footerDeliveryText', e.target.value)}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Copyright Text</label>
                                    <input
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 disabled:text-gray-500"
                                        value={settings.footerCopyrightText || ''}
                                        onChange={(e) => handleChange('footerCopyrightText', e.target.value)}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Layout Management */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h4 className="flex items-center gap-2 font-bold text-[#3E2723]"><Layout className="w-4 h-4" /> Admin Dashboard Layout</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Enable/Disable and Reorder Dashboard Modules</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(settings.dashboardLayout || [
                                { id: 'header', name: 'Editorial Header', enabled: true, order: 1 },
                                { id: 'sectors', name: 'Sector Specifics', enabled: true, order: 2 },
                                { id: 'stats', name: 'Metrics Grid', enabled: true, order: 2 },
                                { id: 'analytics', name: 'Analytics & Alerts', enabled: true, order: 4 },
                                { id: 'quickActions', name: 'Global Control Grid', enabled: true, order: 5 },
                                { id: 'recentOrders', name: 'Fulfillment Section', enabled: true, order: 6 }
                            ]).sort((a, b) => a.order - b.order).map((section, index) => (
                                <div key={section.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl group hover:border-[#3E2723]/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col gap-1">
                                            {isEditing && (
                                                <>
                                                    <button
                                                        onClick={() => moveSection(index, 'up')}
                                                        disabled={index === 0}
                                                        className="p-1 hover:bg-white rounded text-gray-400 disabled:opacity-0"
                                                    >
                                                        <ChevronUp className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={() => moveSection(index, 'down')}
                                                        disabled={index === (settings.dashboardLayout?.length || 6) - 1}
                                                        className="p-1 hover:bg-white rounded text-gray-400 disabled:opacity-0"
                                                    >
                                                        <ChevronDown className="w-3 h-3" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-[#3E2723] uppercase">{section.name}</p>
                                            <p className="text-[8px] font-bold text-gray-400">Order: {section.order}</p>
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <button
                                            onClick={() => toggleSection(section.id)}
                                            className={`p-2 rounded-lg transition-all ${section.enabled ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}
                                        >
                                            {section.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </button>
                                    )}
                                    {!isEditing && (
                                        <div className={`px-2 py-1 rounded text-[8px] font-bold uppercase transition-all ${section.enabled ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                            {section.enabled ? 'Visible' : 'Hidden'}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default GlobalSettings;
