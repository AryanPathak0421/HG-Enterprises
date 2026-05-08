import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Store, Menu, X, Bell, ChevronDown, ChevronRight, Home } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import hgLogo from '../assets/hg_logo_gold.png';
import hgLogoPremium from '../assets/logo_final.jpg';
import { motion, AnimatePresence } from 'framer-motion';

// Premium menu banners and fallbacks
import proposalBanner from '../assets/proposal_banner.png';
import bridalBanner from '../assets/bridal.png';
import customRings from '../assets/cat_rings_custom.png';
import latestEarrings from '../assets/latest_drop_earrings.png';
import latestNecklace from '../assets/latest_drop_necklace.png';
import latestBracelet from '../assets/latest_drop_bracelet.png';
import catNecklacesEmerald from '../assets/cat_necklaces_emerald.jpg';

// Helper lists for premium multi-column navigation menu
const getPopularTypes = (hoveredSubCat) => {
    const cat = hoveredSubCat?.toLowerCase();
    if (cat === 'rings' || cat === 'ring') {
        return ['Engagement', 'Diamond', 'Couple Bands', 'Plain Gold', 'Office Wear', 'Gemstone', 'Solitaire', 'Cocktail', 'Slider', 'Religious', 'Multi-finger', 'Platinum Bands', 'Navaratna', 'For Men', 'Pearl', 'For Gift'];
    } else if (cat === 'earrings') {
        return ['Studs', 'Jhumkas', 'Drops', 'Hoops', 'Sui Dhaga', 'Chandbali', 'Climbers', 'Ear Cuffs'];
    } else if (cat === 'necklaces' || cat === 'necklace') {
        return ['Choker', 'Kundan', 'Lariat', 'Collar', 'Temple', 'Oxidized', 'Gold Chain', 'Diamond Necklace'];
    } else if (cat === 'pendants' || cat === 'pendant') {
        return ['Solitaire Pendants', 'Heart Pendants', 'Religious Pendants', 'Gemstone Pendants', 'Alphabet Pendants'];
    } else if (cat === 'bracelets' || cat === 'bracelet' || cat === 'bangles' || cat === 'bangle') {
        return ['Gold Bangles', 'Diamond Bracelets', 'Kada', 'Charm Bracelets', 'Tennis Bracelets'];
    } else if (cat === 'mangalsutra') {
        return ['Modern Mangalsutra', 'Traditional Mangalsutra', 'Diamond Mangalsutra', 'Gemstone Mangalsutra'];
    } else if (cat === 'hand tools' || cat === 'jewellery-tools' || cat === 'tools' || cat === 'measurement' || cat === 'cutting' || cat === 'polishing') {
        return ['High Precision', 'Industrial', 'Professional', 'Digital Calipers', 'Eye Loupes', 'Tweezers', 'Diamond Testers', 'Micro Soldering', 'Hand Engravers', 'Cast Iron Vices', 'Pliers Set', 'Precision Files', 'Jewelry Hammers', 'Bench Pins'];
    } else if (cat === 'laser machines' || cat === 'laser-machines' || cat === 'machines' || cat === 'cleaning' || cat === 'casting' || cat === 'laser') {
        return ['Automated Systems', 'High Output', 'Laboratory Grade', 'Pulse Laser', 'Fiber Laser', 'Vacuum Casting', 'Micro Arc Welder', 'Magnetic Polishers', 'Steam Cleaners', 'Gold Refining Systems'];
    }
    return ['All Collections', 'Best Sellers', 'New Launches'];
};

const getPriceRanges = (hoveredSubCat) => {
    const cat = hoveredSubCat?.toLowerCase();
    if (cat === 'rings' || cat === 'ring' || cat === 'earrings' || cat === 'necklaces' || cat === 'necklace' || cat === 'pendants' || cat === 'pendant' || cat === 'bracelets' || cat === 'bracelet' || cat === 'mangalsutra') {
        return [
            { label: 'Below 10,000', min: 0, max: 10000 },
            { label: 'Between 10k - 20k', min: 10000, max: 20000 },
            { label: 'Between 20k - 30k', min: 20000, max: 30000 },
            { label: 'Between 30k - 40k', min: 30000, max: 40000 },
            { label: 'Between 40k - 50k', min: 40000, max: 50000 },
            { label: '50,000 & above', min: 50000, max: 1000000 }
        ];
    } else if (cat === 'hand tools' || cat === 'jewellery-tools' || cat === 'tools' || cat === 'measurement' || cat === 'cutting' || cat === 'polishing') {
        return [
            { label: 'Below 1,000', min: 0, max: 1000 },
            { label: 'Between 1k - 5k', min: 1000, max: 5000 },
            { label: 'Between 5k - 10k', min: 5000, max: 10000 },
            { label: 'Between 10k - 25k', min: 10000, max: 25000 },
            { label: '25,000 & above', min: 25000, max: 500000 }
        ];
    } else {
        return [
            { label: 'Below 15,000', min: 0, max: 15000 },
            { label: 'Between 15k - 50k', min: 15000, max: 50000 },
            { label: 'Between 50k - 1.5 Lakh', min: 50000, max: 150000 },
            { label: '1.5 Lakh & above', min: 150000, max: 5000000 }
        ];
    }
};

