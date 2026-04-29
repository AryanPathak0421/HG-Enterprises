import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';

const NewLaunchSection = () => {
    const { homepageSections } = useShop();

    // Use admin-configured items strictly from the DB
    const sectionData = homepageSections?.['new-launch'];
    const displayItems = sectionData?.items && sectionData.items.length > 0 ? sectionData.items : [];

    if (displayItems.length === 0) return null;

    return (
        <section className="pt-8 pb-10 md:pt-12 md:pb-16 bg-bg-light relative overflow-hidden">

            <div className="container mx-auto px-2 md:px-4 relative z-10">

                {/* Header - Matched to Style It Your Way */}
                <div className="text-center mb-6 md:mb-8">
                    <span className="text-secondary font-serif tracking-[0.2em] font-normal italic text-[10px] md:text-sm mb-1 block">
                        Our Latest
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl font-normal text-dark tracking-tight">
                        {sectionData?.label || "New Launches"}
                    </h2>
                    <div className="h-[1px] w-12 bg-primary mx-auto opacity-30 mt-2"></div>
                </div>

                {/* Cards Row */}
                <div className="flex flex-wrap md:flex-nowrap justify-center gap-6 md:gap-8">
                    {displayItems.map((item, index) => {
                        const itemLabel = item.name || item.label;

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="w-[45%] md:w-48 lg:w-56"
                            >
                                <Link to={item.path} className="group block relative">
                                    {/* Square Card Container - Tighter Corner */}
                                    <div className="relative rounded-2xl overflow-hidden aspect-square bg-white shadow-xl group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 isolate">

                                        {/* Image */}
                                        <div className="absolute inset-0 overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={itemLabel}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                                        {/* Content - Bottom Center - Reduced Padding */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col items-center justify-end text-center z-10">

                                            {/* Name - Smaller Font */}
                                            <h4 className="font-serif font-normal text-lg text-white tracking-wide mb-1 transform transition-transform duration-300 group-hover:-translate-y-1 uppercase">
                                                {itemLabel}
                                            </h4>

                                            {/* Divider - Thinner */}
                                            <div className="w-6 h-[1px] bg-gold rounded-full mb-2 opacity-50 group-hover:w-12 group-hover:opacity-100 transition-all duration-500"></div>

                                            {/* Action Text - Ultra Small */}
                                            <span className="text-gold text-[8px] font-medium uppercase tracking-[0.2em] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                                Discover
                                            </span>
                                        </div>

                                        {/* Border Glow Effect */}
                                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/30 rounded-2xl transition-colors duration-300 pointer-events-none"></div>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>

            </div>
        </section>
    );
};

export default NewLaunchSection;
