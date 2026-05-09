import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../../utils/api';
import { ChevronRight, ArrowLeft } from 'lucide-react';

const subcategoryFallbackImages = {
    'rings': {
        'engagement': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
        'cocktail': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600&auto=format&fit=crop',
        'couple rings': 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop',
        'solitaire': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
        'gold band': 'https://images.unsplash.com/photo-1589674781759-c21c37956a44?q=80&w=600&auto=format&fit=crop',
        'diamond ring': 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop',
        'bridal': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop'
    },
    'pendants': {
        'default': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop'
    },
    'earrings': {
        'default': 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop'
    },
    'necklaces': {
        'default': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop'
    },
    'bracelets': {
        'default': 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop'
    },
    'bangles': {
        'default': 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop'
    }
};

const getSubcategoryImage = (sub, catName) => {
    const catKey = catName?.trim().toLowerCase() || '';
    const subKey = sub.name?.trim().toLowerCase() || '';

    // Check if subcategory is related to tools, calibration, measurement, polishing, optics, cutting
    const isToolsRelated = catKey.includes('tool') || 
                          subKey.includes('tool') || 
                          subKey.includes('measurement') || 
                          subKey.includes('optics') || 
                          subKey.includes('cutting') || 
                          subKey.includes('polishing') ||
                          subKey.includes('forging') ||
                          subKey.includes('setting');

    if (isToolsRelated) {
        if (subKey.includes('measurement')) {
            return 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&auto=format&fit=crop';
        }
        if (subKey.includes('optics') || subKey.includes('lens')) {
            return 'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=600&auto=format&fit=crop';
        }
        if (subKey.includes('polishing') || subKey.includes('refinement')) {
            return 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?q=80&w=600&auto=format&fit=crop';
        }
        if (subKey.includes('cutting') || subKey.includes('piercing')) {
            return 'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?q=80&w=600&auto=format&fit=crop';
        }
        if (subKey.includes('forging') || subKey.includes('setting')) {
            return 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?q=80&w=600&auto=format&fit=crop';
        }
        return 'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?q=80&w=600&auto=format&fit=crop';
    }

    // For rings, ALWAYS prioritize our hand-curated, premium luxury ring images to ensure maximum context-appropriate visual elegance
    if (catKey === 'rings' || catKey === 'ring') {
        if (subcategoryFallbackImages['rings'][subKey]) {
            return subcategoryFallbackImages['rings'][subKey];
        }
        // Check for substring matches for maximum robustness (e.g. 'couple rings' matching 'couple')
        for (const [key, value] of Object.entries(subcategoryFallbackImages['rings'])) {
            if (subKey.includes(key) || key.includes(subKey)) {
                return value;
            }
        }
    }

    // Check if sub.image is valid, and doesn't contain placeholders or technical/UML/class diagrams
    const isPlaceholder = !sub.image ||
        sub.image.includes('via.placeholder') ||
        sub.image.includes('diagram') ||
        sub.image.toLowerCase().includes('uml') ||
        sub.image.toLowerCase().includes('class');

    if (!isPlaceholder) {
        return sub.image;
    }

    // Fallback to our curated map
    if (subcategoryFallbackImages[catKey]) {
        if (subcategoryFallbackImages[catKey][subKey]) {
            return subcategoryFallbackImages[catKey][subKey];
        }
        for (const [key, value] of Object.entries(subcategoryFallbackImages[catKey])) {
            if (subKey.includes(key) || key.includes(subKey)) {
                return value;
            }
        }
        if (subcategoryFallbackImages[catKey]['default']) {
            return subcategoryFallbackImages[catKey]['default'];
        }
    }

    // Default premium jewellery fallback image
    return 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop';
};