const getMetalsAndStones = (hoveredSubCat) => {
    const cat = hoveredSubCat?.toLowerCase();
    if (cat === 'rings' || cat === 'ring' || cat === 'earrings' || cat === 'necklaces' || cat === 'necklace' || cat === 'pendants' || cat === 'pendant' || cat === 'bracelets' || cat === 'bracelet' || cat === 'mangalsutra') {
        if (cat === 'rings' || cat === 'ring') {
            return [
                { label: 'Diamond Rings', metal: 'Diamond', starting: 'Rs. 7,400/-' },
                { label: 'Gold Rings', metal: 'Gold', starting: 'Rs. 6,300/-' },
                { label: 'White Gold Rings', metal: 'White Gold', starting: 'Rs. 8,900/-' },
                { label: 'Rose Gold Rings', metal: 'Rose Gold', starting: 'Rs. 10,000/-' },
                { label: 'Platinum Rings', metal: 'Platinum', starting: 'Rs. 23,200/-' },
                { label: 'Buy Solitaire Rings', metal: 'Solitaire', starting: 'Rs. 30,000/-' }
            ];
        } else if (cat === 'necklaces' || cat === 'necklace') {
            return [
                { label: 'Diamond Necklaces', metal: 'Diamond', starting: 'Rs. 45,000/-' },
                { label: 'Gold Necklaces', metal: 'Gold', starting: 'Rs. 25,000/-' },
                { label: 'Kundan Choker Sets', metal: 'Kundan', starting: 'Rs. 55,000/-' },
                { label: 'Platinum Necklaces', metal: 'Platinum', starting: 'Rs. 65,000/-' }
            ];
        }
        return [
            { label: 'Diamond Creations', metal: 'Diamond', starting: 'Rs. 12,000/-' },
            { label: 'Gold Classics', metal: 'Gold', starting: 'Rs. 6,300/-' },
            { label: 'White Gold Masterpieces', metal: 'White Gold', starting: 'Rs. 8,900/-' },
            { label: 'Rose Gold Charms', metal: 'Rose Gold', starting: 'Rs. 10,000/-' },
            { label: 'Platinum Collection', metal: 'Platinum', starting: 'Rs. 23,200/-' },
            { label: 'Buy Solitaire Specials', metal: 'Solitaire', starting: 'Rs. 30,000/-' }
        ];
    } else if (cat === 'hand tools' || cat === 'jewellery-tools' || cat === 'tools' || cat === 'measurement' || cat === 'cutting' || cat === 'polishing') {
        return [
            { label: 'Stainless Steel Tools', metal: 'Stainless Steel', starting: 'Rs. 950/-' },
            { label: 'Hardened Carbon Steel', metal: 'Hardened Carbon', starting: 'Rs. 1,500/-' },
            { label: 'Optical Grade Loupes', metal: 'Optical Grade', starting: 'Rs. 2,200/-' },
            { label: 'Tungsten Carbide Cutters', metal: 'Tungsten Carbide', starting: 'Rs. 3,500/-' }
        ];
    } else {
        return [
            { label: 'Ultrasonic Cleaners', metal: 'Ultrasonic', starting: 'Rs. 12,000/-' },
            { label: 'Hydraulic Casting Presses', metal: 'Hydraulic', starting: 'Rs. 85,000/-' },
            { label: 'Fiber Laser engravers', metal: 'Fiber Laser', starting: 'Rs. 1,50,000/-' },
            { label: 'Induction Casting Units', metal: 'Induction', starting: 'Rs. 95,000/-' }
        ];
    }
};

