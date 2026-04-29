import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';

const StyleItYourWay = () => {
    const { homepageSections } = useShop();
    const sectionData = homepageSections?.['style-it-your-way'];

    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 350; // Card width + gap
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    const displayCollections = sectionData?.items && sectionData.items.length > 0
        ? sectionData.items.map(item => ({
            id: item.id,
            title: item.name,
            subtitle: item.tag,
            image: item.image,
            thumbnails: item.extraImages || [],
            path: item.path || "/shop"
        }))
        : [];

    React.useEffect(() => {
        if (displayCollections.length === 0) return;

        const isMobile = window.innerWidth < 768;
        if (!isMobile) return;

        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { current } = scrollRef;
                const maxScroll = current.scrollWidth - current.clientWidth;
                const isAtEnd = current.scrollLeft >= maxScroll - 10;

                if (isAtEnd) {
                    current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    current.scrollBy({ left: current.clientWidth * 0.9 + 24, behavior: 'smooth' });
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [displayCollections.length]);

    if (displayCollections.length === 0) return null;

    return (
        <section className="pt-8 pb-2 md:pt-12 md:pb-4 bg-white relative">
            <div className="container mx-auto px-2 md:px-4">

                {/* Centered Header - Matched to Editorial Style */}
                <div className="text-center mb-6 md:mb-8">
                    <span className="text-primary font-serif tracking-[0.2em] font-normal italic text-[10px] md:text-sm mb-1 block">
                        Curated For You
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl font-normal text-dark tracking-tight">
                        {sectionData?.label || "Style It Your Way"}
                    </h2>
                    <div className="h-[1px] w-12 bg-primary mx-auto opacity-30 mt-3"></div>
                </div>

                {/* Carousel Container */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 md:gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {displayCollections.map((detail) => (
                        <div
                            key={detail.id}
                            className={`min-w-[85vw] md:min-w-[700px] h-[220px] md:h-[320px] rounded-[1.25rem] md:rounded-[1.5rem] relative flex-shrink-0 snap-center group overflow-hidden cursor-pointer shadow-md md:shadow-lg transition-all duration-500 isolate`}
                        >
                            <Link to={detail.path}>
                                {/* Full Card Banner Image */}
                                <div className="absolute inset-0">
                                    <img
                                        src={detail.image}
                                        alt={detail.title}
                                        className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                                    />
                                    {/* Gradient Overlay with Inner Shadow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent opacity-90 shadow-inner" />
                                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
                                </div>

                                {/* Content Area - Left Aligned */}
                                <div className="absolute inset-0 flex flex-col justify-center items-start p-3 md:p-16 z-20 w-[80%] md:w-[70%]">
                                    <span className="text-gold text-[7px] md:text-sm font-bold tracking-[0.2em] uppercase mb-1 md:mb-3 drop-shadow-md bg-white/10 px-2 md:px-4 py-0.5 md:py-1.5 rounded-full backdrop-blur-md border border-white/20">
                                        {detail.subtitle}
                                    </span>
                                    <h3 className="font-serif text-xl md:text-5xl text-white mb-2 md:mb-6 leading-tight drop-shadow-lg uppercase tracking-tight font-normal">
                                        {detail.title}
                                    </h3>
                                    <div className="h-[1.5px] w-8 md:w-16 bg-white/50 group-hover:w-32 transition-all duration-500" />
                                </div>
                            </Link>

                            {/* Floating Product Thumbnails - Bottom Right/Center */}
                            <div className="absolute bottom-3 md:bottom-8 right-2 md:right-8 flex gap-1.5 md:gap-4 z-30">
                                {detail.thumbnails.map((thumb, idx) => (
                                    <div
                                        key={idx}
                                        className="w-10 h-10 md:w-32 md:h-32 bg-white rounded-lg md:rounded-3xl shadow-md flex items-center justify-center transform hover:-translate-y-2 transition-transform duration-500 hover:scale-105 border border-gray-100 overflow-hidden"
                                    >
                                        <img src={thumb} alt="Product" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons for Desktop - Compacted Position Below Carousel */}
                <div className="hidden md:flex justify-center gap-4 mt-4">
                    <button
                        onClick={() => scroll('left')}
                        className="p-2.5 rounded-full border border-primary/20 hover:bg-primary hover:text-white text-primary transition-all duration-300 shadow-sm"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-2.5 rounded-full border border-primary/20 hover:bg-primary hover:text-white text-primary transition-all duration-300 shadow-sm"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

            </div>
        </section>
    );
};

export default StyleItYourWay;