const CollectionSubcategories = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await api.get(`/categories/${categoryId}`);
                setCategory(res.data);
            } catch (err) {
                console.error("Failed to load collection:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
        window.scrollTo(0, 0);
    }, [categoryId]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <p className="font-serif italic text-gray-400 animate-pulse tracking-[0.5em] uppercase text-xs">Initializing Collection...</p>
        </div>
    );

    if (!category) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="font-serif text-gray-500">Collection Not Found</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            {/* Elegant minimalist Back Button */}
            <div className="max-w-4xl mx-auto px-6 pt-6 flex justify-start">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-black text-zinc-400 hover:text-black uppercase tracking-widest transition-all group"
                >
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                    <span>Back</span>
                </button>
            </div>

            {/* Elegant Compact Header */}
            <header className="pt-3 pb-1 px-6 text-center border-b border-gray-100/80 max-w-4xl mx-auto">
                <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[8px] md:text-[9px] font-black tracking-[0.3em] uppercase text-gold mb-0.5"
                >
                    Discover The Edit
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-4xl lg:text-5xl font-serif italic text-black lowercase tracking-tight mb-1"
                >
                    {category.name}
                </motion.h1>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 24 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="h-[1px] bg-gold/40 mx-auto"
                />
            </header>

            {/* Subcategory Grid - Compact & Elegant */}
            {(() => {
                let subcategoriesToRender = category.subcategories || [];
                const isToolsCategory = category.name?.toLowerCase().includes('tool') || category.id?.toLowerCase().includes('tool');
                if (subcategoriesToRender.length === 0 && isToolsCategory) {
                    subcategoriesToRender = [
                        {
                            name: "Measurement & Calibration",
                            image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&auto=format&fit=crop",
                            path: "measurement"
                        },
                        {
                            name: "Precision Cutting & Piercing",
                            image: "https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?q=80&w=600&auto=format&fit=crop",
                            path: "cutting"
                        },
                        {
                            name: "Polishing & Refinement",
                            image: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?q=80&w=600&auto=format&fit=crop",
                            path: "polishing"
                        },
                        {
                            name: "Setting & Forging",
                            image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?q=80&w=600&auto=format&fit=crop",
                            path: "setting"
                        }
                    ];
                }

                return (
                    <section className="container mx-auto px-4 sm:px-6 lg:px-12 py-4 md:py-5">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                            {subcategoriesToRender && subcategoriesToRender.length > 0 ? (
                                subcategoriesToRender.filter(sub => sub.status !== 'Hidden').map((sub, idx) => {
                                    const imageUrl = getSubcategoryImage(sub, categoryId);
                                    return (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group"
                                        >
                                            <Link to={`/shop?category=${category.name.toLowerCase()}&subcategory=${sub.name.toLowerCase()}`} className="block relative">
                                                {/* Premium Asymmetric Corner Image Container (Sharp on one side, rounded on the other) */}
                                                <div className="aspect-[4/5] overflow-hidden bg-gray-50 relative border border-gray-100/80 shadow-md rounded-tl-2xl rounded-br-2xl md:rounded-tl-[2.5rem] md:rounded-br-[2.5rem] rounded-tr-none rounded-bl-none transition-all duration-700 group-hover:shadow-2xl group-hover:scale-[1.01]">
                                                    <img
                                                        src={imageUrl}
                                                        alt={sub.name}
                                                        className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                                                        crossOrigin="anonymous"
                                                    />
                                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />

                                                    {/* Hover Overlay Text */}
                                                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-3 group-hover:translate-y-0">
                                                        <span className="text-white text-[8px] font-black tracking-[0.3em] uppercase">Show Collection</span>
                                                        <ChevronRight className="text-white w-3 h-3" />
                                                    </div>
                                                </div>

                                                {/* Minimalist Label */}
                                                <div className="mt-3 text-center">
                                                    <h3 className="font-serif text-base md:text-lg lg:text-xl text-black italic group-hover:text-gold transition-colors duration-500 lowercase underline-offset-8 decoration-gold/0 group-hover:decoration-gold/100 leading-tight">
                                                        {sub.name}
                                                    </h3>
                                                    <p className="mt-1 text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-[0.4em]">Essential Curation</p>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <div className="col-span-full py-16 text-center text-gray-300 font-serif italic text-xs tracking-widest uppercase">
                                    Architecture Pending Finalization
                                </div>
                            )}
                        </div>
                    </section>
                );
            })()}

            {/* Bottom Accent */}
            <div className="py-10 flex justify-center">
                <Link
                    to="/shop"
                    className="text-[10px] font-black text-gray-400 hover:text-black uppercase tracking-[0.5em] transition-all border-b border-transparent hover:border-black pb-1"
                >
                    View All Masterpieces
                </Link>
            </div>
        </div>
    );
};

export default CollectionSubcategories;
