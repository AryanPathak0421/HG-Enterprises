import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';
import ProductCard from '../components/ProductCard';
import {
    Heart, ShoppingBag, Star, Share2, Plus, Minus, Truck,
    ShieldCheck, Smile, Gift, ChevronDown, SlidersHorizontal,
    X, Camera, Check, ArrowLeft, ChevronRight, Info,
    Clock, RefreshCw, Award, Zap, Search, UserCircle, Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, addToCart, wishlist, addToWishlist, removeFromWishlist, showNotification, coupons } = useShop();
    const product = products.find(p => p.id === id || p._id === id);
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    // Gallery State
    const [selectedImgIdx, setSelectedImgIdx] = useState(0);
    const productImages = product?.images && product.images.length > 0
        ? product.images
        : [product?.image, product?.image, product?.image];

    // UI states
    const [showSuccessSheet, setShowSuccessSheet] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [openSection, setOpenSection] = useState('about');
    const isWishlisted = wishlist.some(item => item.id === product?.id);
    const originalPrice = product?.originalPrice || product?.price || 0;
    const currentPrice = product?.price || 0;
    const discount = originalPrice > currentPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!product) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF5F6] p-10 text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">Product Not Found</h2>
            <Link to="/shop" className="bg-[#8B4356] text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs shadow-lg">Back to Shop</Link>
        </div>
    );

    const handleAddToCart = () => {
        addToCart(product);
        setShowSuccessSheet(true);
    };

    const handleBuyNow = () => {
        // Direct buy flow: add to cart first then navigate
        addToCart(product);
        navigate('/checkout', { state: { directBuy: true, product: product } });
    };

    const handleWishlist = () => {
        if (isWishlisted) removeFromWishlist(product.id);
        else addToWishlist(product);
    };

    const handleApplyCoupon = (coupon) => {
        setAppliedCoupon(coupon);
        showNotification(`${coupon.code} applied! Check final price.`);
    };

    const getDiscountedPrice = () => {
        if (!appliedCoupon) return currentPrice;
        if (appliedCoupon.type === 'percent') {
            return currentPrice - (currentPrice * appliedCoupon.value / 100);
        } else {
            return Math.max(0, currentPrice - appliedCoupon.value);
        }
    };

    const finalPrice = getDiscountedPrice();

    return (
        <div className="min-h-screen bg-[#FDF5F6] font-body text-[#1A1A1A] pb-12 selection:bg-[#8B4356] selection:text-white overflow-x-hidden">
            <main className="container mx-auto px-4 lg:px-12 pt-8 lg:pt-0">
                {/* 1. Branded Discovery Header - Matched with Shop Layout */}
                <div className="mb-6 lg:mb-10 px-1">
                    <div className="flex items-center gap-2 text-[7px] md:text-[8px] uppercase tracking-[0.4em] font-medium text-zinc-300 mb-2 px-1">
                        <Link to="/" className="hover:text-[#8B4356] transition-colors">Home</Link>
                        <span className="opacity-20">/</span>
                        <Link to="/shop" className="hover:text-[#8B4356] transition-colors">Catalog</Link>
                        <span className="opacity-20">/</span>
                        <span className="text-[#8B4356]/60 tracking-[0.2em] font-black">{product.name}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-3 relative px-1">
                        <div className="flex flex-col gap-2 flex-1">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-black text-black tracking-tight uppercase leading-none">{product.name}</h1>
                            <div className="flex items-center gap-2">
                                <div className="h-[1px] w-8 bg-[#8B4356]/20"></div>
                                <p className="text-[7.5px] md:text-[8px] font-bold uppercase tracking-[0.6em] text-[#8B4356]/40 leading-none">Heritage Particular Selection</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsDrawerOpen(true)}
                            className="w-11 h-11 rounded-full border border-zinc-100 flex items-center justify-center bg-white text-[#8B4356] shadow-md active:scale-95 transition-all hover:bg-[#8B4356] hover:text-white group"
                        >
                            <SlidersHorizontal className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-10">

                    {/* 2. Left Column: Image Gallery - Compacted Spacing */}
                    <div className="relative lg:col-span-5">
                        <div className="px-4 lg:px-0">
                            <div className="aspect-[4/4.5] lg:aspect-[4/4] bg-white rounded-[1.2rem] lg:rounded-[2rem] overflow-hidden shadow-sm relative group border border-[#F5E6E8]/30 max-h-[450px] mx-auto">
                                <motion.img
                                    key={selectedImgIdx}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    src={productImages[selectedImgIdx]}
                                    className="w-full h-full object-cover"
                                />
                                <button onClick={handleWishlist} className="absolute top-4 right-4 w-10 h-10 bg-white border border-[#F5E6E8]/50 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all z-10">
                                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#8B4356] text-[#8B4356]' : 'text-zinc-400'}`} strokeWidth={2.5} />
                                </button>
                                <div className="absolute top-4 left-4">
                                    <span className="bg-[#8B4356] text-white text-[6.5px] font-black uppercase tracking-[.3em] px-2.5 py-1 rounded-full">New Arrival</span>
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail Selector - Tighter Spacing */}
                        <div className="flex justify-center gap-3 py-3 px-4">
                            {['FRONT', 'SIDE', 'DETAIL'].map((label, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImgIdx(idx % productImages.length)}
                                    className="flex flex-col items-center gap-1.5"
                                >
                                    <div className={`w-11 h-11 rounded-lg overflow-hidden border transition-all p-0.5 ${selectedImgIdx === (idx % productImages.length) ? 'border-[#8B4356] scale-105' : 'border-white'}`}>
                                        <img src={productImages[idx % productImages.length]} className="w-full h-full object-cover rounded-md" />
                                    </div>
                                    <span className={`text-[6px] font-black uppercase tracking-widest transition-colors ${selectedImgIdx === (idx % productImages.length) ? 'text-[#8B4356]' : 'text-zinc-300'}`}>{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 3. Right Column: Product Detail Info - Compact Spacing */}
                    <div className="px-5 lg:px-0 lg:pt-0 lg:col-span-7 space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5">
                                <Zap className="w-3 h-3 fill-[#FFD700] text-[#FFD700]" />
                                <span className="text-[8.5px] font-black uppercase font-serif italic tracking-[.4em] text-[#8B4356]/60">Premium Selection</span>
                            </div>
                            <h1 className="text-[22px] md:text-2xl lg:text-2xl font-display font-black leading-tight text-black tracking-tight uppercase">{product.name}</h1>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 bg-white border border-[#F5E6E8] px-2 py-1 rounded-full shadow-sm">
                                    <span className="text-[10px] font-black text-black leading-none">{product.rating || 4.5}</span>
                                    <Star className="w-2.5 h-2.5 fill-[#FFD700] text-[#FFD700]" />
                                </div>
                                <span className="text-[9px] font-bold text-zinc-350 tracking-wide uppercase">{product.reviews || '880'} reviews</span>
                                <div className="h-3 w-[1px] bg-zinc-100"></div>
                                <span className="text-[9px] font-bold text-[#8B4356] tracking-wide uppercase">5K+ Monthly Seekers</span>
                                {product.weight && (
                                    <>
                                        <div className="h-3 w-[1px] bg-zinc-100"></div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-[8px] font-black uppercase text-[#8B4356]/40 tracking-widest">Weight:</span>
                                            <span className="text-[9px] font-bold text-black tracking-wide uppercase">{product.weight}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Pricing Section - Ultra Compact */}
                        <div className="bg-white p-3 lg:p-3 rounded-[1rem] border border-[#F5E6E8] relative overflow-hidden shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="bg-[#8B4356]/5 text-[#8B4356] px-2 py-1 rounded-md border border-[#8B4356]/10">
                                    <span className="text-[12px] font-black">{discount > 0 ? `-${discount}%` : 'LIVE'}</span>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[22px] lg:text-[24px] font-display font-black tracking-tighter leading-none ${appliedCoupon ? 'text-emerald-600' : 'text-black'}`}>₹{finalPrice.toLocaleString()}</span>
                                        {appliedCoupon && (
                                            <div className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1 animate-in zoom-in-95 duration-300">
                                                <Check className="w-2.5 h-2.5" />
                                                <span className="text-[8px] font-bold uppercase tracking-wider">{appliedCoupon.code} Applied</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2 items-center mt-0.5">
                                        {(originalPrice > currentPrice || appliedCoupon) && (
                                            <span className="text-[8.5px] font-bold text-zinc-400 uppercase tracking-widest leading-none line-through">₹{currentPrice.toLocaleString()}</span>
                                        )}
                                        {appliedCoupon && (
                                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none bg-emerald-50 px-1.5 py-0.5 rounded">Saved ₹{(currentPrice - finalPrice).toLocaleString()}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <p className="text-[6.5px] font-black uppercase tracking-[.2em] text-[#8B4356] opacity-40 mt-1">Inclusive of all taxes</p>
                        </div>

                        {/* Offers Section - Dynamic Coupons */}
                        <div>
                            <h4 className="text-[9px] font-black uppercase tracking-[.4em] text-zinc-300 mb-4 flex items-center gap-3">Available Offers <div className="h-[1px] flex-grow bg-zinc-100/30"></div></h4>
                            <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
                                {coupons && coupons.filter(c => c.active).length > 0 ? (
                                    coupons.filter(c => c.active).map((coupon, idx) => (
                                        <div key={idx} className="shrink-0 w-[140px] bg-white p-2.5 rounded-lg border border-[#F5E6E8] shadow-sm relative group">
                                            <div className="absolute top-0 right-0 px-2 py-0.5 bg-[#FDF5F6] rounded-bl-md text-[4.5px] font-black text-[#8B4356]">COUPON</div>
                                            <h5 className="text-[10px] font-bold text-black mb-0.5 tracking-widest">{coupon.code}</h5>
                                            <p className="text-[7.5px] text-zinc-400 mb-1 line-clamp-2">{coupon.description || coupon.desc || `${coupon.type === 'percent' ? coupon.value + '%' : '₹' + coupon.value} OFF`}</p>
                                            <button
                                                onClick={() => handleApplyCoupon(coupon)}
                                                className={`text-[6.5px] font-black uppercase tracking-widest border-b ${appliedCoupon?.code === coupon.code ? 'text-emerald-500 border-emerald-500' : 'text-[#8B4356] border-[#8B4356]/30'}`}
                                            >
                                                {appliedCoupon?.code === coupon.code ? 'Applied' : 'Apply'}
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-[8px] text-zinc-300 uppercase tracking-widest py-2 italic px-1">Check back later for exclusive offers</div>
                                )}
                            </div>
                        </div>

                        {/* Trust Badges - Smaller Icons */}
                        <div className="grid grid-cols-4 gap-1.5 bg-white/40 p-3 rounded-2xl border border-[#F5E6E8]">
                            {[
                                { icon: Award, label: "Genuine" },
                                { icon: Clock, label: "Fast" },
                                { icon: RefreshCw, label: "Return" },
                                { icon: ShieldCheck, label: "Verify" }
                            ].map((badge, bIdx) => (
                                <div key={bIdx} className="flex flex-col items-center text-center gap-1.5 p-1">
                                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center border border-[#F5E6E8] shadow-sm">
                                        <badge.icon className="w-3.5 h-3.5 text-[#8B4356]/70" />
                                    </div>
                                    <span className="text-[6.5px] font-black uppercase tracking-widest text-[#8B4356]/60">{badge.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* About Section - Compact */}
                        <div>
                            <h4 className="text-[9px] font-black uppercase tracking-[.4em] text-zinc-800 mb-4 flex items-center gap-3">Seeker's Guide <div className="h-[1px] flex-grow bg-zinc-100/30"></div></h4>
                            <ul className="space-y-2.5 px-2">
                                {[
                                    "Non Oily Matte Look: Evens out complexion.",
                                    "Blends Effortlessly: For all skin types.",
                                    "Weightless Stay: HD coverage 12h+.",
                                    "Pure & Organic: Crafted with botanical heritage."
                                ].map((point, pIdx) => (
                                    <li key={pIdx} className="flex gap-3 text-[9.5px] leading-relaxed text-zinc-500 font-medium">
                                        <div className="shrink-0 w-1 h-1 rounded-full bg-[#8B4356] mt-1.5 opacity-40"></div>
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Stock & Delivery - Ultra Compact Card with Desktop Actions */}
                        <div className="bg-white p-3 lg:p-4 rounded-[1rem] border border-[#F5E6E8] shadow-sm space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                    <span className="text-[9.5px] font-black text-emerald-600 uppercase tracking-widest">In Stock Now</span>
                                </div>
                                <span className="text-[12px] font-black text-black tracking-tighter">₹{currentPrice.toLocaleString()}</span>
                            </div>

                            <div className="hidden lg:grid grid-cols-2 gap-2">
                                <button
                                    onClick={handleAddToCart}
                                    className="bg-[#2a2a2a] text-white h-10 rounded-xl font-black uppercase tracking-[.2em] text-[9px] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all hover:bg-black"
                                >
                                    <ShoppingBag className="w-3.5 h-3.5" strokeWidth={2.5} /> Add to Bag
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="bg-[#8B4356] text-white h-10 rounded-xl font-black uppercase tracking-[.2em] text-[9px] transition-all hover:bg-[#7a394b] active:scale-95 shadow-sm"
                                >
                                    Buy Now
                                </button>
                            </div>

                            <div className="pt-2 border-t border-zinc-50">
                                <p className="text-[8px] font-semibold text-zinc-400 leading-snug tracking-wide uppercase px-1">FREE Delivery by <span className="text-[#8B4356]">Sunday</span>. Order in <span className="text-black font-black">2 hrs 56 mins</span>.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products Section - Compact Gallery */}
                <div className="mt-16 px-4 lg:px-0 pb-20">
                    <h3 className="text-[10px] font-black uppercase tracking-[.6em] text-zinc-300 mb-8 flex items-center gap-3 px-1">Curated Seek <div className="h-[1px] flex-grow bg-zinc-100/20"></div></h3>
                    <div className="flex overflow-x-auto gap-4 pb-6 scrollbar-hide px-1">
                        {products.filter(p => p.id !== product.id).slice(0, 6).map(rel => (
                            <div key={rel.id} className="shrink-0 w-[160px] md:w-[240px]">
                                <ProductCard product={rel} />
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Floating Action Bar - Ultra Compact rounded buttons */}
            <div className="lg:hidden fixed bottom-6 left-4 right-4 h-16 bg-white/95 backdrop-blur-xl border border-[#F5E6E8] p-2.5 z-[110] flex gap-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-full items-center">
                <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#2a2a2a] text-white h-full rounded-full font-black uppercase tracking-[.2em] text-[9.5px] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                >
                    <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
                </button>
                <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-[#8B4356] text-white h-full rounded-full font-black uppercase tracking-[.2em] text-[9.5px] transition-all hover:bg-[#7a394b] active:scale-95 shadow-sm"
                >
                    Buy Now
                </button>
            </div>
            {/* Mobile Success Sheet - Immersive Swipe Up */}
            <AnimatePresence>
                {showSuccessSheet && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSuccessSheet(false)}
                            className="fixed inset-0 bg-black/60 z-[140] backdrop-blur-[4px]"
                        />

                        {/* Swipe Up Sheet */}
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 z-[150] bg-white rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.3)] pb-[calc(1rem+env(safe-area-inset-bottom))] p-6 lg:hidden"
                        >
                            {/* Drag Indicator */}
                            <div className="w-12 h-1.5 bg-zinc-100 rounded-full mx-auto mb-6"></div>

                            {/* Success Context */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-20 h-20 bg-[#FDF5F6] rounded-2xl overflow-hidden border border-[#F5E6E8]/50 p-1">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center p-0.5">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-[12px] font-black text-emerald-600 uppercase tracking-widest">Added to Bag</span>
                                    </div>
                                    <span className="font-display font-black text-black text-lg tracking-tighter leading-none">{product.name}</span>
                                    <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1.5">{product.subCategory}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => navigate('/cart')}
                                    className="w-full bg-[#8B4356] text-white h-14 rounded-2xl font-black uppercase tracking-[.25em] text-[10px] shadow-xl active:scale-95 transition-all"
                                >
                                    View My Bag
                                </button>
                                <button
                                    onClick={() => setShowSuccessSheet(false)}
                                    className="w-full bg-white text-zinc-400 h-14 rounded-2xl font-black uppercase tracking-[.25em] text-[10px] border border-zinc-100 hover:bg-zinc-50 active:scale-95 transition-all"
                                >
                                    Continue Shopping
                                </button>

                                <div className="flex items-center justify-between px-2 mt-4 pt-4 border-t border-zinc-50">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Bag Subtotal</span>
                                        <span className="text-xl font-display font-black text-black tracking-tighter">₹{product.price.toLocaleString()}</span>
                                    </div>
                                    <button
                                        onClick={() => navigate('/checkout')}
                                        className="bg-[#8B4356] text-white h-12 px-8 rounded-full font-black uppercase tracking-widest text-[9px] shadow-lg active:scale-95 transition-all"
                                    >
                                        Place Order
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            {/* Discovery Sidebar Drawer */}
            <AnimatePresence>
                {isDrawerOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDrawerOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[201] shadow-2xl flex flex-col"
                        >
                            <div className="pt-5 pb-6 px-6 border-b border-zinc-50">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8B4356] mb-1">Our World</span>
                                        <h3 className="font-serif text-3xl md:text-3xl text-black leading-tight italic">Curated <span className="text-[#8B4356] not-italic">Discovery</span></h3>
                                    </div>
                                    <button
                                        onClick={() => setIsDrawerOpen(false)}
                                        className="p-2.5 hover:bg-zinc-50 rounded-full transition-all hover:rotate-90 group border border-transparent hover:border-zinc-100"
                                    >
                                        <X className="w-5 h-5 text-zinc-400 group-hover:text-black" />
                                    </button>
                                </div>
                                <p className="text-[10px] font-serif italic text-zinc-400 leading-relaxed">Explore our signature manifests and heritage collections carefully selected for the modern patron.</p>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-6">
                                {[
                                    {
                                        category: "Signature Collections",
                                        items: [
                                            { name: "Bridal Heritage", path: "bridal" },
                                            { name: "Daily Minimalist", path: "minimalist" },
                                            { name: "Vintage Charm", path: "vintage" },
                                            { name: "Contemporary", path: "modern" }
                                        ]
                                    },
                                    {
                                        category: "Elite Gifts",
                                        items: [
                                            { name: "For Her", path: "for-her" },
                                            { name: "For Him", path: "for-him" },
                                            { name: "Anniversary Special", path: "anniversary" }
                                        ]
                                    }
                                ].map((group, gIdx) => (
                                    <div key={gIdx} className="space-y-3">
                                        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-300 border-b border-zinc-50 pb-2">{group.category}</h4>
                                        <div className="grid grid-cols-1 gap-1.5">
                                            {group.items.map((item, iIdx) => (
                                                <Link
                                                    key={iIdx}
                                                    to={`/shop?tag=${item.name.split(' ')[0]}`}
                                                    onClick={() => setIsDrawerOpen(false)}
                                                    className="flex items-center justify-between group py-3.5 px-4 rounded-xl hover:bg-zinc-50 transition-all border border-transparent hover:border-zinc-100/50"
                                                >
                                                    <span className="text-[13px] font-serif font-bold text-zinc-800 group-hover:text-[#8B4356] transition-colors">{item.name}</span>
                                                    <ChevronRight className="w-3.5 h-3.5 text-zinc-200 group-hover:text-[#8B4356] group-hover:translate-x-1 transition-all" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 border-t border-zinc-50 bg-zinc-50/50">
                                <Link
                                    to="/shop"
                                    onClick={() => setIsDrawerOpen(false)}
                                    className="w-full h-12 bg-black text-white rounded-2xl flex items-center justify-center font-black uppercase tracking-widest text-[10px] shadow-lg hover:shadow-black/10 active:scale-95 transition-all"
                                >
                                    Explore Full Catalog
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductDetails;