const getCollectionImage = (hoveredSubCat) => {
    const cat = hoveredSubCat?.toLowerCase();
    if (cat === 'rings' || cat === 'ring') return proposalBanner || customRings;
    if (cat === 'earrings') return latestEarrings;
    if (cat === 'necklaces' || cat === 'necklace') return catNecklacesEmerald || latestNecklace;
    if (cat === 'bracelets' || cat === 'bracelet') return latestBracelet;
    if (cat === 'hand tools' || cat === 'jewellery-tools' || cat === 'tools' || cat === 'measurement' || cat === 'cutting' || cat === 'polishing') {
        return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400';
    }
    if (cat === 'laser machines' || cat === 'laser-machines' || cat === 'machines' || cat === 'cleaning' || cat === 'casting' || cat === 'laser') {
        return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400';
    }
    return bridalBanner;
};

const getCollectionTitle = (hoveredSubCat) => {
    const cat = hoveredSubCat?.toLowerCase();
    if (cat === 'rings' || cat === 'ring') return 'Liviana - Stacks of Love';
    if (cat === 'earrings') return 'Daily Glam - Delicate Studs';
    if (cat === 'necklaces' || cat === 'necklace') return 'Emerald Heritage - Royal Sets';
    if (cat === 'bracelets' || cat === 'bracelet') return 'Modern Wrists - Elegant Kadas';
    if (cat === 'hand tools' || cat === 'jewellery-tools' || cat === 'tools' || cat === 'measurement' || cat === 'cutting' || cat === 'polishing') {
        return 'HG Precision Tools - Handcrafted';
    }
    if (cat === 'laser machines' || cat === 'laser-machines' || cat === 'machines' || cat === 'cleaning' || cat === 'casting' || cat === 'laser') {
        return 'Smart Wax Printer - Next-Gen';
    }
    return 'Bridal Heritage - Complete Sets';
};

