import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useShop } from '../../../context/ShopContext';
import { MoveRight } from 'lucide-react';

const ProposalRings = () => {
    const { homepageSections } = useShop();
    const sectionData = homepageSections?.['proposal-rings'];
    const banner = sectionData?.items?.[0]; // Proposal rings is usually a single big highlight

    if (!banner) return null;

    return (
        <section className="py-8 md:py-12 bg-white">
            <div className="container mx-auto px-4 md:px-8">
                <Link to={banner.path || '/category/rings'} className="group block relative w-full h-[250px] md:h-[500px] overflow-hidden rounded-[2rem] shadow-2xl isolate">
                    {/* Background Image */}
                    <img
                        src={banner.image}
                        alt={banner.name}
                        className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                    />

                    {/* Premium Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-10" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-center items-start p-6 md:p-20 z-20">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-gold text-[10px] md:text-sm font-bold uppercase tracking-[0.4em] mb-2 md:mb-6"
                        >
                            The Forever Collection
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="font-serif text-3xl md:text-7xl text-white mb-4 md:mb-8 leading-tight tracking-tight"
                        >
                            {banner.name || "Proposal Rings"}
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-3 text-white group-hover:text-gold transition-colors"
                        >
                            <span className="text-xs md:text-lg font-serif italic tracking-widest">Find the One</span>
                            <div className="w-8 h-[1px] bg-white group-hover:bg-gold transition-all group-hover:w-16" />
                            <MoveRight className="w-4 h-4 md:w-6 md:h-6" />
                        </motion.div>
                    </div>

                    {/* Floating Accent Decoration */}
                    <div className="absolute top-8 right-8 border border-white/20 p-4 rounded-full hidden md:block opacity-30 group-hover:opacity-100 transition-opacity duration-1000">
                        <div className="w-12 h-12 border border-white/10 rounded-full animate-ping" />
                    </div>
                </Link>
            </div>
        </section>
    );
};

export default ProposalRings;
