import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Store, Menu, X, Bell, ChevronDown, ChevronRight, Home } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import hgLogo from '../assets/hg_logo_gold.png';
import hgLogoPremium from '../assets/logo_final.jpg';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { cart, wishlist, user, userNotifications, isMenuOpen, toggleMenu, isSearchOpen, toggleSearch, categories } = useShop();
    const location = useLocation();
    const isHome = location.pathname === '/';

    // Sidebar Menu Data
    const sidebarMenu = {
        mainCategories: [
            { name: "Jewellery", path: "/category/jewellery" },
            { name: "Machine", path: "/category/machine" },
            { name: "Tools", path: "/category/tools" },
            { name: "Shop All", path: "/shop" }
        ],
        support: [
            { name: "Offers", path: "/offers" },
            { name: "Track Order", path: "/profile/orders" },
            { name: "About Us", path: "/about" },
            { name: "Contact Us", path: "/help" },
            { name: "Blog", path: "/blogs" }
        ]
    };

    const [openSection, setOpenSection] = useState('mainCategories');
    const [activeMegaCategory, setActiveMegaCategory] = useState(categories[0]);

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
                    <div className="w-full flex items-center justify-between h-14 md:h-18 px-4 md:px-10">

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
                                    className="h-[40px] md:h-[60px] w-auto object-contain"
                                />
                            </motion.div>

                            <div className="flex flex-col">
                                <span className="text-white font-serif text-[15px] md:text-xl font-light tracking-wider leading-none group-hover:text-[#EBCDD0] transition-colors">
                                    Harshad Gauri
                                </span>
                                <span className="text-[#FDF5F6]/80 font-serif italic text-[8px] md:text-[11px] tracking-[0.25em] pb-1 transition-colors group-hover:text-white">
                                    enterprises
                                </span>
                            </div>
                        </Link>

                        {/* Centered Search Bar */}
                        <div className="hidden lg:flex flex-1 max-w-xl relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search for jewellery..."
                                className="w-full bg-white border border-gray-100 rounded-full py-2.5 px-6 pl-12 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-black placeholder-gray-400 shadow-sm"
                            />
                        </div>

                        {/* Icons */}
                        <div className="flex items-center gap-1.5 md:gap-5">
                            {/* Mobile/Tablet Search Toggle */}
                            <button
                                onClick={() => toggleSearch(!isSearchOpen)}
                                aria-label="Toggle search"
                                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 group transition-colors"
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
                    <div className="hidden md:block bg-white border-t border-gray-100 py-1.5 shadow-sm">
                        <div className="container mx-auto px-6 flex justify-center items-center gap-10">
                            <Link to="/" className="text-[11px] font-serif font-bold text-black hover:text-primary transition-all tracking-[0.3em] uppercase border-b-2 border-transparent hover:border-primary pb-0.5">
                                Home
                            </Link>

                            {/* Categories Interaction - Two-Step Mega Menu */}
                            <div className="relative group/mega">
                                <button aria-label="Open categories menu" className="flex items-center gap-1 text-[11px] font-serif font-bold text-black hover:text-primary transition-all tracking-[0.3em] uppercase border-b-2 border-transparent hover:border-primary pb-0.5 cursor-pointer">
                                    Categories
                                    <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover/mega:rotate-180" />
                                </button>

                                <div className="fixed left-0 w-screen top-[110px] md:top-[128px] opacity-0 invisible group-hover/mega:opacity-100 group-hover/mega:visible transition-all duration-500 z-[100] bg-white border-b border-gray-100 shadow-2xl">
                                    <div className="flex flex-col min-h-[380px] w-full">

                                        {/* Step 1: Main Category Selection Bar - Grouped by Department */}
                                        <div className="bg-gray-50/80 border-b border-gray-100 px-10 py-4 flex justify-center gap-16">
                                            {['Jewellery', 'Tools', 'Machines'].map((dept) => (
                                                <button
                                                    key={dept}
                                                    onMouseEnter={() => {
                                                        const firstInDept = categories.find(c => (c.department || 'Jewellery').toLowerCase() === dept.toLowerCase());
                                                        if (firstInDept) setActiveMegaCategory(firstInDept);
                                                    }}
                                                    aria-label={`View ${dept} department`}
                                                    className={`text-[12px] font-serif font-bold tracking-[0.25em] uppercase transition-all pb-1.5 border-b-2 ${(activeMegaCategory?.department || 'Jewellery').toLowerCase() === dept.toLowerCase() ? 'text-primary border-primary' : 'text-gray-400 border-transparent hover:text-black'}`}
                                                >
                                                    {dept}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="flex-1 w-full mx-auto bg-[#FEF9E7]/50">
                                            <AnimatePresence mode="popLayout">
                                                <motion.div
                                                    key={activeMegaCategory?.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.4 }}
                                                    className="flex h-full min-h-[420px]"
                                                >
                                                    {/* Step 2: Content Area - Floating from Left */}
                                                    <motion.div
                                                        initial={{ x: -100, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                                                        className="w-[30%] p-12 border-r border-gray-100 flex flex-col items-center text-center justify-center"
                                                    >
                                                        <h2 className="text-4xl font-serif text-black uppercase tracking-tighter leading-[0.85] mb-6">
                                                            Complete <br />
                                                            <span className="text-primary italic text-3xl">Collection</span>
                                                        </h2>
                                                        <p className="text-[11px] text-gray-500 font-serif leading-relaxed mb-8 max-w-[240px]">
                                                            Explore our curated {activeMegaCategory?.name?.toLowerCase() || 'Jewellery'} range, handcrafted for excellence.
                                                        </p>

                                                        <Link
                                                            to={`/category/${activeMegaCategory?.id}`}
                                                            aria-label={`View all ${activeMegaCategory?.name} products`}
                                                            className="text-[10px] font-serif font-bold text-black group flex items-center gap-3 tracking-[0.3em] uppercase hover:text-primary transition-colors"
                                                        >
                                                            View All
                                                            <span className="w-10 h-[1px] bg-black group-hover:bg-primary group-hover:w-16 transition-all"></span>
                                                        </Link>
                                                    </motion.div>

                                                    {/* Step 3: Circular Sub-Category Grid - Floating from Right */}
                                                    <motion.div
                                                        initial={{ x: 100, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                                                        className="flex-1 p-12 flex items-start justify-center pt-8"
                                                    >
                                                        <div className="grid grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-12">
                                                            {categories
                                                                .filter(c => (c.department || 'Jewellery').toLowerCase() === (activeMegaCategory?.department || 'Jewellery').toLowerCase())
                                                                .map((cat, idx) => (
                                                                    <Link
                                                                        key={idx}
                                                                        to={`/shop?category=${cat.name.toLowerCase()}`}
                                                                        aria-label={`Show ${cat.name}`}
                                                                        className="flex flex-col items-center gap-4 group/sub"
                                                                    >
                                                                        <div className="relative w-24 h-24 rounded-full border border-gray-100 p-0.5 transition-all duration-700 group-hover/sub:border-primary/40 group-hover/sub:shadow-lg bg-white overflow-hidden">
                                                                            <div className="w-full h-full rounded-full overflow-hidden">
                                                                                <img
                                                                                    src={cat.image || 'https://via.placeholder.com/300'}
                                                                                    alt={cat.name}
                                                                                    className="w-full h-full object-cover transform transition-transform duration-1000 group-hover/sub:scale-110"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <span className="text-[10px] font-serif font-bold text-black/80 tracking-[0.2em] uppercase transition-all duration-300 border-b border-transparent group-hover/sub:border-black/30 pb-0.5 text-center">
                                                                            {cat.name}
                                                                        </span>
                                                                    </Link>
                                                                ))}
                                                        </div>
                                                    </motion.div>
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {[
                                { name: "ABOUT", path: "/about" },
                                { name: "BLOG", path: "/blogs" },
                                { name: "OFFERS", path: "/offers" },
                                { name: "SHOP", path: "/shop" },
                                { name: "CONTACT US", path: "/help" },
                                { name: "TRACK ORDER", path: "/profile/orders" }
                            ].map((nav, idx) => (
                                <Link
                                    key={idx}
                                    to={nav.path}
                                    aria-label={`Go to ${nav.name}`}
                                    className="text-[11px] font-serif font-bold text-black hover:text-primary transition-all tracking-[0.3em] uppercase border-b-2 border-transparent hover:border-primary pb-0.5"
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
                                    {sidebarMenu.mainCategories.map((item, idx) => (
                                        <Link
                                            key={idx}
                                            to={item.path}
                                            aria-label={`Go to ${item.name}`}
                                            onClick={() => toggleMenu(false)}
                                            className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 group transition-all"
                                        >
                                            <span className="font-serif text-sm uppercase tracking-widest text-gray-800 group-hover:text-primary transition-all">
                                                {item.name}
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        </Link>
                                    ))}
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-100 space-y-2 px-4">
                                    {sidebarMenu.support.map((item, idx) => (
                                        <Link
                                            key={idx}
                                            to={item.path}
                                            aria-label={`Go to ${item.name}`}
                                            onClick={() => toggleMenu(false)}
                                            className="block text-[10px] font-serif uppercase tracking-widest text-gray-400 hover:text-primary transition-colors py-2"
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
