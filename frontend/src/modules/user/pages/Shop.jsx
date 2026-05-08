import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { useShop } from '../../../context/ShopContext';
import {
    UserCircle, ChevronRight, Search, X, SlidersHorizontal, Check,
    Image as ImageLucide
} from 'lucide-react';
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Premium banner asset
import proposalBanner from '../assets/proposal_banner.png';

const Shop = () => {
    const { products, categories } = useShop();
    const location = useLocation();
    const navigate = useNavigate();
    const { category: pathCategory } = useParams();
    const searchParams = new URLSearchParams(location.search);

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

    // Sync with URL params & Normalize Category
    useEffect(() => {
        const categoryQuery = searchParams.get('category') || pathCategory;
        const subcategoryQuery = searchParams.get('subcategory');
        const minPriceQuery = searchParams.get('minPrice');
        const maxPriceQuery = searchParams.get('maxPrice');
        const metalQuery = searchParams.get('metal');
        const typeQuery = searchParams.get('type');
        const genderQuery = searchParams.get('gender');

        if (categoryQuery) {
            const normalizedCat = decodeURIComponent(categoryQuery).toLowerCase();
            const catMatch = categories.find(c => (c.name?.toLowerCase() === normalizedCat) || (c.id?.toLowerCase() === normalizedCat));
            if (catMatch) {
                setSelectedCategory(catMatch.name);
                setOpenCategory(catMatch.name);
            } else {
                setSelectedCategory(categoryQuery);
                setOpenCategory(categoryQuery);
            }
        }

        if (subcategoryQuery) {
            const normalizedSub = decodeURIComponent(subcategoryQuery).toLowerCase();
            setSelectedSubCategory(subcategoryQuery);
            setSelectedType(subcategoryQuery); // Sync subcategory with type
        }

        if (minPriceQuery && maxPriceQuery) {
            setPriceRange({ min: parseInt(minPriceQuery) || 0, max: parseInt(maxPriceQuery) || 500000 });
        } else if (minPriceQuery) {
            setPriceRange(prev => ({ ...prev, min: parseInt(minPriceQuery) || 0 }));
        } else if (maxPriceQuery) {
            setPriceRange(prev => ({ ...prev, max: parseInt(maxPriceQuery) || 500000 }));
        }

        if (metalQuery) {
            setSelectedMetal(metalQuery);
        }

        if (typeQuery) {
            setSelectedType(typeQuery);
        }

        if (genderQuery) {
            setSelectedGender(genderQuery);
        }
    }, [location.search, categories]);

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
                ((p.subcategory || p.subCategory) && (p.subcategory || p.subCategory).toLowerCase().includes(tagFilter.toLowerCase())) ||
                (p.name && p.name.toLowerCase().includes(tagFilter.toLowerCase()))
            );
        }

        if (selectedCategory && selectedCategory !== 'All') {
            result = result.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
            if (selectedSubCategory) {
                result = result.filter(p =>
                    ((p.subcategory || p.subCategory) && (p.subcategory || p.subCategory).toLowerCase() === selectedSubCategory.toLowerCase()) ||
                    (p.name && p.name.toLowerCase().includes(selectedSubCategory.toLowerCase()))
                );
            }
        }

        if (selectedType && selectedType !== 'All') {
            result = result.filter(p => {
                const isTypeMatch = p.type?.toLowerCase() === selectedType.toLowerCase();
                const isSubMatch = (p.subcategory || p.subCategory)?.toLowerCase() === selectedType.toLowerCase();
                const isNameMatch = p.name?.toLowerCase().includes(selectedType.toLowerCase());
                return isTypeMatch || isSubMatch || isNameMatch;
            });
        }

        if (selectedGender !== 'All') result = result.filter(p => p.targetGroup?.toLowerCase() === selectedGender.toLowerCase());

        if (selectedMetal !== 'All') {
            result = result.filter(p => {
                const isMetalMatch = p.metal?.toLowerCase() === selectedMetal.toLowerCase();
                const isNameMatch = p.name?.toLowerCase().includes(selectedMetal.toLowerCase());
                const isSpecMatch = p.specifications?.some(s => s.value?.toLowerCase().includes(selectedMetal.toLowerCase()) || s.label?.toLowerCase().includes(selectedMetal.toLowerCase()));
                return isMetalMatch || isNameMatch || isSpecMatch;
            });
        }

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

    const [expandedCategory, setExpandedCategory] = useState(null);

    const SidebarContent = () => {
        const currentCatData = categories.find(c => c.name === openCategory);

        return (
            <div className="flex flex-col h-full bg-[#FDF5F6] font-body overflow-hidden relative">
                {/* Fixed Header */}
                <div className="p-2 bg-[#0a0a0a] text-white shrink-0 border-b border-white/5 z-[70] shadow-sm">
                    <div className="flex items-center gap-3">
                        <UserCircle className="w-7 h-7 text-[#8B4356]" />
                        <span className="text-[11px] font-bold tracking-[0.25em] font-serif italic text-white/90">Curated Categories</span>
                    </div>
                </div>

                {/* Scrollable Middle Container */}
                <div className="flex-1 overflow-y-auto custom-sidebar-scrollbar px-3 pt-4 space-y-3 pb-32">
                    <div>
                        <h4 className="text-[7px] font-black uppercase tracking-[0.5em] text-[#C4A5B0] mb-2 ml-1">Archive Hub</h4>
                        <div className="flex flex-col gap-1">
                            {categories.map(cat => (
                                <div key={cat.id}>
                                    <button 
                                        onClick={() => {
                                            handleCategoryToggle(cat.name);
                                            setExpandedCategory(expandedCategory === cat.name ? null : cat.name);
                                        }} 
                                        className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all flex items-center justify-between group text-[10px] font-display font-semibold tracking-wider ${openCategory === cat.name ? 'border-[#8B4356] bg-[#F5E6EB] text-[#8B4356]' : 'border-[#E8D5E0] text-[#8B4356]/70 hover:border-[#D4A5B0] hover:bg-[#FAF0F5]'}`}
                                    >
                                        <span className="font-serif uppercase tracking-wider">{cat.name}</span>
                                        <ChevronRight className={`w-3 h-3 transition-transform ${expandedCategory === cat.name ? 'rotate-90 text-[#8B4356]' : 'text-[#C4A5B0] group-hover:translate-x-0.5'}`} />
                                    </button>
                                    
                                    {/* Expanded subcategories with images */}
                                    <AnimatePresence>
                                        {expandedCategory === cat.name && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="grid grid-cols-3 gap-1.5 p-2 bg-[#F5E6EB]/50 rounded-lg mt-1">
                                                    {cat.subcategories?.map(sub => (
                                                        <button
                                                            key={sub.name}
                                                            onClick={() => setSelectedSubCategory(sub.name === selectedSubCategory ? null : sub.name)}
                                                            className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-all duration-300 ${selectedSubCategory === sub.name ? 'bg-white shadow-sm ring-1 ring-[#8B4356]' : 'bg-transparent hover:bg-[#FAF0F5]/50'}`}
                                                        >
                                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F0E0E8] flex items-center justify-center">
                                                                {sub.image ? (
                                                                    <img src={sub.image} className="w-full h-full object-cover" crossOrigin="anonymous" loading="lazy" onError={(e) => { e.target.style.display = 'none'; }} />
                                                                ) : (
                                                                    <ImageLucide className="w-4 h-4 text-[#C4A5B0]" />
                                                                )}
                                                            </div>
                                                            <span className={`text-[6.5px] font-serif uppercase tracking-wider text-center leading-tight ${selectedSubCategory === sub.name ? 'text-[#8B4356] font-bold' : 'text-[#8B4356]/60'}`}>{sub.name}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        {((openCategory?.toLowerCase() === 'rings' || openCategory?.toLowerCase() === 'jewellery' || openCategory?.toLowerCase() === 'ring')) ? (
                            /* Premium Curated Jewelry Filter sidebar */
                            <div className="space-y-4">
                                {/* 1. Popular Ring/Jewelry Types */}
                                <div>
                                    <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-[#8B4356] mb-2 flex items-center gap-2">
                                        Popular {openCategory} Types
                                        <div className="h-[1px] flex-grow bg-[#E8D5E0]"></div>
                                    </h4>
                                    <div className="grid grid-cols-2 gap-1 px-0.5 max-h-[160px] overflow-y-auto custom-sidebar-scrollbar">
                                        {(openCategory?.toLowerCase() === 'rings' || openCategory?.toLowerCase() === 'ring' ? [
                                            'Engagement', 'Diamond', 'Couple Bands', 'Plain Gold', 'Office Wear', 'Gemstone', 'Stackable', 'Solitaire', 'Slider', 'Cocktail', 'Religious', 'Multi-finger', 'Platinum Bands', 'Navaratna', 'For Men', 'Pearl', 'For Gift'
                                        ] : [
                                            'Studs', 'Jhumkas', 'Drops', 'Hoops', 'Choker', 'Kundan', 'Lariat', 'Collar', 'Temple', 'Gold Chain', 'Diamond Necklace', 'Gold Bangles', 'Diamond Bracelets', 'Kada'
                                        ]).map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setSelectedType(t === selectedType ? 'All' : t)}
                                                className={`text-left text-[8px] uppercase font-serif tracking-wider transition-all duration-300 px-2 py-1.5 rounded-lg border ${selectedType === t ? 'text-white border-[#8B4356] bg-[#8B4356] font-bold shadow-sm' : 'text-[#8B4356]/70 border-[#E8D5E0] hover:border-[#D4A5B0] hover:bg-[#FAF0F5]'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 2. By Price Range */}
                                <div>
                                    <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-[#8B4356] mb-2 flex items-center gap-2">
                                        By Price Range
                                        <div className="h-[1px] flex-grow bg-[#E8D5E0]"></div>
                                    </h4>
                                    <div className="grid grid-cols-1 gap-1 px-0.5">
                                        {[
                                            { label: 'Below 10,000', min: 0, max: 10000 },
                                            { label: 'Rs. 10k - 20k', min: 10000, max: 20000 },
                                            { label: 'Rs. 20k - 30k', min: 20000, max: 30000 },
                                            { label: 'Rs. 30k - 40k', min: 30000, max: 40000 },
                                            { label: 'Rs. 40k - 50k', min: 40000, max: 50000 },
                                            { label: 'Rs. 50,000 & above', min: 50000, max: 500000 }
                                        ].map((range, idx) => {
                                            const isSelected = priceRange.min === range.min && priceRange.max === range.max;
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setPriceRange({ min: 0, max: 500000 });
                                                        } else {
                                                            setPriceRange({ min: range.min, max: range.max });
                                                        }
                                                    }}
                                                    className={`w-full text-left px-2.5 py-1.5 rounded-lg border transition-all duration-300 flex items-center justify-between text-[8px] ${isSelected ? 'border-[#8B4356] bg-[#F5E6EB] text-[#8B4356] font-bold' : 'border-[#E8D5E0] text-[#8B4356]/70 hover:bg-[#FAF0F5]'}`}
                                                >
                                                    <span className="font-serif uppercase tracking-wider">{range.label}</span>
                                                    {isSelected && <Check className="w-2.5 h-2.5 text-[#8B4356]" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    
                                    {/* Custom Price Slider */}
                                    <div className="mt-2.5 pt-2 border-t border-dashed border-[#E8D5E0]/60">
                                        <span className="text-[6.5px] uppercase font-bold text-[#C4A5B0] block mb-1">Custom Slider</span>
                                        <div className="flex justify-between items-end gap-1 mb-1.5">
                                            <input
                                                type="number"
                                                value={priceRange.min}
                                                onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                                                className="w-16 bg-white border border-[#E8D5E0] text-[8px] font-bold text-[#8B4356] p-0.5 rounded text-center"
                                            />
                                            <span className="text-gray-400 text-xs">-</span>
                                            <input
                                                type="number"
                                                value={priceRange.max}
                                                onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 0 }))}
                                                className="w-16 bg-white border border-[#E8D5E0] text-[8px] font-bold text-[#8B4356] p-0.5 rounded text-center"
                                            />
                                        </div>
                                        <div className="relative h-4 flex items-center">
                                            <input
                                                type="range"
                                                min="0"
                                                max="500000"
                                                step="1000"
                                                value={priceRange.max}
                                                onChange={(e) => setPriceRange(prev => ({ ...prev, max: Math.max(prev.min + 1000, parseInt(e.target.value)) }))}
                                                className="absolute w-full h-[1.5px] bg-[#E8D5E0] rounded-lg appearance-none cursor-pointer accent-[#8B4356] z-20 pointer-events-auto"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 3. By Metals & Stones */}
                                <div>
                                    <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-[#8B4356] mb-2 flex items-center gap-2">
                                        By Metals & Stones
                                        <div className="h-[1px] flex-grow bg-[#E8D5E0]"></div>
                                    </h4>
                                    <div className="grid grid-cols-2 gap-1 px-0.5">
                                        {[
                                            { label: 'Diamond', val: 'Diamond' },
                                            { label: 'Gold', val: 'Gold' },
                                            { label: 'White Gold', val: 'White Gold' },
                                            { label: 'Rose Gold', val: 'Rose Gold' },
                                            { label: 'Platinum', val: 'Platinum' },
                                            { label: 'Solitaire', val: 'Solitaire' }
                                        ].map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedMetal(item.val === selectedMetal ? 'All' : item.val)}
                                                className={`py-1.5 rounded-lg border text-[8px] font-serif uppercase tracking-wider text-center transition-all duration-300 ${selectedMetal === item.val ? 'border-[#8B4356] bg-[#8B4356] text-white shadow-sm font-bold' : 'border-[#E8D5E0] text-[#8B4356]/70 hover:border-[#D4A5B0] hover:bg-[#FAF0F5]'}`}
                                            >
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 4. Collections Promo Banner */}
                                <div className="pb-4">
                                    <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-[#8B4356] mb-2 flex items-center gap-2">
                                        Our Collections
                                        <div className="h-[1px] flex-grow bg-[#E8D5E0]"></div>
                                    </h4>
                                    <div className="relative aspect-[1.8] rounded-xl overflow-hidden shadow-md border border-[#E8D5E0] group/sidebar-banner">
                                        <img
                                            src={proposalBanner}
                                            alt="Liviana Stacks of Love"
                                            className="w-full h-full object-cover transform transition-transform duration-700 group-hover/sidebar-banner:scale-110"
                                            crossOrigin="anonymous"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5">
                                            <span className="text-[6px] font-black text-[#8B4356] tracking-widest uppercase bg-white/90 px-1 py-0.5 rounded-sm self-start mb-1">Featured</span>
                                            <h5 className="text-white font-serif italic text-[10px] leading-none mb-0.5">
                                                Liviana - Stacks of Love
                                            </h5>
                                            <button
                                                onClick={() => {
                                                    setSelectedCategory('RINGS');
                                                    setSelectedType('Couple Bands');
                                                }}
                                                className="text-white text-[7px] font-bold uppercase tracking-wider hover:underline text-left self-start"
                                            >
                                                View All &gt;&gt;
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Fallback standard filters for Machines and Tools */
                            <>
                                {/* DYNAMIC MATERIAL SECTION based on Category */}
                                {currentCatData?.materials && (
                                    <div>
                                        <h4 className="text-[7px] font-black uppercase tracking-[0.5em] text-[#8B4356] mb-2 flex items-center gap-2">
                                            {currentCatData.materialLabel || "By Material"}
                                            <div className="h-[1px] flex-grow bg-[#E8D5E0]"></div>
                                        </h4>
                                        <div className="grid grid-cols-2 gap-1.5 px-0.5">
                                            {currentCatData.materials.map(m => (
                                                <button key={m} onClick={() => setSelectedMetal(m === selectedMetal ? 'All' : m)} className={`py-1.5 rounded-lg border text-[8px] font-serif uppercase tracking-wider transition-all duration-300 ${selectedMetal === m ? 'border-[#8B4356] bg-[#8B4356] text-white shadow-sm font-bold' : 'border-[#E8D5E0] text-[#8B4356]/70 hover:border-[#D4A5B0] hover:bg-[#FAF0F5]'}`}>{m}</button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* PRICE SLIDER */}
                                <div>
                                    <h4 className="text-[7px] font-black uppercase tracking-[0.5em] text-[#C4A5B0] mb-2 flex items-center gap-2">Price Explorer <div className="h-[1px] flex-grow bg-[#E8D5E0]"></div></h4>
                                    <div className="px-1 space-y-2">
                                        <div className="flex justify-between items-end gap-2">
                                            <div className="flex flex-col gap-0.5 flex-1">
                                                <label className="text-[6px] font-black uppercase text-[#C4A5B0]">Min</label>
                                                <input
                                                    type="number"
                                                    value={priceRange.min}
                                                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                                                    className="w-full bg-white border border-[#E8D5E0] text-[9px] font-bold text-[#8B4356] p-1 rounded"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-0.5 flex-1">
                                                <label className="text-[6px] font-black uppercase text-[#C4A5B0]">Max</label>
                                                <input
                                                    type="number"
                                                    value={priceRange.max}
                                                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 0 }))}
                                                    className="w-full bg-white border border-[#E8D5E0] text-[9px] font-bold text-[#8B4356] p-1 rounded text-right"
                                                />
                                            </div>
                                        </div>

                                        <div className="relative h-5 flex items-center">
                                            <input
                                                type="range"
                                                min="0"
                                                max="500000"
                                                step="1000"
                                                value={priceRange.max}
                                                onChange={(e) => setPriceRange(prev => ({ ...prev, max: Math.max(prev.min + 1000, parseInt(e.target.value)) }))}
                                                className="absolute w-full h-[2px] bg-[#E8D5E0] rounded-lg appearance-none cursor-pointer accent-[#8B4356] z-20 pointer-events-auto"
                                            />
                                            <input
                                                type="range"
                                                min="0"
                                                max="500000"
                                                step="1000"
                                                value={priceRange.min}
                                                onChange={(e) => setPriceRange(prev => ({ ...prev, min: Math.min(prev.max - 1000, parseInt(e.target.value)) }))}
                                                className="absolute w-full h-[2px] bg-transparent appearance-none cursor-pointer accent-[#8B4356] invisible pointer-events-none [&::-webkit-slider-thumb]:visible [&::-webkit-slider-thumb]:pointer-events-auto"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* TARGET GROUP FILTER */}
                                <div>
                                    <h4 className="text-[7px] font-black uppercase tracking-[0.5em] text-[#C4A5B0] mb-2 flex items-center gap-2">Target View <div className="h-[1px] flex-grow bg-[#E8D5E0]"></div></h4>
                                    <div className="flex flex-wrap gap-1 px-0.5">
                                        {['All', 'Male', 'Female', 'Children', 'Unisex'].map(g => (
                                            <button key={g} onClick={() => setSelectedGender(g)} className={`px-2 py-1 rounded-lg border text-[7px] font-serif uppercase tracking-wider transition-all duration-300 ${selectedGender === g ? 'border-[#8B4356] bg-[#8B4356] text-white shadow-sm font-bold' : 'border-[#E8D5E0] text-[#8B4356]/70 hover:border-[#D4A5B0] hover:bg-[#FAF0F5]'}`}>{g}</button>
                                        ))}
                                    </div>
                                </div>

                                {/* SORT FILTER */}
                                <div>
                                    <h4 className="text-[7px] font-black uppercase tracking-[0.5em] text-[#C4A5B0] mb-2 flex items-center gap-2">Refine Order <div className="h-[1px] flex-grow bg-[#E8D5E0]"></div></h4>
                                    <div className="grid grid-cols-1 gap-1 px-0.5">
                                        {['Newest', 'Price: Low to High', 'Price: High to Low', 'Best Selling'].map(s => (
                                            <button key={s} onClick={() => setSortBy(s)} className={`w-full text-left px-2 py-1 rounded-lg border transition-all duration-300 flex items-center justify-between text-[7px] ${sortBy === s ? 'border-[#8B4356] bg-[#F5E6EB] text-[#8B4356]' : 'border-[#E8D5E0] text-[#8B4356]/70 hover:bg-[#FAF0F5]'}`}>
                                                <span className="font-serif uppercase tracking-wider">{s}</span>
                                                {sortBy === s && <Check className="w-2.5 h-2.5 text-[#8B4356]" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {currentCatData?.popularTypes && (
                                    <div className="pb-6">
                                        <h4 className="text-[7px] font-black uppercase tracking-[0.5em] text-[#C4A5B0] mb-2 flex items-center gap-2">Popular Options <div className="h-[1px] flex-grow bg-[#E8D5E0]"></div></h4>
                                        <div className="grid grid-cols-2 gap-1.5 px-0.5">
                                            {currentCatData.popularTypes.map(type => (
                                                <button key={type} onClick={() => setSelectedType(type === selectedType ? 'All' : type)} className={`text-left text-[7px] uppercase font-serif tracking-wider transition-all duration-300 px-2 py-1 rounded-lg border ${selectedType === type ? 'text-[#8B4356] border-[#8B4356] bg-[#F5E6EB] font-bold' : 'text-[#8B4356]/70 border-[#E8D5E0] hover:border-[#D4A5B0] hover:bg-[#FAF0F5]'}`}>{type}</button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Fixed Footer */}
                <div className="lg:hidden p-3 border-t border-[#E8D5E0] bg-[#FDF5F6]/95 backdrop-blur-md pb-8 shrink-0 z-[70] shadow-[0_-5px_20px_rgba(139,67,86,0.05)]">
                    <button onClick={() => setIsFilterOpen(false)} className="w-full bg-[#8B4356] text-white py-3 rounded-xl font-bold uppercase tracking-[0.15em] text-[9px] shadow-lg active:scale-95 hover:bg-[#7a394b] transition-all">Apply Discovery</button>
                </div>
            </div>
        );
    };



    return (
        <div className="min-h-screen bg-white font-body selection:bg-[#8B4356] selection:text-white pb-32 md:pb-10 overflow-hidden">
            <div className="flex max-w-[1700px] mx-auto min-h-screen">
                <aside className="hidden lg:block w-[220px] shrink-0 border-r border-zinc-100 sticky top-0 h-screen z-20 overflow-hidden bg-white shadow-sm">{SidebarContent()}</aside>
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
                                        <motion.h1 key={pageTitle} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-4xl md:text-5xl lg:text-6xl font-serif italic font-medium text-black tracking-tighter lowercase leading-tight">{pageTitle}</motion.h1>
                                        <div className="flex items-center gap-4">
                                            <div className="h-[1px] w-12 bg-[#8B4356]/20"></div>
                                            <p className="text-[9px] md:text-[9.5px] font-bold uppercase tracking-[0.5em] text-[#8B4356]/30 leading-none">{filteredProducts.length} Piece Discovery</p>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 flex items-center gap-3">
                                        {/* Right Side Quick Filter */}
                                        <div className="hidden lg:flex items-center gap-2 bg-white border border-zinc-100 rounded-2xl px-4 py-2 shadow-sm">
                                            <span className="text-[9px] font-black uppercase text-zinc-400 tracking-[0.2em]">Filter:</span>
                                            <select
                                                value={selectedGender}
                                                onChange={(e) => setSelectedGender(e.target.value)}
                                                className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-[#8B4356] focus:ring-0 cursor-pointer"
                                            >
                                                {['All', 'Male', 'Female', 'Children', 'Unisex'].map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>

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

                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3 gap-y-3 md:gap-y-4 pb-40">
                                {filteredProducts.map((product, idx) => (
                                    <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: (idx % 5) * 0.08, ease: "easeOut" }}><ProductCard product={product} /></motion.div>
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
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 45, stiffness: 600 }} className="fixed top-0 right-0 h-full w-[80%] max-w-[360px] bg-white z-[220] shadow-[0_0_120px_rgba(0,0,0,0.7)] overflow-hidden">{SidebarContent()}<div className="absolute top-6 right-6 z-[70]"><button onClick={() => setIsFilterOpen(false)} className="w-11 h-11 bg-zinc-50 border border-zinc-100 hover:bg-[#8B4356] hover:text-white rounded-full flex items-center justify-center transition-all shadow-lg group"><X className="w-4.5 h-4.5 group-hover:rotate-90 transition-transform" /></button></div></motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Shop;
