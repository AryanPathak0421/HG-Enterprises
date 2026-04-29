import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../../utils/api';
import { ChevronRight } from 'lucide-react';

const CollectionSubcategories = () => {
    const { categoryId } = useParams();
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
            {/* Elegant Header */}
            <header className="pt-32 pb-16 px-6 text-center border-b border-gray-50">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] font-black tracking-[0.5em] uppercase text-gold mb-4"
                >
                    Discover The Edit
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-serif italic text-black lowercase tracking-tight mb-6"
                >
                    {category.name}
                </motion.h1>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 60 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-px bg-gold/30 mx-auto"
                />
            </header>

            {/* Subcategory Grid */}
            <section className="container mx-auto px-6 lg:px-20 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
                    {category.subcategories && category.subcategories.length > 0 ? (
                        category.subcategories.filter(sub => sub.status !== 'Hidden').map((sub, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group"
                            >
                                <Link to={`/shop?category=${category.name.toLowerCase()}&subcategory=${sub.name.toLowerCase()}`} className="block relative">
                                    {/* Geometric Image Container */}
                                    <div className="aspect-[4/5] overflow-hidden bg-gray-50 relative border border-gray-100 shadow-sm transition-all duration-700 group-hover:shadow-2xl">
                                        <img
                                            src={sub.image || category.image}
                                            alt={sub.name}
                                            className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />

                                        {/* Hover Overlay Text */}
                                        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                            <span className="text-white text-[10px] font-black tracking-[0.3em] uppercase">Show Collection</span>
                                            <ChevronRight className="text-white w-4 h-4" />
                                        </div>
                                    </div>

                                    {/* Minimalist Label */}
                                    <div className="mt-8 text-center">
                                        <h3 className="font-serif text-2xl text-black italic group-hover:text-gold transition-colors duration-500 lowercase underline-offset-8 decoration-gold/0 group-hover:decoration-gold/100 leading-tight">
                                            {sub.name}
                                        </h3>
                                        <p className="mt-2 text-[9px] font-bold text-gray-400 uppercase tracking-[0.4em]">Essential Curation</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center text-gray-300 font-serif italic text-xs tracking-widest uppercase">
                            Architecture Pending Finalization
                        </div>
                    )}
                </div>
            </section>

            {/* Bottom Accent */}
            <div className="py-20 flex justify-center">
                <Link
                    to="/shop"
                    className="text-[10px] font-black text-gray-500 hover:text-black uppercase tracking-[0.6em] transition-all border-b border-transparent hover:border-black pb-1"
                >
                    View All Masterpieces
                </Link>
            </div>
        </div>
    );
};

export default CollectionSubcategories;
