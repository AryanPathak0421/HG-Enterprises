import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../../../context/ShopContext';
import Skeleton from './Skeleton';

const DEPARTMENT_TABS = [
    { id: 'jewellery', name: 'JEWELLERY' },
    { id: 'tools', name: 'TOOLS' },
    { id: 'machines', name: 'MACHINES' }
];

const CategoryShowcase = () => {
    const { categories, loading } = useShop();
    const [activeTab, setActiveTab] = React.useState('jewellery');

    if (loading) {
        return (
            <section className="pt-10 pb-0 bg-white overflow-hidden">
                <div className="container mx-auto px-6 md:px-12 text-center">
                    <div className="flex justify-center gap-12 mb-10 border-b border-gray-100 pb-3">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-4 w-24" />)}
                    </div>
                </div>
            </section>
        );
    }

    // Filter categories based on active department tab
    const filteredCats = (categories || []).filter(cat =>
        cat.department?.toLowerCase() === activeTab.toLowerCase() &&
        cat.status === 'Active' &&
        cat.showInCollection
    );

    return (
        <section className="pt-6 pb-2 bg-white overflow-hidden">
            <div className="container mx-auto px-6 lg:px-20 text-center">

                {/* Refined Department Tabs - Strictly 3 */}
                <div className="flex justify-center gap-12 md:gap-24 mb-14 border-b border-gray-100/50 pb-0.5 overflow-x-auto scrollbar-hide">
                    {DEPARTMENT_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`font-serif text-[11px] md:text-sm tracking-[0.3em] uppercase transition-all duration-500 relative py-4 px-2 whitespace-nowrap ${activeTab === tab.id ? 'text-black font-black' : 'text-gray-300 hover:text-gray-500 font-medium'
                                }`}
                        >
                            {tab.name}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTabUnderline"
                                    className="absolute bottom-[-1px] left-0 right-0 h-[1.5px] bg-black"
                                    initial={false}
                                />
                            )}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-wrap md:flex-nowrap justify-center gap-10 md:gap-14 lg:gap-20 pb-16"
                    >
                        {filteredCats.map((cat, index) => {
                            return (
                                <div key={cat.id} className="group flex flex-col items-center w-[100px] md:w-auto">
                                    <Link to={`/shop?category=${cat.name.toLowerCase()}`} className="block">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                                            className="flex flex-col items-center"
                                        >
                                            {/* Minimalist Circle Image */}
                                            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border border-gray-100 p-0.5 transition-all duration-700 group-hover:border-black/10 group-hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] group-hover:scale-[1.05]">
                                                <div className="w-full h-full rounded-full overflow-hidden bg-gray-50">
                                                    <img
                                                        src={cat.image || 'https://via.placeholder.com/400'}
                                                        alt={cat.name}
                                                        className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
                                                    />
                                                </div>
                                            </div>

                                            {/* Premium Label */}
                                            <span className="mt-6 font-serif text-[9px] md:text-[10px] text-gray-500 font-bold tracking-[0.25em] uppercase text-center transition-all duration-500 group-hover:text-black group-hover:tracking-[0.35em]">
                                                {cat.name}
                                            </span>
                                        </motion.div>
                                    </Link>
                                </div>
                            );
                        })}
                        {filteredCats.length === 0 && (
                            <div className="w-full py-20 text-center text-gray-300 font-serif text-[10px] uppercase tracking-[0.4em] italic">
                                Segment Initialization Pending
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
};

export default CategoryShowcase;
