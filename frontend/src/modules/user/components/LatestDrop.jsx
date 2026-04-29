import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';

const LatestDrop = () => {
    const { homepageSections, products } = useShop();

    // Use admin-configured items strictly from the DB
    const sectionData = homepageSections?.['latest-drop'];
    const displayItems = sectionData?.items && sectionData.items.length > 0 ? sectionData.items : [];

    if (displayItems.length === 0) return null;

    return (
        <section className="pt-4 pb-8 md:pt-8 md:pb-16 bg-white">
            <div className="container mx-auto px-2 md:px-4">
                {/* Header - Matched to Style It Your Way */}
                <div className="text-center mb-6 md:mb-10">
                    <span className="text-primary font-serif tracking-[0.2em] font-normal italic text-[10px] md:text-sm mb-1 block">
                        {sectionData?.subtitle || "Fresh Arrivals"}
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl font-normal text-dark tracking-tight">
                        {sectionData?.label || "Latest Drops"}
                    </h2>
                    <div className="h-[1px] w-12 bg-primary mx-auto opacity-30 mt-2"></div>
                </div>

                {/* Grid (Desktop) / Horizontal Scroll (Mobile) */}
                <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 pb-4 md:pb-0 px-4 md:px-0 scrollbar-hide snap-x snap-mandatory -mx-4 md:mx-0">
                    {displayItems.map((item, index) => {
                        // Dynamic Product Lookup
                        const product = products.find(p => p.id === item.productId);
                        // If it's a real product, use its data, otherwise fallback to item (legacy/manual)
                        const name = product ? (product.name || item.name) : item.name;
                        const image = product ? (product.image || item.image) : item.image;
                        const price = product ? `₹${product.price?.toLocaleString() || ''}` : (item.price || '');
                        const path = product ? `/product/${product.id}` : item.path;

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group cursor-pointer flex-shrink-0 w-[200px] md:w-auto snap-center first:ml-4 md:first:ml-0 last:mr-4 md:last:mr-0"
                            >
                                <Link to={path}>
                                    {/* Card Styled Container - Dark Wine Theme (Unified #4A1015) */}
                                    <div className="bg-primary rounded-[1.5rem] shadow-[0_5px_15px_rgba(0,0,0,0.15)] hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group overflow-hidden h-full">

                                        {/* Image Container - Full Width */}
                                        <div className="relative overflow-hidden aspect-[4/3] bg-white">
                                            <img
                                                src={image}
                                                alt={name}
                                                className="w-full h-full object-contain transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100 mix-blend-multiply"
                                            />

                                            {/* Overlay on Hover */}
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-300"></div>


                                        </div>

                                        {/* Info - Ultra Compact */}
                                        <div className="p-2.5 md:p-3">
                                            <div className="flex justify-between items-start mb-0.5 gap-2">
                                                <h3 className="font-serif font-normal text-sm md:text-base text-white group-hover:text-gold transition-colors line-clamp-1 tracking-wide">
                                                    {name}
                                                </h3>
                                                <div className="flex text-gold shrink-0 pt-0.5">
                                                    <Star className="w-2.5 h-2.5 fill-current" />
                                                    <Star className="w-2.5 h-2.5 fill-current" />
                                                    <Star className="w-2.5 h-2.5 fill-current" />
                                                    <Star className="w-2.5 h-2.5 fill-current" />
                                                    <Star className="w-2.5 h-2.5 fill-current" />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="font-serif text-base text-white font-bold leading-none tracking-wide">{price}</p>
                                                <span className="text-[9px] text-white/50 font-bold uppercase tracking-widest hidden group-hover:block transition-all duration-300">View</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Explore Button (Mobile Only - Bottom) */}
                <div className="mt-6 flex justify-center md:hidden">
                    <Link
                        to="/shop?sort=newest"
                        className="inline-flex items-center gap-2 text-primary font-serif italic tracking-wider border-b border-primary pb-0.5 text-sm md:text-base group"
                    >
                        <span className="font-serif italic font-normal text-xs md:text-sm tracking-wider">Explore Collection</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default LatestDrop;
