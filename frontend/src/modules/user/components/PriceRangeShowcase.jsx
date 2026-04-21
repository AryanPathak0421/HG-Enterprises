import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';

// Import images
import price999 from '../assets/price_under_999.png';
import price1999 from '../assets/price_under_1999.png';
import price2999 from '../assets/price_under_2999.png';
import price3999 from '../assets/price_under_3999.png';

const priceRanges = [
    { id: 'under-999', label: "Under ₹999", image: price999, path: "/shop?price_max=999" },
    { id: 'under-1999', label: "Under ₹1999", image: price1999, path: "/shop?price_max=1999" },
    { id: 'under-2999', label: "Under ₹2999", image: price2999, path: "/shop?price_max=2999" },
    { id: 'under-3999', label: "Under ₹3999", image: price3999, path: "/shop?price_max=3999" }
];

const PriceRangeShowcase = () => {
    const { homepageSections } = useShop();
    const scrollRef = React.useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    // Use admin-configured items if available, otherwise fall back to defaults
    const sectionData = homepageSections?.['price-range-showcase'];
    const displayItems = sectionData?.items && sectionData.items.length > 0 ? sectionData.items : priceRanges;

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

            <div className="relative group w-full">
                {/* Navigation Arrows */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 bg-white/10 hover:bg-white/30 backdrop-blur-md text-white rounded-full transition-all opacity-0 group-hover:opacity-100 hidden md:block"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 bg-white/10 hover:bg-white/30 backdrop-blur-md text-white rounded-full transition-all opacity-0 group-hover:opacity-100 hidden md:block"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Horizontal Scrollable Container - Edge to Edge */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide w-full"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {displayItems.map((item, index) => {
                        const itemLabel = item.name || item.label;

                        return (
                            <motion.div
                                key={item.id}
                                className="min-w-full snap-center"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                            >
                                <Link
                                    to={item.path}
                                    className="group relative block w-full aspect-[16/10] md:aspect-[3/1] rounded-none overflow-hidden shadow-lg transition-all duration-700"
                                >
                                    <img
                                        src={item.image}
                                        alt={itemLabel}
                                        className="w-full h-full object-cover transform transition-transform duration-[2000ms] group-hover:scale-110"
                                    />

                                    {/* Luxury Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/30 to-transparent" />

                                    <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-6 md:p-14 z-20">
                                        <div className="space-y-2 md:space-y-4">
                                            <span className="text-[10px] md:text-sm font-serif font-normal text-gold uppercase tracking-[0.4em] opacity-90 block">
                                                Exclusive Range
                                            </span>
                                            <h3 className="text-2xl md:text-5xl font-serif font-normal text-white leading-tight drop-shadow-2xl">
                                                {(itemLabel || '').split(' ')[0]} <br />
                                                <span className="italic text-xl md:text-4xl text-white/90 font-light">{(itemLabel || '').split(' ').slice(1).join(' ')}</span>
                                            </h3>
                                            <div className="pt-3 md:pt-6 flex items-center gap-4">
                                                <div className="h-[1px] w-10 md:w-20 bg-white/50"></div>
                                                <span className="text-white text-[9px] md:text-xs font-serif uppercase tracking-widest group-hover:text-gold transition-colors duration-300">Shop Collection</span>
                                            </div>
                                        </div>
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

export default PriceRangeShowcase;
