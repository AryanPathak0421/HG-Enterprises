import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { useShop } from '../../../context/ShopContext';
import {
    Filter, ChevronDown, ArrowUpDown, ArrowLeft, Plus, Minus,
    UserCircle, ChevronRight, Search, X, SlidersHorizontal, Check,
    Home, Heart, RotateCcw, Diamond, Settings, Hammer, Image as ImageLucide
} from 'lucide-react';
import { useLocation, useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Shop = () => {
    const { products, categories } = useShop();
    const location = useLocation();
    const navigate = useNavigate();
    const { category: urlCategory } = useParams();
    const searchParams = new URLSearchParams(location.search);
    const filterParam = searchParams.get('filter');
    const categoryParam = searchParams.get('category');

    // States
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Jewellery');
    const [openCategory, setOpenCategory] = useState('Jewellery');
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [selectedType, setSelectedType] = useState('All');
    const [selectedGender, setSelectedGender] = useState('All');
    const [selectedMetal, setSelectedMetal] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 }); // Dual price slider support
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Sync with URL params & Normalize Category
    useEffect(() => {
        const queryParam = urlCategory || filterParam || categoryParam;
        if (queryParam) {
            try {
                const normalizedParam = decodeURIComponent(queryParam).toLowerCase();

                // Try to find if it matches a category
                const catMatch = categories.find(c => (c.name?.toLowerCase() === normalizedParam) || (c.id?.toLowerCase() === normalizedParam));
                if (catMatch) {
                    setSelectedCategory(catMatch.name || 'Jewellery');
                    setOpenCategory(catMatch.name || 'Jewellery');
                    setSelectedSubCategory(null);
                    return;
                }

                // Try to find if it matches a subcategory
                const subMatch = categories.flatMap(c => c.subcategories || []).find(s =>
                    s.name?.toLowerCase() === normalizedParam ||
                    (s.path && s.path.toLowerCase() === normalizedParam.replace(' ', '-'))
                );
                if (subMatch) {
                    const parent = categories.find(c => (c.subcategories || []).some(s => s.name === subMatch.name));
                    setSelectedCategory(parent?.name || 'Jewellery');
                    setOpenCategory(parent?.name || 'Jewellery');
                    setSelectedSubCategory(subMatch.name);
                }
            } catch (err) {
                console.error("Discovery Sync Error:", err);
            }
        }
    }, [urlCategory, filterParam]);

    // Removal of all automatic scroll logic as requested by user
    // User wants to stay in the same place at all times during selection

    // Filtering Logic
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // URL Parameter Filters (from Offers Page)
        const showOnlyOffers = searchParams.get('offers') === 'true';
        const tagFilter = searchParams.get('tag');

        if (showOnlyOffers) {
            result = result.filter(p => p.originalPrice && p.originalPrice > p.price);
        }

        if (tagFilter) {
            result = result.filter(p =>
                (p.category && p.category.toLowerCase().includes(tagFilter.toLowerCase())) ||
                (p.subCategory && p.subCategory.toLowerCase().includes(tagFilter.toLowerCase())) ||
                (p.name && p.name.toLowerCase().includes(tagFilter.toLowerCase()))
            );
        }

        if (selectedCategory && selectedCategory !== 'All') {
            result = result.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
            if (selectedSubCategory) {
                result = result.filter(p =>
                    (p.subCategory && p.subCategory.toLowerCase() === selectedSubCategory.toLowerCase()) ||
                    (p.name && p.name.toLowerCase().includes(selectedSubCategory.toLowerCase()))
                );
            }
        }
        if (selectedType !== 'All') result = result.filter(p => p.type?.toLowerCase() === selectedType.toLowerCase());
        if (selectedGender !== 'All') result = result.filter(p => p.gender?.toLowerCase() === selectedGender.toLowerCase());
        if (selectedMetal !== 'All') result = result.filter(p => p.metal?.toLowerCase() === selectedMetal.toLowerCase());

        // Price Filter
        result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

        if (sortBy === 'Price: Low to High') result.sort((a, b) => a.price - b.price);
        else if (sortBy === 'Price: High to Low') result.sort((a, b) => b.price - a.price);
        else if (sortBy === 'Best Selling') result.sort((a, b) => b.rating - a.rating);
        else if (sortBy === 'Newest') result.sort((a, b) => (b.isNew === a.isNew) ? 0 : b.isNew ? 1 : -1);

        return result;
    }, [selectedCategory, selectedSubCategory, selectedType, selectedGender, selectedMetal, priceRange, sortBy, location.search]);

    const pageTitle = useMemo(() => {
        return selectedSubCategory || selectedCategory || 'Categories Master';
    }, [selectedCategory, selectedSubCategory]);

    const handleCategoryToggle = (name) => {
        setOpenCategory(name);
        setSelectedCategory(name);
        setSelectedSubCategory(null);
        setSelectedType('All');
        setSelectedMetal('All');
    };

    const SidebarContent = () => {
        const currentCatData = categories.find(c => c.name === openCategory);

        return (
            <div className="flex flex-col h-full bg-white font-body overflow-hidden relative">
                {/* Fixed Header */}
                <div className="p-2 bg-[#0a0a0a] text-white shrink-0 border-b border-white/5 z-[70] shadow-sm">
                    <div className="flex items-center gap-3">
                        <UserCircle className="w-7 h-7 text-[#8B4356]" />
                        <span className="text-[11px] font-bold tracking-[0.25em] font-serif italic text-white/90">Curated Categories</span>
                    </div>
                </div>

                {/* Scrollable Middle Container */}
                <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-6 space-y-7 pb-32">
                    <div>
                        <h4 className="text-[9.5px] font-bold uppercase tracking-[0.5em] text-zinc-500 mb-3.5 ml-1">Archive Hub</h4>
                        <div className="flex flex-col gap-1.5">
                            {categories.map(cat => (
                                <button key={cat.id} onClick={() => handleCategoryToggle(cat.name)} className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between group ${openCategory === cat.name ? 'border-[#8B4356] bg-[#FDF5F6]/30 text-[#8B4356]' : 'border-zinc-50 text-zinc-800 hover:border-zinc-100 hover:bg-zinc-50'}`}>
                                    <span className="text-[12px] font-serif uppercase tracking-widest">{cat.name}</span>
                                    <ChevronRight className={`w-3 h-3 transition-transform ${openCategory === cat.name ? 'rotate-90 text-[#8B4356]' : 'text-zinc-300 group-hover:translate-x-1'}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[9.5px] font-bold uppercase tracking-[0.5em] text-zinc-500 mb-4 flex items-center gap-3">Discovery Map <div className="h-[1px] flex-grow bg-zinc-50"></div></h4>
                        <div className="grid grid-cols-2 gap-4">
                            {currentCatData?.subcategories.map(sub => (
                                <button key={sub.name} onClick={() => setSelectedSubCategory(sub.name === selectedSubCategory ? null : sub.name)} className={`relative group p-3 rounded-2xl border transition-all text-center flex flex-col items-center gap-2.5 ${selectedSubCategory === sub.name ? 'border-[#8B4356] bg-white shadow-[0_10px_30px_rgba(139,67,86,0.08)] scale-[1.02]' : 'border-zinc-50 bg-[#fafafa] hover:border-zinc-200'}`}>
                                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 transition-transform bg-zinc-100 flex items-center justify-center ${selectedSubCategory === sub.name ? 'border-[#8B4356]' : 'border-transparent group-hover:scale-105'}`}>
                                        {sub.image && (
                                            <img src={sub.image} className="w-full h-full object-cover" crossOrigin="anonymous" loading="lazy" onError={(e) => { e.target.style.display = 'none'; if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'; }} />
                                        )}
                                        <div className="hidden items-center justify-center w-full h-full text-zinc-300"><ImageLucide className="w-5 h-5" /></div>
                                    </div>
                                    <span className={`text-[11px] font-serif uppercase tracking-widest leading-tight transition-colors ${selectedSubCategory === sub.name ? 'text-[#8B4356] font-bold' : 'text-zinc-800'}`}>{sub.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* DYNAMIC MATERIAL SECTION based on Category */}
                        {currentCatData?.materials && (
                            <div>
                                <h4 className="text-[9.5px] font-bold uppercase tracking-[0.5em] text-[#8B4356] mb-4 flex items-center gap-3">
                                    {currentCatData.materialLabel || "By Material"}
                                    <div className="h-[1px] flex-grow bg-[#FDF5F6]"></div>
                                </h4>
                                <div className="grid grid-cols-2 gap-2 px-1">
                                    {currentCatData.materials.map(m => (
                                        <button key={m} onClick={() => setSelectedMetal(m === selectedMetal ? 'All' : m)} className={`py-3 rounded-xl border text-[11.5px] font-serif uppercase tracking-widest transition-all ${selectedMetal === m ? 'border-[#8B4356] bg-[#8B4356] text-white shadow-md font-bold' : 'border-zinc-100 text-zinc-800 border-zinc-200 hover:border-zinc-300'}`}>{m}</button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* PRICE SLIDER - Restored Manual Shift UI */}
                        <div>
                            <h4 className="text-[9.5px] font-bold uppercase tracking-[0.5em] text-zinc-500 mb-6 flex items-center gap-3">Price Explorer <div className="h-[1px] flex-grow bg-zinc-50"></div></h4>
                            <div className="px-2 space-y-4">
                                <div className="flex justify-between items-end mb-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[7px] font-black uppercase text-zinc-400">Min Budget</label>
                                        <input
                                            type="number"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                                            className="w-20 bg-zinc-50 border-none text-[12px] font-bold text-[#8B4356] font-display p-1 rounded"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1 text-right">
                                        <label className="text-[7px] font-black uppercase text-zinc-400">Max Budget</label>
                                        <input
                                            type="number"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 0 }))}
                                            className="w-24 bg-zinc-50 border-none text-[12px] font-bold text-[#8B4356] font-display p-1 rounded text-right"
                                        />
                                    </div>
                                </div>

                                <div className="relative h-6 flex items-center">
                                    <input
                                        type="range"
                                        min="0"
                                        max="500000"
                                        step="1000"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: Math.max(prev.min + 1000, parseInt(e.target.value)) }))}
                                        className="absolute w-full h-[3px] bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-[#8B4356] z-20 pointer-events-auto"
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="500000"
                                        step="1000"
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: Math.min(prev.max - 1000, parseInt(e.target.value)) }))}
                                        className="absolute w-full h-[3px] bg-transparent appearance-none cursor-pointer accent-[#8B4356] invisible pointer-events-none [&::-webkit-slider-thumb]:visible [&::-webkit-slider-thumb]:pointer-events-auto"
                                    />
                                </div>

                                <div className="flex justify-between mt-1">
                                    <span className="text-[9px] font-black uppercase tracking-tighter text-zinc-400">Min 0</span>
                                    <span className="text-[9px] font-black uppercase tracking-tighter text-zinc-400">Max 5 Lakh +</span>
                                </div>
                            </div>
                        </div>

                        {/* GENDER FILTER - Restored */}
                        <div>
                            <h4 className="text-[9.5px] font-bold uppercase tracking-[0.5em] text-zinc-500 mb-4 flex items-center gap-3">Target View <div className="h-[1px] flex-grow bg-zinc-50"></div></h4>
                            <div className="flex gap-2 px-1">
                                {['All', 'Women', 'Men'].map(g => (
                                    <button key={g} onClick={() => setSelectedGender(g)} className={`flex-1 py-3 rounded-xl border text-[11.5px] font-serif uppercase tracking-widest transition-all ${selectedGender === g ? 'border-[#8B4356] bg-[#8B4356] text-white shadow-md font-bold' : 'border-zinc-100 text-zinc-800 border-zinc-200 hover:border-zinc-300'}`}>{g}</button>
                                ))}
                            </div>
                        </div>

                        {/* SORT FILTER - Restored to Sidebar */}
                        <div>
                            <h4 className="text-[9.5px] font-bold uppercase tracking-[0.5em] text-zinc-500 mb-4 flex items-center gap-3">Refine Order <div className="h-[1px] flex-grow bg-zinc-50"></div></h4>
                            <div className="grid grid-cols-1 gap-2 px-1">
                                {['Newest', 'Price: Low to High', 'Price: High to Low', 'Best Selling'].map(s => (
                                    <button key={s} onClick={() => setSortBy(s)} className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between group ${sortBy === s ? 'border-[#8B4356] bg-[#FDF5F6]/30 text-[#8B4356]' : 'border-zinc-50 text-zinc-800 hover:bg-zinc-50'}`}>
                                        <span className="text-[12px] font-serif uppercase tracking-widest">{s}</span>
                                        {sortBy === s && <Check className="w-3.5 h-3.5 text-[#8B4356]" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {currentCatData?.popularTypes && (
                            <div className="pb-10">
                                <h4 className="text-[9.5px] font-bold uppercase tracking-[0.5em] text-zinc-500 mb-4 flex items-center gap-3">Popular Options <div className="h-[1px] flex-grow bg-zinc-50"></div></h4>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-1">
                                    {currentCatData.popularTypes.map(type => (
                                        <button key={type} onClick={() => setSelectedType(type === selectedType ? 'All' : type)} className={`text-left text-[11.5px] uppercase font-serif tracking-widest transition-all ${selectedType === type ? 'text-[#8B4356] translate-x-1 font-bold' : 'text-zinc-800 hover:text-black hover:translate-x-1'}`}>{type}</button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Fixed Footer */}
                <div className="lg:hidden p-4 border-t border-zinc-50 bg-white/95 backdrop-blur-md pb-10 shrink-0 z-[70] shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
                    <button onClick={() => setIsFilterOpen(false)} className="w-full bg-[#8B4356] text-white py-4.5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] shadow-xl active:scale-95 hover:bg-[#7a394b] transition-all">Apply Discovery</button>
                </div>
            </div>
        );
    };

    const CategoryMegaGrid = () => {
        const [activeGridTab, setActiveGridTab] = useState('Jewellery');
        const departments = ['Jewellery', 'Tools', 'Machines'];

        const currentDeptCats = categories.filter(c =>
            c.department?.toLowerCase() === activeGridTab.toLowerCase() &&
            c.status === 'Active'
        );

        return (
            <div className="hidden lg:block mb-10">
                {/* 1. Horizontal Department Tabs */}
                <div className="flex justify-center gap-16 mb-8 border-b border-zinc-100 pb-0.5">
                    {departments.map((dept) => (
                        <button
                            key={dept}
                            onClick={() => setActiveGridTab(dept)}
                            className={`font-serif text-[11px] tracking-[0.4em] uppercase transition-all duration-500 relative py-4 px-4 whitespace-nowrap ${activeGridTab.toLowerCase() === dept.toLowerCase() ? 'text-black font-black' : 'text-gray-300 hover:text-gray-500 font-medium'
                                }`}
                        >
                            {dept}
                            {activeGridTab.toLowerCase() === dept.toLowerCase() && (
                                <motion.div
                                    layoutId="gridTabLine"
                                    className="absolute bottom-[-1px] left-0 right-0 h-[1.5px] bg-black"
                                    initial={false}
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* 2. Showroom Panel */}
                <div className="bg-[#FDFBF7] rounded-[2rem] overflow-hidden border border-black/5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.03)]">
                    <div className="grid grid-cols-12 min-h-[400px]">
                        {/* Left Info Column */}
                        <div className="col-span-4 p-12 border-r border-black/5 flex flex-col justify-center bg-white/40 backdrop-blur-sm">
                            <motion.div
                                key={activeGridTab}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-300 mb-6 block">Elite Discovery</span>
                                <h2 className="text-5xl font-display text-black mb-4 leading-[1.1] uppercase tracking-tighter">
                                    Complete <br />
                                    <span className="italic font-serif font-normal text-gray-400 lowercase">{activeGridTab}</span>
                                </h2>
                                <p className="text-[11px] font-medium text-gray-500 leading-relaxed uppercase tracking-widest mt-8 flex items-center gap-4 group cursor-pointer" onClick={() => setSelectedCategory(activeGridTab)}>
                                    Explore our curated {activeGridTab.toLowerCase()} range, <br /> handcrafted for excellence.
                                </p>

                                <div className="mt-12 flex items-center gap-6">
                                    <button
                                        onClick={() => { setSelectedCategory(activeGridTab); setSelectedSubCategory(null); }}
                                        className="text-[10px] font-black uppercase tracking-[0.4em] text-black hover:tracking-[0.5em] transition-all flex items-center gap-4 group"
                                    >
                                        VIEW ALL
                                        <div className="w-12 h-[1px] bg-black/20 group-hover:bg-black transition-all"></div>
                                    </button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Discovery Grid */}
                        <div className="col-span-8 p-12 flex flex-col justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeGridTab}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="grid grid-cols-4 gap-x-6 gap-y-10"
                                >
                                    {currentDeptCats.map((cat, idx) => (
                                        <motion.div
                                            key={cat.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: idx * 0.05 }}
                                            onClick={() => { setSelectedCategory(cat.name); setSelectedSubCategory(null); }}
                                            className="flex flex-col items-center gap-4 group cursor-pointer"
                                        >
                                            <div className="relative w-24 h-24 rounded-full overflow-hidden border border-black/5 p-1 bg-white transition-all duration-700 group-hover:border-black/10 group-hover:scale-110 group-hover:shadow-lg">
                                                <div className="w-full h-full rounded-full overflow-hidden">
                                                    <img
                                                        src={cat.image || 'https://via.placeholder.com/300'}
                                                        className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
                                                        crossOrigin="anonymous"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 text-center transition-all group-hover:text-black">
                                                {cat.name}
                                            </span>
                                        </motion.div>
                                    ))}
                                    {currentDeptCats.length === 0 && (
                                        <div className="col-span-full py-20 text-center text-gray-300 font-serif text-[11px] uppercase tracking-widest italic">
                                            No segments initialized yet.
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white font-body selection:bg-[#8B4356] selection:text-white pb-32 md:pb-10 overflow-hidden">
            <div className="flex max-w-[1700px] mx-auto min-h-screen">
                <aside className="hidden lg:block w-[280px] shrink-0 border-r border-zinc-100 sticky top-[48px] h-[calc(100vh-48px)] z-20 overflow-hidden bg-white shadow-sm"><SidebarContent /></aside>
                <main className="flex-grow min-w-0 bg-[#fdf2f8]/5">
                    <div className="pt-8 pb-4 px-2 md:p-4 lg:px-16 lg:pt-0 lg:pb-6">
                        <div className="mb-0 lg:mb-1">
                            <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.5em] font-bold text-zinc-300 mb-1 px-1">
                                <Link to="/" className="hover:text-[#8B4356] transition-colors">Home</Link>
                                <span className="opacity-20">/</span>
                                <span className="text-zinc-400">Categories</span>
                                {selectedCategory !== 'All' && (
                                    <React.Fragment>
                                        <span className="opacity-20">/</span>
                                        <span className="text-[#8B4356]/60 tracking-[0.2em]">{selectedCategory}</span>
                                    </React.Fragment>
                                )}
                                {selectedSubCategory && (
                                    <React.Fragment>
                                        <span className="opacity-20">/</span>
                                        <span className="text-[#8B4356] tracking-[0.25em] font-black">{selectedSubCategory}</span>
                                    </React.Fragment>
                                )}
                            </div>

                            <div className="flex flex-col md:flex-row md:items-end justify-between items-start gap-4 border-b border-zinc-100 pb-1 relative px-1">
                                <div className="flex items-start justify-between w-full relative">
                                    <div className="flex flex-col gap-1">
                                        <motion.h1 key={pageTitle} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-4xl md:text-6xl lg:text-5xl font-display font-medium text-black tracking-tighter lowercase italic leading-tight">{pageTitle}</motion.h1>
                                        <div className="flex items-center gap-4">
                                            <div className="h-[1px] w-12 bg-[#8B4356]/20"></div>
                                            <p className="text-[9px] md:text-[9.5px] font-bold uppercase tracking-[0.5em] text-[#8B4356]/30 leading-none">{filteredProducts.length} Piece Discovery</p>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 flex items-center gap-3">
                                        <button
                                            onClick={() => setIsFilterOpen(true)}
                                            className="lg:hidden w-11 h-11 rounded-2xl border border-zinc-100 flex items-center justify-center bg-white text-[#8B4356] shadow-sm active:scale-95 transition-all"
                                        >
                                            <SlidersHorizontal className="w-4.5 h-4.5" strokeWidth={1} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <CategoryMegaGrid />

                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-14 gap-y-12 md:gap-y-24 pb-40">
                                {filteredProducts.map((product, idx) => (
                                    <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: (idx % 3) * 0.1, ease: "easeOut" }}><ProductCard product={product} /></motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-40 text-center bg-white rounded-[4rem] border border-zinc-50 mx-2 shadow-sm">
                                <div className="w-24 h-24 bg-[#FDF5F6]/50 rounded-full flex items-center justify-center mb-8">
                                    <Search className="w-10 h-10 text-[#8B4356]/30" />
                                </div>
                                <h3 className="text-3xl font-serif font-bold text-black mb-5">Choice Not Found</h3>
                                <p className="text-zinc-400 font-serif italic mb-10 max-w-sm mx-auto text-base">We couldn't match your discovery parameters.</p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory('Jewellery');
                                        setSelectedSubCategory(null);
                                        setSelectedType('All');
                                        setSelectedGender('All');
                                        setSelectedMetal('All');
                                        setPriceRange({ min: 0, max: 500000 });
                                        setSortBy('Newest');
                                        navigate('/shop');
                                    }}
                                    className="bg-[#8B4356] text-white px-10 py-5 rounded-full font-bold uppercase tracking-[0.4em] text-[10px] shadow-2xl transition-all"
                                >
                                    Reset All
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <AnimatePresence>
                {isFilterOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/95 z-[210] backdrop-blur-2xl" onClick={() => setIsFilterOpen(false)} />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 45, stiffness: 600 }} className="fixed top-0 right-0 h-full w-[80%] max-w-[360px] bg-white z-[220] shadow-[0_0_120px_rgba(0,0,0,0.7)] overflow-hidden"><SidebarContent /><div className="absolute top-6 right-6 z-[70]"><button onClick={() => setIsFilterOpen(false)} className="w-11 h-11 bg-zinc-50 border border-zinc-100 hover:bg-[#8B4356] hover:text-white rounded-full flex items-center justify-center transition-all shadow-lg group"><X className="w-4.5 h-4.5 group-hover:rotate-90 transition-transform" /></button></div></motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Shop;
