import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Layers } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductCard = ({ product, isWishlistPage = false }) => {
    const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useShop();
    const [flying, setFlying] = useState(false);
    const [flyingType, setFlyingType] = useState('cart');
    const [timeLeft, setTimeLeft] = useState({ min: 59, sec: 59 });

    React.useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.sec > 0) return { ...prev, sec: prev.sec - 1 };
                if (prev.min > 0) return { min: prev.min - 1, sec: 59 };
                return { min: 59, sec: 59 }; // Reset or stop
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const isWishlisted = wishlist.some(item => item.id === product.id);
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setFlyingType('cart');
        setFlying(true);
        addToCart(product);
        setTimeout(() => setFlying(false), 800);
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isWishlisted) {
            setFlyingType('heart');
            setFlying(true);
            addToWishlist(product);
            setTimeout(() => setFlying(false), 800);
        } else {
            removeFromWishlist(product.id);
        }
    };

    // Calculate primary and secondary (hover) images
    const primaryImage = product.image || (product.images && product.images[0]) || 'https://via.placeholder.com/400';
    
    // Use hoverImage if provided, otherwise use secondary image from array, otherwise use primary image
    const secondaryImage = product.hoverImage || (product.images && product.images[1]) || primaryImage;

    return (
        <div className="group relative w-full flex flex-col transition-all duration-300">
            <style>
                {`
                    @keyframes flyToCart {
                        0% { top: 50%; left: 50%; transform: translate(-50%, -50%) scale(1); opacity: 1; border-radius: 20px; }
                        50% { opacity: 0.8; transform: translate(-50%, -50%) scale(0.4); }
                        100% { top: 30px; left: 92%; transform: translate(-50%, -50%) scale(0.1); opacity: 0; border-radius: 50%; }
                    }
                    @keyframes flyToHeart {
                        0% { top: 50%; left: 50%; transform: translate(-50%, -50%) scale(1); opacity: 1; border-radius: 20px; }
                        50% { opacity: 0.8; transform: translate(-50%, -50%) scale(0.4); }
                        100% { top: 30px; left: 88%; transform: translate(-50%, -50%) scale(0.1); opacity: 0; border-radius: 50%; }
                    }
                    .animate-fly-cart { animation: flyToCart 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
                    .animate-fly-heart { animation: flyToHeart 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
                `}
            </style>

            {flying && (
                <img
                    src={primaryImage}
                    alt=""
                    className={`fixed z-[9999] w-32 h-32 object-cover shadow-2xl pointer-events-none border-2 border-white ${flyingType === 'cart' ? 'animate-fly-cart' : 'animate-fly-heart'}`}
                    style={{ left: '50%', top: '50%' }}
                />
            )}

            {/* Product Image Box with Hover Image Crossfade and Sharp Corners */}
            <Link to={`/product/${product.id}`} className="block relative w-full aspect-square bg-white rounded-none overflow-hidden border border-[#F5E6E8]/50 shadow-sm transition-all group-hover:shadow-md">
                
                {/* Primary Image */}
                <img
                    src={primaryImage}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0"
                />

                {/* Secondary Hover Image (Crossfades on hover) */}
                <img
                    src={secondaryImage}
                    alt={`${product.name} alternate`}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = primaryImage;
                    }}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100"
                />

                {/* Compact Badges */}
                <div className="absolute top-1 left-1 flex flex-col gap-0.5 z-20">
                    {product.isNew && (
                        <span className="bg-black/80 backdrop-blur-sm text-white text-[4px] md:text-[5px] font-bold uppercase tracking-widest px-1 py-0.5 rounded-none inline-block">
                            NEW
                        </span>
                    )}
                    {hasDiscount && (
                        <span className="bg-[#8B4356] text-white text-[4px] md:text-[5px] font-bold uppercase tracking-widest px-1 py-0.5 rounded-none inline-block shadow-sm">
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </span>
                    )}
                </div>

                {/* Wishlist Heart Button Overlay - Pure Floating Transparent Heart with Premium Drop Shadow */}
                <button
                    onClick={handleWishlist}
                    className={`absolute top-1 right-1 z-30 w-5 h-5 flex items-center justify-center transition-all bg-transparent hover:scale-115 active:scale-90 ${isWishlisted ? 'text-red-500' : 'text-zinc-600 hover:text-red-500'}`}
                >
                    <Heart className={`w-3 h-3 drop-shadow-[0_2px_3px_rgba(0,0,0,0.15)] ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} strokeWidth={1.8} />
                </button>

                {/* Rating Pill Overlay (Bottom Left with Sharp Corners) */}
                <div className="absolute bottom-1 left-1 bg-white px-1 py-0.5 rounded-none flex items-center gap-0.5 z-20 border border-zinc-100 shadow-sm">
                    <span className="text-[6px] md:text-[7px] font-bold text-black leading-none">{product.rating || 4.5}</span>
                    <Star className="w-2 h-2 fill-amber-400 text-amber-400" />
                    <span className="text-[6px] md:text-[7px] text-zinc-300 mx-0.5">|</span>
                    <span className="text-[6px] md:text-[7px] text-zinc-500 font-medium">0</span>
                </div>

                {/* Layers Icon Overlay (Bottom Right) */}
                <div className="absolute bottom-1 right-1 bg-black/40 backdrop-blur-sm p-1 rounded-none flex items-center justify-center z-20 border border-white/10 text-white shadow-sm">
                    <Layers className="w-2.5 h-2.5" />
                </div>
            </Link>

            {/* Left Aligned Content Details - Compacted */}
            <div className="pt-0.5 px-0.5 flex flex-col text-left">
                
                {/* Bold Price First */}
                <div className="flex items-baseline gap-0.5">
                    <span className="text-[#111111] font-bold text-[9px] md:text-[10px] tracking-tight">
                        ₹{(product?.price || 0).toLocaleString()}
                    </span>
                    {hasDiscount && (
                        <span className="text-zinc-400 line-through text-[6px] md:text-[7px] font-medium">
                            ₹{product.originalPrice.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Uppercase Product Title */}
                <h3 className="font-serif text-[7px] md:text-[8px] uppercase text-zinc-500 tracking-[0.05em] line-clamp-1 mt-0.5 font-medium">
                    {product.name}
                </h3>

                {/* Full Width Luxury Brown Hover ADD TO CART Button - Premium Animation */}
                <button 
                    onClick={handleAddToCart}
                    className="w-full h-5 md:h-6 mt-1 bg-[#FDF1F2] hover:bg-[#5C3F30] text-[#8B4356] hover:text-white text-[7px] md:text-[8px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ease-out flex items-center justify-center gap-1 rounded-none hover:scale-[1.02] active:scale-[0.98] border border-[#FBE3E5]/20 shadow-sm hover:shadow-md"
                >
                    Add To Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
