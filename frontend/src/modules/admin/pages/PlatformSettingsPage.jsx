import React, { useState, useEffect } from 'react';
import { useShop } from '../../../context/ShopContext';
import api from '../../../utils/api';
import { Percent, Truck, Save, RefreshCcw, ShieldCheck, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PlatformSettingsPage = () => {
    const { settings } = useShop();
    const [gstPercentage, setGstPercentage] = useState(18);
    const [shippingCharge, setShippingCharge] = useState(50);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (settings) {
            setGstPercentage(settings.gstPercentage || 18);
            setShippingCharge(settings.shippingCharge || 50);
        }
    }, [settings]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.post('/settings', {
                gstPercentage: Number(gstPercentage),
                shippingCharge: Number(shippingCharge)
            });
            toast.success("Platform configurations updated successfully");
        } catch (error) {
            console.error("Error updating settings:", error);
            toast.error("Failed to update settings");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header section with glassmorphism */}
            <div className="relative overflow-hidden bg-black p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gold/20 rounded-xl border border-gold/30">
                                <ShieldCheck className="w-6 h-6 text-gold" />
                            </div>
                            <h1 className="text-3xl font-serif font-black text-white tracking-widest uppercase">Global Control</h1>
                        </div>
                        <p className="text-gray-400 text-sm font-serif italic max-w-md">Manage platform-wide tax rates, delivery policies, and financial configurations.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-3 bg-gold hover:bg-gold-light text-black px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all shadow-xl shadow-gold/20 active:scale-95 disabled:opacity-50"
                    >
                        {saving ? <RefreshCcw className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {saving ? "Saving..." : "Save Configuration"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* GST Configuration Card */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-black/[0.02] space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                            <Percent className="w-6 h-6 text-[#D39A9F]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-black uppercase tracking-wider">GST Settings</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Taxation Compliance</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">GST Percentage (%)</label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    value={gstPercentage}
                                    onChange={(e) => setGstPercentage(e.target.value)}
                                    placeholder="e.g. 18"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-xl font-bold text-black focus:border-[#D39A9F] focus:ring-4 focus:ring-[#D39A9F]/5 outline-none transition-all placeholder:text-gray-200"
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 font-bold">%</div>
                            </div>
                        </div>

                        <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 flex gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                            <p className="text-[11px] text-amber-700 leading-relaxed font-medium capitalize">
                                Changes will be applied in real-time to all orders at checkout. Please ensure compliance with local tax laws.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Shipping Configuration Card */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-black/[0.02] space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                            <Truck className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-black uppercase tracking-wider">Shipping Settings</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Delivery Charges</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Fixed Shipping Charge (₹)</label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    value={shippingCharge}
                                    onChange={(e) => setShippingCharge(e.target.value)}
                                    placeholder="e.g. 50"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-xl font-bold text-black focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-gray-200"
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 font-bold">₹</div>
                            </div>
                        </div>

                        <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex gap-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                            <p className="text-[11px] text-emerald-700 leading-relaxed font-medium">
                                First-order free shipping is enabled by default. This charge will apply to all subsequent orders by a user.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformSettingsPage;
