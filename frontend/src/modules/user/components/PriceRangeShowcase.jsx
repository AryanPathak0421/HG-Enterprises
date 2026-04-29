import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';

const PriceRangeShowcase = () => {
    const { homepageSections } = useShop();

    // Use admin-configured items retrieved from the DB strictly
    const sectionData = homepageSections?.['price-range-showcase'];
    const displayItems = sectionData?.items && sectionData.items.length > 0 ? sectionData.items : [];

    if (displayItems.length === 0) {
        return null; // Don't render component if there's no dynamic database content
    }

    return (
        <section className="pt-8 md:pt-14 pb-0 bg-bg-light overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-6 md:mb-8">
                    <span className="text-secondary font-serif tracking-[0.2em] font-normal italic text-[10px] md:text-sm mb-1 block">
                        Curated Selection
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl font-normal text-dark tracking-tight">
                        {sectionData?.label || "Luxury In Range"}
                    </h2>
                    <div className="h-[1px] w-12 bg-primary mx-auto opacity-30 mt-2"></div>
                </div>
            </div>

            {/* Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full px-4 md:px-8">
                {displayItems.map((item, index) => {
                    const itemLabel = item.name || item.label;

                    return (
                        <motion.div
                            key={item.id}
                            className="w-full"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Link
                                to={item.path}
                                className="group relative block w-full aspect-[4/5] md:aspect-[3/4] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700"
                            >
                                <img
                                    src={item.image}
                                    alt={itemLabel}
                                    className="w-full h-full object-cover transform transition-transform duration-[2000ms] group-hover:scale-110"
                                />

                                {/* Luxury Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                                <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-6 z-20">
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-serif font-normal text-gold uppercase tracking-[0.4em] opacity-90 block">
                                            Exclusive
                                        </span>
                                        <h3 className="text-2xl font-serif font-normal text-white leading-tight drop-shadow-2xl">
                                            {(itemLabel || '').split(' ')[0]} <br />
                                            <span className="italic text-xl text-white/90 font-light">{(itemLabel || '').split(' ').slice(1).join(' ')}</span>
                                        </h3>
                                        <div className="pt-3 flex items-center gap-3">
                                            <div className="h-[1px] w-6 bg-white/50 group-hover:w-10 transition-all duration-500"></div>
                                            <span className="text-white text-[9px] font-serif uppercase tracking-widest group-hover:text-gold transition-colors duration-300">Shop</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
};

export default PriceRangeShowcase;
