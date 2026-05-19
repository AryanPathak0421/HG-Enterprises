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
import catRings from '../assets/cat_rings.png';
import catRingsCustom from '../assets/cat_rings_custom.png';
import catRingsRuby from '../assets/cat_rings_ruby.jpg';
import diamondSolitaire from '../assets/diamond_solitaire.png';
import catRingWine from '../assets/cat_ring_wine.png';
import catPendant from '../assets/cat_pendant.png';
import catEarrings from '../assets/cat_earrings.png';
import catBracelets from '../assets/cat_bracelets.png';

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
    const [sortBy, setSortBy] = useState('POPULAR');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 }); // Dual price slider support
    const [expandedCategory, setExpandedCategory] = useState(null);
    
    // Customization Box States
    const [showCustomization, setShowCustomization] = useState(true);
    const [custColor, setCustColor] = useState('YELLOW');
    const [custPurity, setCustPurity] = useState('18Kt');
    const [custCarat, setCustCarat] = useState('0.15');
    const [custQuality, setCustQuality] = useState('SI IJ');

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
                setExpandedCategory(catMatch.name);
            } else {
                setSelectedCategory(categoryQuery);
                setOpenCategory(categoryQuery);
                setExpandedCategory(categoryQuery);
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

    // Prevent page scroll when scrolling inside sidebar
    useEffect(() => {
        const handleWheel = (e) => {
            const el = e.target.closest('.js-prevent-page-scroll');
            if (!el) return;
            
            const delta = e.deltaY;
            const scrollTop = el.scrollTop;
            const scrollHeight = el.scrollHeight;
            const clientHeight = el.clientHeight;
            
            if (delta > 0 && scrollTop + clientHeight >= scrollHeight) {
                e.preventDefault();
            }
            if (delta < 0 && scrollTop <= 0) {
                e.preventDefault();
            }
        };
        
        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleWheel);
    }, []);

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
                (p.name && p.name.toLowerCase().includes(tagFilter.toLowerCase())) ||
                (p.tag && p.tag.toLowerCase().includes(tagFilter.toLowerCase()))
            );
        }

        if (selectedCategory && selectedCategory !== 'All') {
            result = result.filter(p =>
                (p.category?.toLowerCase() === selectedCategory.toLowerCase()) ||
                (p.department?.toLowerCase() === selectedCategory.toLowerCase()) ||
                (selectedCategory.toLowerCase() === 'machine' && p.department?.toLowerCase() === 'machines')
            );

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

        if (sortBy === 'PRICE LOW TO HIGH') result.sort((a, b) => a.price - b.price);
        else if (sortBy === 'PRICE HIGH TO LOW') result.sort((a, b) => b.price - a.price);
        else if (sortBy === 'POPULAR') result.sort((a, b) => b.rating - a.rating);
        else if (sortBy === 'WHAT\'S NEW') result.sort((a, b) => (b.isNew === a.isNew) ? 0 : b.isNew ? 1 : -1);
        else if (sortBy === 'DISCOUNT') result.sort((a, b) => (b.discount || 0) - (a.discount || 0));

        return result;
    }, [selectedCategory, selectedSubCategory, selectedType, selectedGender, selectedMetal, priceRange, sortBy, location.search]);

    const pageTitle = useMemo(() => {
        return selectedSubCategory || selectedCategory || 'Categories Master';
    }, [selectedCategory, selectedSubCategory]);

    const enhancedCategories = useMemo(() => {
        return categories.map(cat => {
            const catNameLower = cat.name?.toLowerCase();
            if (catNameLower === 'rings' && (!cat.subcategories || cat.subcategories.length === 0)) {
                return {
                    ...cat,
                    subcategories: [
                        { name: 'Engagement', image: catRings },
                        { name: 'Diamond', image: diamondSolitaire },
                        { name: 'Couple Bands', image: catRings },
                        { name: 'Plain Gold', image: catRingWine },
                        { name: 'Office Wear', image: catRingsCustom },
                        { name: 'Gemstone', image: catRingsRuby },
                        { name: 'Stackable', image: catRings },
                        { name: 'Solitaire', image: diamondSolitaire },
                        { name: 'Slider', image: catRings },
                        { name: 'Cocktail', image: catRingsCustom },
                        { name: 'Religious', image: catRings },
                        { name: 'Multi-finger', image: catRingsCustom },
                        { name: 'Platinum Bands', image: catRings },
                        { name: 'Navaratna', image: catRingsRuby },
                        { name: 'For Men', image: catRings },
                        { name: 'Pearl', image: catRingsCustom },
                        { name: 'For Gift', image: catRings }
                    ]
                };
            } else if (catNameLower === 'pendants' && (!cat.subcategories || cat.subcategories.length === 0)) {
                return {
                    ...cat,
                    subcategories: [
                        { name: 'Diamond', image: diamondSolitaire },
                        { name: 'Gold', image: catRingWine },
                        { name: 'Gemstone', image: catRingsRuby },
                        { name: 'Heart', image: catPendant },
                        { name: 'Religious', image: catPendant },
                        { name: 'Alphabet', image: catPendant }
                    ]
                };
            } else if (catNameLower === 'earrings' && (!cat.subcategories || cat.subcategories.length === 0)) {
                return {
                    ...cat,
                    subcategories: [
                        { name: 'Studs', image: catEarrings },
                        { name: 'Jhumkas', image: catEarrings },
                        { name: 'Drops', image: catEarrings },
                        { name: 'Hoops', image: catEarrings },
                        { name: 'Chandbalis', image: catEarrings },
                        { name: 'Sui Dhaga', image: catEarrings }
                    ]
                };
            } else if (catNameLower === 'necklaces' && (!cat.subcategories || cat.subcategories.length === 0)) {
                return {
                    ...cat,
                    subcategories: [
                        { name: 'Choker', image: catEarrings }, // Fallback to earrings if no necklace image
                        { name: 'Chains', image: catRingWine },
                        { name: 'Collar', image: catEarrings },
                        { name: 'Lariat', image: catEarrings },
                        { name: 'Temple', image: catEarrings },
                        { name: 'Pearl', image: catRingsCustom }
                    ]
                };
            } else if (catNameLower === 'bracelets' && (!cat.subcategories || cat.subcategories.length === 0)) {
                return {
                    ...cat,
                    subcategories: [
                        { name: 'Chain', image: catBracelets },
                        { name: 'Bangles', image: catBracelets },
                        { name: 'Kada', image: catBracelets },
                        { name: 'Charm', image: catBracelets },
                        { name: 'Tennis', image: catBracelets }
                    ]
                };
            } else if (catNameLower === 'mangalsutra' && (!cat.subcategories || cat.subcategories.length === 0)) {
                return {
                    ...cat,
                    subcategories: [
                        { name: 'Modern', image: catRings },
                        { name: 'Traditional', image: catRings },
                        { name: 'Gemstone', image: catRingsRuby },
                        { name: 'Diamond', image: diamondSolitaire }
                    ]
                };
            }
            return cat;
        });
    }, [categories]);

    const handleCategoryToggle = (name) => {
        setOpenCategory(name);
        setSelectedCategory(name);
        setSelectedSubCategory(null);
        setSelectedType('All');
        setSelectedMetal('All');
    };

    const SidebarContent = () => {
        const currentCatData = enhancedCategories.find(c => c.name === openCategory);
        const isJewelry = openCategory?.toLowerCase() === 'rings' || openCategory?.toLowerCase() === 'jewellery' || openCategory?.toLowerCase() === 'ring';

        return (
            <div className="flex flex-col h-full bg-white font-sans overflow-hidden relative border-r border-gray-200" style={{ fontFamily: "'Muli', 'Arial', sans-serif" }}>
                {/* Fixed Header */}
                <div className="h-8 flex items-center px-3 bg-black text-white shrink-0 z-[70] shadow-sm">
                    <span className="text-xs font-normal tracking-wider text-white uppercase" style={{ fontFamily: 'Arial, sans-serif' }}>Filters</span>
                </div>

                {/* Scrollable Middle Container */}
                <div className="overflow-y-auto custom-sidebar-scrollbar px-2 pt-2 space-y-3 pb-4 js-prevent-page-scroll border border-gray-200 border-t-0" style={{ overscrollBehavior: 'contain', height: 'calc(100vh - 150px)' }} data-lenis-prevent>
                    
                    {/* 1. Price (Top) */}
                    {isJewelry ? (
                        <div>
                            <h4 className="text-xs font-normal text-gray-800 mb-1">Price</h4>
                            <div className="flex flex-col gap-1.5 px-1">
                                {[
                                    { label: '₹ 0 - ₹ 10,000', min: 0, max: 10000 },
                                    { label: '₹ 10,000 - ₹ 20,000', min: 10000, max: 20000 },
                                    { label: '₹ 20,000 - ₹ 30,000', min: 20000, max: 30000 },
                                    { label: '₹ 30,000 - ₹ 40,000', min: 30000, max: 40000 },
                                    { label: '₹ 40,000 - ₹ 50,000', min: 40000, max: 50000 },
                                    { label: '₹ 50,000 and Above', min: 50000, max: 500000 }
                                ].map((range, idx) => {
                                    const isSelected = priceRange.min === range.min && priceRange.max === range.max;
                                    return (
                                        <label key={idx} className="flex items-center gap-1.5 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => {
                                                    if (isSelected) {
                                                        setPriceRange({ min: 0, max: 500000 });
                                                    } else {
                                                        setPriceRange({ min: range.min, max: range.max });
                                                    }
                                                }}
                                                className="w-3.5 h-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                            />
                                            <span className="text-xs text-gray-700">{range.label}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h4 className="text-xs font-normal text-gray-800 mb-1">Price</h4>
                            <div className="px-1 space-y-1">
                                <div className="flex justify-between items-end gap-1.5">
                                    <div className="flex flex-col gap-0.5 flex-1">
                                        <label className="text-[10px] text-gray-500">Min</label>
                                        <input
                                            type="number"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                                            className="w-full bg-white border border-gray-200 text-xs p-1 rounded"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-0.5 flex-1">
                                        <label className="text-[10px] text-gray-500">Max</label>
                                        <input
                                            type="number"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 0 }))}
                                            className="w-full bg-white border border-gray-200 text-xs p-1 rounded text-right"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. Categories (Types and Subcategories) */}
                    <div>
                        <h4 className="text-xs font-normal text-gray-800 mb-1">Categories</h4>
                        <div className="flex flex-col gap-0.5">
                            {enhancedCategories.map(cat => (
                                <div key={cat.id}>
                                    <button
                                        onClick={() => {
                                            handleCategoryToggle(cat.name);
                                            setExpandedCategory(expandedCategory === cat.name ? null : cat.name);
                                        }}
                                        className={`w-full text-left px-2 py-1 rounded text-xs transition-all flex items-center justify-between ${openCategory === cat.name ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        <span className="capitalize">{cat.name.toLowerCase()}</span>
                                        <ChevronRight className={`w-3 h-3 transition-transform ${expandedCategory === cat.name ? 'rotate-90 text-blue-600' : 'text-gray-400'}`} />
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
                                                <div className="grid grid-cols-3 gap-1 p-1 bg-gray-50 rounded mt-0.5">
                                                    {cat.subcategories?.map(sub => (
                                                        <button
                                                            key={sub.name}
                                                            onClick={() => {
                                                                const newVal = sub.name === selectedSubCategory ? null : sub.name;
                                                                setSelectedSubCategory(newVal);
                                                                setSelectedType(newVal || 'All');
                                                            }}
                                                            className={`flex flex-col items-center gap-0.5 p-1 rounded transition-all duration-300 ${selectedSubCategory === sub.name ? 'bg-white shadow-sm ring-1 ring-blue-600' : 'bg-transparent hover:bg-gray-100'}`}
                                                        >
                                                            <div className="w-8 h-8 rounded overflow-hidden bg-gray-200 flex items-center justify-center">
                                                                {sub.image ? (
                                                                    <img src={sub.image} className="w-full h-full object-cover" loading="lazy" onError={(e) => { e.target.style.display = 'none'; }} />
                                                                ) : (
                                                                    <ImageLucide className="w-3 h-3 text-gray-400" />
                                                                )}
                                                            </div>
                                                            <span className={`text-[7px] tracking-wider text-center leading-tight mt-0.5 ${selectedSubCategory === sub.name ? 'text-blue-600' : 'text-gray-600'}`}>{sub.name}</span>
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

                    {/* 3. Other Details */}
                    <div className="border-t border-gray-100 pt-2">
                        {isJewelry ? (
                            <div className="space-y-3">
                                {/* Customization UI Box */}
                                <div>
                                    <div className="flex justify-between items-center cursor-pointer mb-1.5" onClick={() => setShowCustomization(!showCustomization)}>
                                        <h4 className="text-[13px] font-normal text-gray-800">{showCustomization ? 'Hide' : 'Show'} Customization</h4>
                                        <span className="text-gray-600 text-lg leading-none">{showCustomization ? '−' : '+'}</span>
                                    </div>
                                    
                                    <AnimatePresence>
                                        {showCustomization && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                <div className="bg-[#fafafa] p-1.5 rounded-sm flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-1.5">
                                                        {/* Color Select */}
                                                        <div className="relative bg-white border border-gray-100 flex items-center px-1.5 py-1 rounded-[1px] w-[90px] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                                                            <div className={`w-3 h-3 rounded-[1px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] shrink-0 mr-1.5 ${custColor === 'YELLOW' ? 'bg-gradient-to-br from-[#FFE383] to-[#F1B920]' : custColor === 'ROSE' ? 'bg-gradient-to-br from-[#F4C5B9] to-[#D58C7C]' : 'bg-gradient-to-br from-[#F5F5F5] to-[#D1D1D1]'}`}></div>
                                                            <select 
                                                                value={custColor}
                                                                onChange={(e) => setCustColor(e.target.value)}
                                                                className="w-full text-[10.5px] uppercase font-normal text-[#1A202C] bg-transparent appearance-none outline-none cursor-pointer tracking-wide"
                                                                style={{ paddingRight: '12px' }}
                                                            >
                                                                <option value="YELLOW">YELLOW</option>
                                                                <option value="ROSE">ROSE</option>
                                                                <option value="WHITE">WHITE</option>
                                                            </select>
                                                            <svg className="w-2.5 h-2.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                        </div>

                                                        {/* Purity Radio */}
                                                        <div className="flex bg-white border border-gray-100 px-2 py-1 rounded-[1px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] gap-3 items-center w-full">
                                                            <label className="flex items-center gap-1.5 cursor-pointer">
                                                                <input type="radio" name="purity" checked={custPurity === '14Kt'} onChange={() => setCustPurity('14Kt')} className="w-3 h-3 text-[#1C5196] focus:ring-[#1C5196] border-gray-300 bg-transparent m-0 p-0" />
                                                                <span className="text-[10.5px] text-gray-600 tracking-wide font-normal">14Kt</span>
                                                            </label>
                                                            <label className="flex items-center gap-1.5 cursor-pointer">
                                                                <input type="radio" name="purity" checked={custPurity === '18Kt'} onChange={() => setCustPurity('18Kt')} className="w-3 h-3 text-[#1C5196] focus:ring-[#1C5196] border-gray-300 bg-transparent m-0 p-0" />
                                                                <span className="text-[10.5px] text-gray-600 tracking-wide font-normal">18Kt</span>
                                                            </label>
                                                        </div>
                                                    </div>

                                                    {/* Solitaire section */}
                                                    <div className="flex items-center bg-white border border-gray-100 py-1.5 px-2 rounded-[1px] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                                                        <div className="flex items-center gap-1.5 pr-2 border-r border-gray-200">
                                                            <svg className="w-3 h-3 text-[#1C3B68]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5l8.25-4.5 8.25 4.5-8.25 12-8.25-12z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5h16.5m-16.5 0l8.25 4.5 8.25-4.5" /></svg>
                                                            <span className="text-[10.5px] uppercase text-[#1C3B68] font-normal tracking-wide">SOLITAIRE :</span>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-1.5 px-2 border-r border-gray-200">
                                                            <span className="text-[10.5px] text-gray-500">Carat</span>
                                                            <div className="relative border border-black rounded-[2px]">
                                                                <select 
                                                                    value={custCarat}
                                                                    onChange={(e) => setCustCarat(e.target.value)}
                                                                    className="text-[10.5px] font-medium px-1.5 py-0.5 appearance-none outline-none bg-transparent cursor-pointer text-gray-800"
                                                                    style={{ paddingRight: '16px' }}
                                                                >
                                                                    <option value="0.15">0.15</option>
                                                                    <option value="0.25">0.25</option>
                                                                    <option value="0.50">0.50</option>
                                                                </select>
                                                                <svg className="w-2.5 h-2.5 absolute right-1 top-1/2 -translate-y-1/2 text-black pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-1.5 pl-2">
                                                            <span className="text-[10.5px] text-gray-500">Quality</span>
                                                            <div className="relative bg-[#f5f5f5] rounded-[2px]">
                                                                <select 
                                                                    value={custQuality}
                                                                    onChange={(e) => setCustQuality(e.target.value)}
                                                                    className="text-[10.5px] font-medium text-gray-700 px-1.5 py-0.5 appearance-none border-none outline-none cursor-pointer tracking-wider bg-transparent"
                                                                    style={{ paddingRight: '16px' }}
                                                                >
                                                                    <option value="SI IJ">SI IJ</option>
                                                                    <option value="VVS EF">VVS EF</option>
                                                                </select>
                                                                <svg className="w-2.5 h-2.5 absolute right-1 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Type (Subcategories list as checkboxes) */}
                                <div>
                                    <h4 className="text-xs font-normal text-gray-800 mb-1">Type</h4>
                                    <div className="flex flex-col gap-1.5 px-1 max-h-[160px] overflow-y-auto custom-sidebar-scrollbar js-prevent-page-scroll" style={{ overscrollBehavior: 'contain' }} data-lenis-prevent>
                                        {(openCategory?.toLowerCase() === 'rings' || openCategory?.toLowerCase() === 'ring' ? [
                                            'Engagement', 'Diamond', 'Couple Bands', 'Plain Gold', 'Office Wear', 'Gemstone', 'Stackable', 'Solitaire', 'Slider', 'Cocktail', 'Religious', 'Multi-finger', 'Platinum Bands', 'Navaratna', 'For Men', 'Pearl', 'For Gift'
                                        ] : [
                                            'Studs', 'Jhumkas', 'Drops', 'Hoops', 'Choker', 'Kundan', 'Lariat', 'Collar', 'Temple', 'Gold Chain', 'Diamond Necklace', 'Gold Bangles', 'Diamond Bracelets', 'Kada'
                                        ]).map(t => (
                                            <label key={t} className="flex items-center gap-1.5 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedType === t}
                                                    onChange={() => setSelectedType(t === selectedType ? 'All' : t)}
                                                    className="w-3.5 h-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                />
                                                <span className="text-xs text-gray-700">{t}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Metal */}
                                <div>
                                    <h4 className="text-xs font-normal text-gray-800 mb-1">Metal</h4>
                                    <div className="flex flex-col gap-1.5 px-1">
                                        {[
                                            { label: 'Diamond', val: 'Diamond' },
                                            { label: 'Gold', val: 'Gold' },
                                            { label: 'White Gold', val: 'White Gold' },
                                            { label: 'Rose Gold', val: 'Rose Gold' },
                                            { label: 'Platinum', val: 'Platinum' },
                                            { label: 'Solitaire', val: 'Solitaire' }
                                        ].map((item, idx) => (
                                            <label key={idx} className="flex items-center gap-1.5 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMetal === item.val}
                                                    onChange={() => setSelectedMetal(item.val === selectedMetal ? 'All' : item.val)}
                                                    className="w-3.5 h-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                />
                                                <span className="text-xs text-gray-700">{item.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Gender */}
                                <div>
                                    <h4 className="text-xs font-normal text-gray-800 mb-1">Gender</h4>
                                    <div className="flex flex-col gap-1.5 px-1">
                                        {['All', 'Male', 'Female', 'Children', 'Unisex'].map(g => (
                                            <label key={g} className="flex items-center gap-1.5 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedGender === g}
                                                    onChange={() => setSelectedGender(g)}
                                                    className="w-3.5 h-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                />
                                                <span className="text-xs text-gray-700">{g}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {/* DYNAMIC MATERIAL SECTION */}
                                {currentCatData?.materials && (
                                    <div>
                                        <h4 className="text-xs font-normal text-gray-800 mb-1">{currentCatData.materialLabel || "By Material"}</h4>
                                        <div className="flex flex-col gap-1.5 px-1">
                                            {currentCatData.materials.map(m => (
                                                <label key={m} className="flex items-center gap-1.5 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedMetal === m}
                                                        onChange={() => setSelectedMetal(m === selectedMetal ? 'All' : m)}
                                                        className="w-3.5 h-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-xs text-gray-700">{m}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Gender */}
                                <div>
                                    <h4 className="text-xs font-normal text-gray-800 mb-1">Gender</h4>
                                    <div className="flex flex-col gap-1.5 px-1">
                                        {['All', 'Male', 'Female', 'Children', 'Unisex'].map(g => (
                                            <label key={g} className="flex items-center gap-1.5 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedGender === g}
                                                    onChange={() => setSelectedGender(g)}
                                                    className="w-3.5 h-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                />
                                                <span className="text-xs text-gray-700">{g}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Fixed Footer */}
                <div className="lg:hidden p-2 border-t border-gray-200 bg-white/95 backdrop-blur-md pb-6 shrink-0 z-[70] shadow-sm">
                    <button onClick={() => setIsFilterOpen(false)} className="w-full bg-black text-white py-1.5 rounded tracking-wider text-xs shadow-lg active:scale-95 hover:bg-gray-900 transition-all">Apply Filters</button>
                </div>
            </div>
        );
    };



    return (
        <div className="min-h-screen bg-white font-body selection:bg-[#337ab7] selection:text-white mt-[17px]">
            {/* Top Section - Full Width */}
            <div className="max-w-[1700px] mx-auto px-4 py-2">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.5em] font-bold text-zinc-300 mb-1 px-1">
                    <Link to="/" className="hover:text-[#337ab7] transition-colors">Home</Link>
                    <span className="opacity-20">/</span>
                    <Link to="/shop" className="hover:text-[#337ab7] transition-colors text-zinc-400">Categories</Link>
                    {selectedCategory !== 'All' && (
                        <React.Fragment>
                            <span className="opacity-20">/</span>
                            <Link to={`/shop?category=${selectedCategory}`} className="hover:text-[#337ab7] transition-colors text-[#337ab7]/60 tracking-[0.2em]">{selectedCategory}</Link>
                        </React.Fragment>
                    )}
                    {selectedSubCategory && (
                        <React.Fragment>
                            <span className="opacity-20">/</span>
                            <Link to={`/shop?category=${selectedCategory}&subcategory=${selectedSubCategory}`} className="hover:text-[#337ab7] transition-colors text-[#337ab7] tracking-[0.25em] font-black">{selectedSubCategory}</Link>
                        </React.Fragment>
                    )}
                </div>

                {/* Title and Count */}
                <div className="flex items-baseline gap-4 mb-2">
                    <h1 className="text-2xl font-medium uppercase text-[#337ab7]" style={{ fontFamily: 'Arial, sans-serif' }}>{pageTitle}</h1>
                    <span className="text-xs text-gray-500">{filteredProducts.length} Designs</span>
                </div>

                {/* Pink Bar (Options) */}
                <div className="bg-[#fff0f2] p-2 flex items-center justify-between gap-4 mb-2 text-xs overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="flex gap-2 shrink-0">
                        <button className="bg-[#337ab7] text-white px-3 py-1 rounded-sm uppercase text-[10px] shrink-0">All</button>
                        <button className="bg-white text-gray-700 px-3 py-1 rounded-sm border border-gray-200 uppercase text-[10px] shrink-0">Designs in Store</button>
                    </div>
                    <div className="flex gap-2 items-center shrink-0">
                        <button 
                            onClick={() => {
                                const pincode = prompt("Enter your Pincode:");
                                if (pincode) {
                                    alert(`Pincode set to ${pincode}`);
                                }
                            }}
                            className="bg-[#337ab7] text-white px-3 py-1 rounded-sm text-[10px] flex items-center gap-1 shrink-0"
                        >
                            <span className="icon">📍</span> Pincode
                        </button>
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-sm px-2 py-0.5 shrink-0">
                            <span className="text-[9px] font-bold uppercase text-gray-400 whitespace-nowrap">Sort By:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent border-none text-[10px] font-bold uppercase text-[#337ab7] focus:ring-0 cursor-pointer p-0 min-w-[75px]"
                            >
                                {["WHAT'S NEW", "POPULAR", "PRICE LOW TO HIGH", "PRICE HIGH TO LOW", "DISCOUNT"].map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        {/* Mobile Filter Button */}
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="lg:hidden w-8 h-8 rounded-sm border border-gray-200 flex items-center justify-center bg-white text-[#337ab7] shadow-sm active:scale-95 transition-all shrink-0"
                        >
                            <SlidersHorizontal className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Section - Split */}
            <div className="flex max-w-[1700px] mx-auto h-[calc(100vh-140px)] overflow-hidden">
                <aside className="hidden lg:block w-[220px] shrink-0 border-r border-zinc-100 h-full flex flex-col bg-white shadow-sm">{SidebarContent()}</aside>
                <main className="flex-grow min-w-0 bg-[#fdf2f8]/5 h-full overflow-y-auto" data-lenis-prevent>
                    <div className="pt-2 pb-4 px-2 md:p-4 lg:px-4 lg:pt-0 lg:pb-6">

                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3 gap-y-3 md:gap-y-4 pb-40">
                                {filteredProducts.map((product, idx) => (
                                    <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: (idx % 5) * 0.08, ease: "easeOut" }}><ProductCard product={product} /></motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-40 text-center bg-white rounded-[4rem] border border-zinc-50 mx-2 shadow-sm">
                                <div className="w-24 h-24 bg-[#eef6fc]/50 rounded-full flex items-center justify-center mb-8">
                                    <Search className="w-10 h-10 text-[#337ab7]/30" />
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
                                    className="bg-[#337ab7] text-white px-10 py-5 rounded-full font-bold uppercase tracking-[0.4em] text-[10px] shadow-2xl transition-all"
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
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 45, stiffness: 600 }} className="fixed top-0 right-0 h-full w-[80%] max-w-[360px] bg-white z-[220] shadow-[0_0_120px_rgba(0,0,0,0.7)] overflow-hidden">{SidebarContent()}<div className="absolute top-6 right-6 z-[70]"><button onClick={() => setIsFilterOpen(false)} className="w-11 h-11 bg-zinc-50 border border-zinc-100 hover:bg-[#337ab7] hover:text-white rounded-full flex items-center justify-center transition-all shadow-lg group"><X className="w-4.5 h-4.5 group-hover:rotate-90 transition-transform" /></button></div></motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Shop;
