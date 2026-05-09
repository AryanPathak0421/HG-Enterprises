import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, RefreshCw, ShieldCheck, Gem } from 'lucide-react';

const HGPromise = () => {
    const promises = [
        {
            icon: RotateCcw,
            title: "100% REFUND",
            subtitle: "Return within 30 Days of Delivery",
            color: "text-blue-500",
            bgColor: "bg-blue-50"
        },
        {
            icon: RefreshCw,
            title: "LIFETIME EXCHANGE & BUYBACK",
            subtitle: "Exchange for current value or get Cash",
            color: "text-purple-500",
            bgColor: "bg-purple-50"
        },
        {
            icon: ShieldCheck,
            title: "100% CERTIFIED JEWELLERY",
            subtitle: "BIS Hallmark, IGI, SGL, GIA, HKD",
            color: "text-indigo-500",
            bgColor: "bg-indigo-50"
        },
        {
            icon: Gem,
            title: "EXCLUSIVE DESIGNS",
            subtitle: "6000+ Designs by award winning designers",
            color: "text-rose-500",
            bgColor: "bg-rose-50"
        }
    ];

    return (
        <section className="py-6 md:py-10 bg-[#FFF5F6]">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-serif italic text-gray-800 tracking-tight">HG Enterprises Promise</h2>
                    <div className="h-[1px] w-12 bg-primary/20 mx-auto mt-2"></div>
                </div>

                {/* Grid Container */}
                <div className="grid grid-cols-2 bg-white rounded-2xl overflow-hidden border border-pink-200/50 shadow-sm max-w-lg mx-auto">
                    {promises.map((promise, i) => (
                        <div 
                            key={i} 
                            className={`p-4 md:p-6 flex flex-col items-center text-center transition-all duration-500 hover:bg-[#FDF5F6]/50 group relative
                                ${i % 2 === 0 ? 'border-r border-pink-200/60' : ''} 
                                ${i < 2 ? 'border-b border-pink-200/60' : ''}
                            `}
                        >
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${promise.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500`}>
                                <promise.icon className={`w-5 h-5 md:w-6 md:h-6 ${promise.color}`} strokeWidth={1} />
                            </div>
                            
                            <h3 className="text-[8px] md:text-[9px] font-black text-gray-800 mb-1 tracking-widest uppercase leading-tight">
                                {promise.title}
                            </h3>
                            
                            <p className="text-[7px] md:text-[8px] text-gray-400 font-serif italic leading-tight">
                                {promise.subtitle}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HGPromise;
