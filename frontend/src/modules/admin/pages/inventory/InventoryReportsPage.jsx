import React, { useState, useEffect } from 'react';
import { Calendar, Download, PieChart, TrendingUp, DollarSign, Package } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';

import api from '../../../../utils/api';
import toast from 'react-hot-toast';

const InventoryReportsPage = () => {
    const [activeTab, setActiveTab] = useState('category'); // 'category' or 'sales'
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/inventory-reports');
            setReportData(data);
        } catch (error) {
            console.error('Error fetching reports:', error);
            toast.error('Failed to load real-time analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!reportData) return null;

    const { categoryData, salesData, summary } = reportData;

    return (
        <div className="space-y-6 font-outfit pb-12 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 border border-black/5 rounded-none shadow-sm gap-4">
                <div>
                    <h1 className="text-2xl font-serif font-black text-black tracking-tight leading-none uppercase">Inventory Reports</h1>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2">Valuation Matrix & Sales Analytics Performance</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-6 py-3 bg-white border border-black/10 text-gray-400 rounded-none text-[10px] font-black uppercase tracking-widest hover:border-black hover:text-black hover:bg-gray-50 shadow-sm flex items-center gap-3 transition-all">
                        <Calendar size={14} strokeWidth={2.5} />
                        <span>Period Selection</span>
                    </button>
                    <button className="px-6 py-3 bg-black text-white rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-primary shadow-xl shadow-black/20 transition-all flex items-center gap-3 active:scale-95 group">
                        <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                        <span>Download Analysis</span>
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-none w-fit border border-black/5">
                {[
                    { id: 'category', label: 'CATEGORY OVERVIEW', icon: PieChart },
                    { id: 'sales', label: 'SALES VELOCITY', icon: TrendingUp }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-2 rounded-none text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border ${activeTab === tab.id ? 'bg-white text-footerBg shadow-sm border-black/5' : 'text-gray-400 hover:text-gray-600 border-transparent'
                            }`}
                    >
                        <tab.icon size={13} strokeWidth={2.5} /> {tab.label}
                    </button>
                ))}
            </div>

            {/* Category Analysis Consol */}
            {activeTab === 'category' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    {/* Summary Matrix */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-white p-4 rounded-none border border-black/5 shadow-sm">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Inventory Valuation</p>
                            <h3 className="text-2xl font-serif font-black text-black tracking-tighter">₹{summary.totalValuation.toLocaleString()}</h3>
                            <div className="w-full bg-gray-100 h-1 rounded-none mt-3 overflow-hidden">
                                <div className="bg-emerald-500 h-full w-[75%]"></div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-none border border-black/5 shadow-sm">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Registry Volume</p>
                            <h3 className="text-2xl font-serif font-black text-black tracking-tighter">{summary.totalQty.toLocaleString()}</h3>
                            <div className="w-full bg-gray-100 h-1 rounded-none mt-3 overflow-hidden">
                                <div className="bg-blue-500 h-full w-[60%]"></div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-none border border-black/5 shadow-sm flex flex-col justify-center">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Dominant Sector</p>
                            <div className="flex items-center gap-3">
                                <span className="px-2 py-0.5 bg-black text-white text-[8px] font-serif font-black uppercase tracking-[0.2em] rounded-none">{summary.dominantSector}</span>
                                <span className="text-lg font-serif italic text-gray-400">{summary.concentration}% <span className="text-[8px] font-outfit uppercase tracking-tighter not-italic">Concentration</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Sector Distribution Table */}
                    <div className="bg-white rounded-none border border-black/5 shadow-sm overflow-hidden text-left">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#FDF5F6]/50 border-b border-black/5 text-[9px] font-serif font-black uppercase text-gold tracking-[0.2em]">
                                    <th className="px-6 py-3">Inventory Sector</th>
                                    <th className="px-6 py-3 text-center">SKU Count</th>
                                    <th className="px-6 py-3 text-center">Aggr. Volume</th>
                                    <th className="px-6 py-3 text-right">Appraised Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                                {categoryData.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-[#FDF5F6]/30 transition-colors">
                                        <td className="px-6 py-2.5 text-[11px] font-serif font-black text-black uppercase tracking-tight">{item.category}</td>
                                        <td className="px-6 py-2.5 text-center text-[11px] font-serif font-black text-gray-400">{item.uniqueProducts.toString().padStart(2, '0')}</td>
                                        <td className="px-6 py-2.5 text-center text-sm font-serif font-black text-black">{item.totalQty.toLocaleString()} <span className="text-[8px] font-outfit uppercase tracking-tighter">Units</span></td>
                                        <td className="px-6 py-2.5 text-right text-lg font-serif font-black text-black">₹{item.value.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Sales Velocity Consol */}
            {activeTab === 'sales' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    {/* Performance Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-emerald-950 p-8 rounded-none shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-12 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
                            <div className="relative z-10 flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-3">Gross Revenue</p>
                                    <h2 className="text-5xl font-serif font-black text-white tracking-tighter italic">₹{summary.totalRevenue.toLocaleString()}</h2>
                                </div>
                                <div className="p-4 bg-emerald-500/20 border border-emerald-500/20 text-emerald-400">
                                    <DollarSign size={32} strokeWidth={1} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-950 p-8 rounded-none shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-12 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
                            <div className="relative z-10 flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-3">Liquidation Volume</p>
                                    <h2 className="text-5xl font-serif font-black text-white tracking-tighter">{summary.totalUnitsSold.toLocaleString()}</h2>
                                </div>
                                <div className="p-4 bg-blue-500/20 border border-blue-500/20 text-blue-400">
                                    <Package size={32} strokeWidth={1} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sales Ledger */}
                    <div className="bg-white rounded-none border border-black/5 shadow-sm overflow-hidden text-left">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#FDF5F6]/50 border-b border-black/5 text-[9px] font-serif font-black uppercase text-gold tracking-[0.2em]">
                                    <th className="px-6 py-3 w-[40%]">Asset Nomenclature</th>
                                    <th className="px-6 py-3">Sector</th>
                                    <th className="px-6 py-3 text-center">Units Cleared</th>
                                    <th className="px-6 py-3 text-right">Avg Val.</th>
                                    <th className="px-6 py-3 text-right">Total Realized</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5 text-black">
                                {salesData.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-[#FDF5F6]/30 transition-colors group">
                                        <td className="px-6 py-2.5 text-[11px] font-serif font-black tracking-tight uppercase">{item.name}</td>
                                        <td className="px-6 py-2.5 text-[9px] font-black text-gray-400 uppercase tracking-widest font-outfit">{item.category}</td>
                                        <td className="px-6 py-2.5 text-center text-sm font-serif font-black text-gold italic">{item.sold.toString().padStart(3, '0')}</td>
                                        <td className="px-6 py-2.5 text-right text-[10px] font-serif font-black text-gray-400 uppercase tracking-tighter">₹{item.avgPrice.toLocaleString()}</td>
                                        <td className="px-6 py-2.5 text-right text-lg font-serif font-black text-emerald-600">₹{item.revenue.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryReportsPage;
