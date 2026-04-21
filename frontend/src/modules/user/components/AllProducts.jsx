import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';
import ProductCard from './ProductCard';
import Skeleton from './Skeleton';

const AllProducts = () => {
    const { products, loading } = useShop();

    if (loading || !products || products.length === 0) {
        return (
            <section className="pt-4 pb-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <Skeleton className="h-4 w-32 mx-auto mb-2" />
                        <Skeleton className="h-10 w-64 mx-auto" />
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="flex flex-col gap-3">
                                <Skeleton className="w-full aspect-square rounded-[2rem]" />
                                <Skeleton className="h-4 w-3/4 mx-auto" />
                                <Skeleton className="h-3 w-1/2 mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Show 4 rows of 4 products (16 total)
    const displayProducts = products.slice(0, 16);

    return (
        <section className="pt-4 md:pt-4 pb-12 bg-white overflow-hidden">
            <div className="container mx-auto px-2 md:px-4">

                {/* Centered Header - Matched to Style It Your Way */}
                <div className="text-center mb-6 md:mb-8">
                    <span className="text-primary font-serif tracking-[0.2em] font-normal italic text-[10px] md:text-sm mb-1 block">
                        Our Collection
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl font-normal text-dark tracking-tight">
                        All Products
                    </h2>
                    <div className="h-[1px] w-12 bg-primary mx-auto opacity-30 mt-3"></div>
                </div>

                {/* Grid - Using the standard ProductCard component with tighter gaps */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                    {displayProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Subtle View All Link at Bottom */}
                <div className="mt-8 md:mt-16 flex justify-center">
                    <Link
                        to="/shop"
                        className="group flex items-center gap-3 text-sm font-medium text-primary transition-all"
                    >
                        <span className="border-b border-primary pb-0.5 group-hover:text-gold group-hover:border-gold transition-all">
                            View Full Collection
                        </span>
                        <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default AllProducts;