const Navbar = () => {
    const { cart, wishlist, user, userNotifications, isMenuOpen, toggleMenu, isSearchOpen, toggleSearch, categories, settings, products } = useShop();
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';

    // Sidebar Menu Data
    const sidebarMenu = {
        mainCategories: [
            { name: "Jewellery", path: "/category/jewellery" },
            { name: "Machine", path: "/category/machine" },
            { name: "Tools", path: "/category/tools" },
            { name: "Shop All", path: "/shop" }
        ],
        support: (settings?.navbarLinks && settings.navbarLinks.length > 0) ? settings.navbarLinks : [
            { name: "Offers", path: "/offers" },
            { name: "Track Order", path: "/profile/orders" },
            { name: "About Us", path: "/about" },
            { name: "Contact Us", path: "/help" },
            { name: "Blog", path: "/blogs" }
        ]
    };

    const [openSection, setOpenSection] = useState('mainCategories');
    const [activeMegaCategory, setActiveMegaCategory] = useState(categories[0]);
    const [hoveredSubCat, setHoveredSubCat] = useState('Rings');
    const [isMegaOpen, setIsMegaOpen] = useState(false);
    const [activeSidebarDept, setActiveSidebarDept] = useState(null);

    // Sync activeMegaCategory when categories load from the API
    useEffect(() => {
        if (categories.length > 0 && !activeMegaCategory) {
            setActiveMegaCategory(categories[0]);
        }
    }, [categories]);

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <>
            <div className="w-full bg-white z-[100] relative">
                {/* 1. Top Utility Header - Even more compact */}
                <div className="hidden md:block bg-gray-50/50 border-b border-gray-100 py-1">
                    <div className="container mx-auto px-6 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <div className="flex items-center gap-6">
                            <Link to="/help" className="flex items-center gap-1.5 hover:text-primary cursor-pointer transition-colors">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                                Easy Returns & Refunds
                            </Link>
                        </div>
                        <div className="flex items-center gap-6 divide-x divide-gray-200">
                            <Link to="/profile" className="flex items-center gap-1.5 hover:text-primary cursor-pointer transition-colors px-4 group">
                                <Bell className="w-3 h-3 group-hover:scale-110 transition-transform" />
                                <span>Notifications</span>
                            </Link>
                            <Link to="/about" className="flex items-center gap-1.5 hover:text-primary cursor-pointer transition-colors px-4 group">
                                <Store className="w-3 h-3 group-hover:scale-110 transition-transform" />
                                <span>Find A Store</span>
                            </Link>
                            <div className="flex items-center gap-4 pl-4 lowercase">
                                <Link to="/login" className="hover:text-primary transition-colors hover:underline">Login</Link>
                                <span className="text-gray-200">|</span>
                                <Link to="/signup" className="hover:text-primary transition-colors hover:underline">Signup</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Main Navigation Bar - Balanced Compactness */}
                <nav className="w-full bg-black border-b border-white/10 shadow-sm sticky top-0 md:relative z-50">
                    <div className="w-full flex items-center justify-between h-10 md:h-12 px-4 md:px-8">

                        {/* Logo & Brand Heading - Refined Placement */}
                        <Link to="/" className="flex items-center group flex-shrink-0 gap-2 md:gap-4">
                            <motion.div
                                animate={{
                                    y: [0, -2, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="relative bg-black"
                            >
                                <img
                                    src={hgLogoPremium}
                                    alt="HG"
                                    className="h-[32px] md:h-[48px] w-auto object-contain"
                                />
                            </motion.div>

                            <div className="flex flex-col">
                                <span className="text-white font-serif text-[12px] md:text-lg font-light tracking-wider leading-none group-hover:text-[#EBCDD0] transition-colors">
                                    Harshad Gauri
                                </span>
                                <span className="text-[#FDF5F6]/80 font-serif italic text-[7px] md:text-[9px] tracking-[0.25em] pb-1 transition-colors group-hover:text-white">
                                    enterprises
                                </span>
                            </div>
                        </Link>

                        {/* Centered Search Bar */}
                        <div className="hidden lg:flex flex-1 max-w-xl relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-3.5 w-3.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search for jewellery..."
                                className="w-full bg-white border border-gray-100 rounded-full py-2 px-5 pl-10 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-black placeholder-gray-400 shadow-sm"
                            />
                        </div>

                        {/* Icons */}
                        <div className="flex items-center gap-1 md:gap-4">
                            {/* Mobile/Tablet Search Toggle */}
                            <button
                                onClick={() => toggleSearch(!isSearchOpen)}
                                aria-label="Toggle search"
                                className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 group transition-colors"
                            >
                                <Search className={`w-5 h-5 transition-colors ${isSearchOpen ? 'text-white' : 'text-white/90 group-hover:text-primary'}`} />
                            </button>

                            <Link to="/notifications" aria-label="View notifications" className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full hover:bg-white/10 relative group transition-colors">
                                <Bell className="w-4.5 h-4.5 md:w-5 md:h-5 text-white/90 group-hover:text-primary transition-colors" />
                                <span className="absolute top-2 right-2 w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full border-2 border-black"></span>
                            </Link>

                            <Link to="/wishlist" aria-label="View wishlist" className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full hover:bg-white/10 relative group transition-colors">
                                <Heart className="w-4.5 h-4.5 md:w-5 md:h-5 text-white/90 group-hover:text-primary transition-colors" />
                                {wishlist?.length > 0 && (
                                    <span className="absolute top-2 right-2 bg-primary text-white text-[7px] md:text-[8px] w-3 h-3 md:w-3.5 md:h-3.5 flex items-center justify-center rounded-full font-bold">
                                        {wishlist.length}
                                    </span>
                                )}
                            </Link>

                            <Link to="/cart" aria-label="View shopping bag" className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center hover:bg-white/10 rounded-full group transition-colors relative">
                                <ShoppingBag className="w-4.5 h-4.5 md:w-5 md:h-5 text-white/90 group-hover:text-primary transition-colors" />
                                {cart?.length > 0 && (
                                    <span className="absolute top-2 right-2 bg-primary text-white text-[7px] md:text-[8px] w-3 h-3 md:w-3.5 md:h-3.5 flex items-center justify-center rounded-full font-bold">
                                        {cart.length}
                                    </span>
                                )}
                            </Link>

                            <Link to="/profile" aria-label="View profile" className="hidden md:flex w-10 h-10 items-center justify-center rounded-full hover:bg-white/10 group transition-colors">
                                <User className="w-5 h-5 text-white/90 group-hover:text-primary transition-colors" />
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Search Bar Expansion */}
                    <AnimatePresence>
                        {isSearchOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="lg:hidden bg-[#1A1A1A] border-t border-white/5 overflow-hidden"
                            >
                                <div className="px-6 py-4">
                                    <div className="relative group/search">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Search className="h-4 w-4 text-gray-500 group-focus-within/search:text-primary transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="What are you looking for?"
                                            className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 pl-12 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40 transition-all text-white placeholder-gray-500"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    toggleSearch(false);
                                                    // Navigate to shop with search
                                                    window.location.href = `/shop?search=${e.target.value}`;
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* 3. Secondary Navigation Links Row - Ultra Compact & Clean */}
                    <div className="hidden md:block bg-white border-t border-gray-100 py-1 shadow-sm relative">
                        <div className="container mx-auto px-6 flex justify-center items-center gap-10">
                            <Link to="/" className="text-[10px] font-serif font-bold text-black hover:text-primary transition-all tracking-[0.3em] uppercase border-b-2 border-transparent hover:border-primary pb-0.5">
                                Home
                            </Link>

                            {/* Categories Interaction - Two-Step Mega Menu */}
                            <div
                                onMouseEnter={() => setIsMegaOpen(true)}
                                onMouseLeave={() => setIsMegaOpen(false)}
                            >
                                <button
                                    aria-label="Open categories menu"
                                    onClick={() => setIsMegaOpen(!isMegaOpen)}
                                    className="flex items-center gap-1 text-[11px] font-serif font-bold text-black hover:text-primary transition-all tracking-[0.3em] uppercase border-b-2 border-transparent hover:border-primary pb-0.5 cursor-pointer"
                                >
                                    Categories
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMegaOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <div className={`absolute left-0 w-full top-full transition-all duration-500 z-[100] bg-gradient-to-r from-[#FFF5F6] via-[#FFF9FA] to-[#FFF0F3] border-b border-pink-100 shadow-2xl ${isMegaOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                                    <div className="flex flex-col min-h-[260px] w-full">

                                        {/* Step 1: Main Category Selection Bar - Grouped by Department */}
                                        <div className="bg-pink-100/20 border-b border-pink-100/40 px-10 py-2.5 flex justify-center gap-16">
                                            {['Jewellery', 'Tools', 'Machines'].map((dept) => (
                                                <button
                                                    key={dept}
                                                    onMouseEnter={() => {
                                                        const firstInDept = categories.find(c => (c.department || 'Jewellery').toLowerCase() === dept.toLowerCase());
                                                        if (firstInDept) {
                                                            setActiveMegaCategory(firstInDept);
                                                            setHoveredSubCat(firstInDept.name);
                                                        }
                                                    }}
                                                    aria-label={`View ${dept} department`}
                                                    className={`text-[11px] font-serif font-bold tracking-[0.25em] uppercase transition-all pb-1 border-b-2 ${(activeMegaCategory?.department || 'Jewellery').toLowerCase() === dept.toLowerCase() ? 'text-primary border-primary' : 'text-gray-400 border-transparent hover:text-black'}`}
                                                >
                                                    {dept}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="flex-1 w-full mx-auto bg-transparent">
                                            <AnimatePresence mode="popLayout">
                                                <motion.div
                                                    key={activeMegaCategory?.id || activeMegaCategory?._id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="w-full"
                                                >
                                                     <div className="flex w-full bg-transparent min-h-[350px] p-6 text-black font-sans">
                                                         {/* Left Sub-Sidebar: main categories with micro-indicators */}
                                                         <div className="w-[20%] border-r border-pink-100/60 pr-6 flex flex-col gap-2">
                                                             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Category Selection</h3>
                                                             {categories
                                                                 .filter(c => (c.department || 'Jewellery').toLowerCase() === (activeMegaCategory?.department || 'Jewellery').toLowerCase())
                                                                 .map((cat) => (
                                                                     <button
                                                                         key={cat.id || cat._id}
                                                                         onMouseEnter={() => setHoveredSubCat(cat.name)}
                                                                         onClick={() => {
                                                                             setIsMegaOpen(false);
                                                                             navigate(`/collection/${cat.id || cat.name.toLowerCase()}`);
                                                                         }}
                                                                         className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-300 flex items-center justify-between text-xs font-serif font-semibold tracking-wider ${hoveredSubCat?.toLowerCase() === cat.name?.toLowerCase() ? 'bg-pink-100/50 text-primary pl-4' : 'text-gray-700 hover:bg-pink-50/30'}`}
                                                                     >
                                                                         <span className="uppercase">{cat.name}</span>
                                                                         <ChevronRight className={`w-3.5 h-3.5 transition-transform ${hoveredSubCat?.toLowerCase() === cat.name?.toLowerCase() ? 'translate-x-0.5 text-primary' : 'text-gray-300'}`} />
                                                                     </button>
                                                                 ))
                                                             }
                                                         </div>

                                                         {/* Right Columns: Multi-Column layout based on hovered subcategory */}
                                                         <div className="flex-1 pl-8">
                                                             <AnimatePresence mode="wait">
                                                                 <motion.div
                                                                     key={hoveredSubCat}
                                                                     initial={{ opacity: 0, y: 5 }}
                                                                     animate={{ opacity: 1, y: 0 }}
                                                                     exit={{ opacity: 0, y: -5 }}
                                                                     transition={{ duration: 0.2 }}
                                                                     className="grid grid-cols-4 gap-8 h-full"
                                                                 >
                                                                     {/* Column 1: Popular Types */}
                                                                     <div>
                                                                         <h4 className="text-[11px] font-serif font-black uppercase tracking-[0.2em] text-primary mb-4 pb-2 border-b border-pink-100">
                                                                             Popular {hoveredSubCat} Types
                                                                         </h4>
                                                                         <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                                                                             {getPopularTypes(hoveredSubCat).map((type, idx) => (
                                                                                 <Link
                                                                                     key={idx}
                                                                                     to={`/shop?category=${hoveredSubCat}&subcategory=${type}`}
                                                                                     onClick={() => setIsMegaOpen(false)}
                                                                                     className="text-[11px] text-gray-600 hover:text-primary hover:underline transition-colors leading-relaxed"
                                                                                 >
                                                                                     {type}
                                                                                 </Link>
                                                                             ))}
                                                                         </div>
                                                                         {hoveredSubCat?.toLowerCase() === 'rings' && (
                                                                             <div className="mt-6">
                                                                                 <Link
                                                                                     to="/shop?category=RINGS"
                                                                                     onClick={() => setIsMegaOpen(false)}
                                                                                     className="inline-block border border-black text-black hover:bg-black hover:text-white px-4 py-2 font-serif text-[10px] font-bold uppercase tracking-wider transition-all"
                                                                                 >
                                                                                     VIEW ALL {products?.filter(p => p.category?.toLowerCase() === 'rings').length || '2303'} RING DESIGNS
                                                                                 </Link>
                                                                             </div>
                                                                         )}
                                                                         {(hoveredSubCat?.toLowerCase() === 'hand tools' || hoveredSubCat?.toLowerCase() === 'jewellery-tools' || hoveredSubCat?.toLowerCase() === 'tools') && (
                                                                             <div className="mt-6">
                                                                                 <Link
                                                                                     to="/shop?category=Tools"
                                                                                     onClick={() => setIsMegaOpen(false)}
                                                                                     className="inline-block border border-black text-black hover:bg-black hover:text-white px-4 py-2 font-serif text-[10px] font-bold uppercase tracking-wider transition-all"
                                                                                 >
                                                                                     VIEW ALL PRECISION TOOLS
                                                                                 </Link>
                                                                             </div>
                                                                         )}
                                                                         {(hoveredSubCat?.toLowerCase() === 'laser machines' || hoveredSubCat?.toLowerCase() === 'laser-machines' || hoveredSubCat?.toLowerCase() === 'machines') && (
                                                                             <div className="mt-6">
                                                                                 <Link
                                                                                     to="/shop?category=Machines"
                                                                                     onClick={() => setIsMegaOpen(false)}
                                                                                     className="inline-block border border-black text-black hover:bg-black hover:text-white px-4 py-2 font-serif text-[10px] font-bold uppercase tracking-wider transition-all"
                                                                                 >
                                                                                     VIEW ALL SMART MACHINES
                                                                                 </Link>
                                                                             </div>
                                                                         )}
                                                                     </div>

                                                                     {/* Column 2: Price Range */}
                                                                     <div>
                                                                         <h4 className="text-[11px] font-serif font-black uppercase tracking-[0.2em] text-primary mb-4 pb-2 border-b border-pink-100">
                                                                             By Price Range
                                                                         </h4>
                                                                         <div className="flex flex-col gap-2.5">
                                                                             {getPriceRanges(hoveredSubCat).map((range, idx) => (
                                                                                 <Link
                                                                                     key={idx}
                                                                                     to={`/shop?category=${hoveredSubCat}&minPrice=${range.min}&maxPrice=${range.max}`}
                                                                                     onClick={() => setIsMegaOpen(false)}
                                                                                     className="text-[11px] text-gray-600 hover:text-primary hover:underline transition-colors leading-relaxed"
                                                                                 >
                                                                                     {range.label}
                                                                                 </Link>
                                                                             ))}
                                                                         </div>
                                                                     </div>

                                                                     {/* Column 3: Metals & Stones / Materials & Tech */}
                                                                     <div>
                                                                         <h4 className="text-[11px] font-serif font-black uppercase tracking-[0.2em] text-primary mb-4 pb-2 border-b border-pink-100">
                                                                             By Build & Tech
                                                                         </h4>
                                                                         <div className="flex flex-col gap-3">
                                                                             {getMetalsAndStones(hoveredSubCat).map((item, idx) => (
                                                                                 <Link
                                                                                     key={idx}
                                                                                     to={`/shop?category=${hoveredSubCat}&metal=${item.metal}`}
                                                                                     onClick={() => setIsMegaOpen(false)}
                                                                                     className="group flex flex-col gap-0.5"
                                                                                 >
                                                                                     <span className="text-[11px] font-semibold text-gray-800 group-hover:text-primary transition-colors">
                                                                                         {item.label}
                                                                                     </span>
                                                                                     {item.starting && (
                                                                                         <span className="text-[9px] text-gray-400 group-hover:text-primary/70 italic transition-colors">
                                                                                             Starting at {item.starting}
                                                                                         </span>
                                                                                     )}
                                                                                 </Link>
                                                                             ))}
                                                                         </div>
                                                                     </div>

                                                                     {/* Column 4: Browse Collections */}
                                                                     <div className="flex flex-col justify-between">
                                                                         <div>
                                                                             <div className="flex justify-between items-center mb-4 pb-2 border-b border-pink-100">
                                                                                 <h4 className="text-[11px] font-serif font-black uppercase tracking-[0.2em] text-primary">
                                                                                     Browse Collections
                                                                                 </h4>
                                                                                 <Link
                                                                                     to={`/shop?category=${hoveredSubCat}`}
                                                                                     onClick={() => setIsMegaOpen(false)}
                                                                                     className="text-[9px] font-bold text-primary hover:underline uppercase tracking-wider"
                                                                                 >
                                                                                     View All &gt;&gt;
                                                                                 </Link>
                                                                             </div>
                                                                             <div className="relative aspect-[1.5] rounded-xl overflow-hidden shadow-md group/banner border border-pink-100">
                                                                                 <img
                                                                                     src={getCollectionImage(hoveredSubCat)}
                                                                                     alt="Collection Banner"
                                                                                     className="w-full h-full object-cover transform transition-transform duration-700 group-hover/banner:scale-110"
                                                                                     crossOrigin="anonymous"
                                                                                 />
                                                                                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                                                                                     <span className="text-[9px] font-bold text-primary tracking-widest uppercase mb-0.5">Featured Edit</span>
                                                                                     <h5 className="text-white font-serif italic text-base leading-tight">
                                                                                         {getCollectionTitle(hoveredSubCat)}
                                                                                     </h5>
                                                                                 </div>
                                                                             </div>
                                                                         </div>
                                                                     </div>
                                                                 </motion.div>
                                                             </AnimatePresence>
                                                         </div>
                                                     </div>
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {((settings?.navbarLinks && settings.navbarLinks.length > 0) ? settings.navbarLinks : [
                                { name: "ABOUT", path: "/about" },
                                { name: "BLOG", path: "/blogs" },
                                { name: "OFFERS", path: "/offers" },
                                { name: "SHOP", path: "/shop" },
                                { name: "CONTACT US", path: "/help" },
                                { name: "TRACK ORDER", path: "/profile/orders" }
                            ]).map((nav, idx) => (
                                <Link
                                    key={idx}
                                    to={nav.path}
                                    aria-label={`Go to ${nav.name}`}
                                    className="text-[10px] font-serif font-bold text-black hover:text-primary transition-all tracking-[0.3em] uppercase border-b-2 border-transparent hover:border-primary pb-0.5"
                                >
                                    {nav.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </nav>
            </div>

            {/* Sidebar / Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => toggleMenu(false)}
                            className="fixed inset-0 bg-black/40 z-[110] backdrop-blur-[2px]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                            className="fixed top-0 right-0 h-full w-[320px] bg-white z-[120] shadow-2xl overflow-hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                                <span className="font-display text-sm font-black tracking-widest text-black uppercase">Main Menu</span>
                                <button aria-label="Close menu" onClick={() => toggleMenu(false)} className="p-2 hover:bg-white rounded-full transition-all hover:rotate-90">
                                    <X className="w-5 h-5 text-black" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                <div className="space-y-1">
                                    {sidebarMenu.mainCategories.map((item, idx) => {
                                        const isDept = ['jewellery', 'machine', 'tools'].includes(item.name.toLowerCase());
                                        const isOpen = activeSidebarDept?.toLowerCase() === item.name.toLowerCase();
                                        
                                        // Find categories matching this department
                                        const deptCats = categories.filter(c => {
                                            const deptName = item.name === 'Machine' ? 'machines' : item.name.toLowerCase();
                                            return (c.department || 'Jewellery').toLowerCase() === deptName;
                                        });

                                        if (isDept) {
                                            return (
                                                <div key={idx} className="border-b border-pink-50/10 last:border-0">
                                                    <button
                                                        onClick={() => setActiveSidebarDept(isOpen ? null : item.name)}
                                                        className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-pink-50/20 group transition-all"
                                                    >
                                                        <span className={`font-serif text-sm uppercase tracking-widest transition-all ${isOpen ? 'text-primary font-bold' : 'text-gray-800 group-hover:text-primary'}`}>
                                                            {item.name}
                                                        </span>
                                                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'text-gray-300 group-hover:text-primary'}`} />
                                                    </button>
                                                    
                                                    <AnimatePresence initial={false}>
                                                        {isOpen && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                                className="overflow-hidden bg-pink-50/5 pl-6 pr-4 pb-3"
                                                            >
                                                                <div className="flex flex-col gap-1 py-1 border-l-2 border-pink-200/40 pl-4">
                                                                    {deptCats.map((cat) => (
                                                                        <button
                                                                            key={cat.id || cat._id}
                                                                            onClick={() => {
                                                                                toggleMenu(false);
                                                                                navigate(`/collection/${cat.id || cat.name.toLowerCase()}`);
                                                                            }}
                                                                            className="w-full text-left py-2 px-3 rounded-lg hover:bg-pink-100/10 text-xs font-serif font-medium tracking-wider text-gray-700 hover:text-primary transition-all uppercase"
                                                                        >
                                                                            {cat.name}
                                                                        </button>
                                                                    ))}
                                                                    <button
                                                                        onClick={() => {
                                                                            toggleMenu(false);
                                                                            navigate(item.path);
                                                                        }}
                                                                        className="w-full text-left py-2 px-3 rounded-lg hover:bg-pink-100/20 text-[9px] font-sans font-bold tracking-widest text-primary transition-all uppercase mt-2 border border-dashed border-pink-200/40 text-center"
                                                                    >
                                                                        View All {item.name}
                                                                    </button>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        }

                                        // Fallback for non-department items (like Shop All)
                                        return (
                                            <Link
                                                key={idx}
                                                to={item.path}
                                                aria-label={`Go to ${item.name}`}
                                                onClick={() => toggleMenu(false)}
                                                className="flex items-center justify-between p-4 rounded-xl hover:bg-pink-50/20 group transition-all"
                                            >
                                                <span className="font-serif text-sm uppercase tracking-widest text-gray-800 group-hover:text-primary transition-all">
                                                    {item.name}
                                                </span>
                                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                            </Link>
                                        );
                                    })}
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100 space-y-1.5 px-4">
                                    {sidebarMenu.support.map((item, idx) => (
                                        <Link
                                            key={idx}
                                            to={item.path}
                                            aria-label={`Go to ${item.name}`}
                                            onClick={() => toggleMenu(false)}
                                            className="block text-[11px] font-serif font-bold uppercase tracking-widest text-gray-700 hover:text-primary hover:translate-x-1.5 transition-all duration-300 py-1.5"
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 border-t border-gray-100">
                                <Link
                                    to="/login"
                                    aria-label="Proceed to login"
                                    onClick={() => toggleMenu(false)}
                                    className="w-full bg-black text-white py-4 rounded-xl font-display font-black text-[10px] uppercase tracking-[0.3em] text-center block hover:bg-primary transition-all shadow-lg"
                                >
                                    Login / Signup
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Bottom Nav (Mobile) */}
            <div className="md:hidden fixed bottom-6 left-6 right-6 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-around z-[100] shadow-[0_10px_30px_rgba(0,0,0,0.1)] px-4">
                <Link to="/" aria-label="Go to home" className="flex flex-col items-center gap-1 group">
                    <Home className="w-5 h-5 text-gray-400 group-active:scale-90 transition-all group-[.active]:text-primary" />
                    <span className="text-[8px] font-bold uppercase tracking-tighter text-gray-400">Home</span>
                </Link>
                <button aria-label="Open mobile menu" onClick={() => toggleMenu(true)} className="flex flex-col items-center gap-1 group">
                    <Menu className="w-5 h-5 text-gray-400 group-active:scale-90 transition-all" />
                    <span className="text-[8px] font-bold uppercase tracking-tighter text-gray-400">Menu</span>
                </button>
                <Link to="/wishlist" aria-label="View wishlist" className="flex flex-col items-center gap-1 group relative">
                    <Heart className="w-5 h-5 text-gray-400 group-active:scale-90 transition-all group-[.active]:text-primary" />
                    {wishlist?.length > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white"></span>}
                    <span className="text-[8px] font-bold uppercase tracking-tighter text-gray-400">Favs</span>
                </Link>
                <Link to="/profile" aria-label="View profile" className="flex flex-col items-center gap-1 group">
                    <User className="w-5 h-5 text-gray-400 group-active:scale-90 transition-all group-[.active]:text-primary" />
                    <span className="text-[8px] font-bold uppercase tracking-tighter text-gray-400">Me</span>
                </Link>
            </div>
        </>
    );
};

export default Navbar;
