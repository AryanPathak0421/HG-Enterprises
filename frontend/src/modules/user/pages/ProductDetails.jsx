import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';
import ProductCard from '../components/ProductCard';
import {
    Heart, ShoppingBag, Star, Share2, Plus, Minus, Truck,
    ShieldCheck, Smile, Gift, ChevronDown, SlidersHorizontal,
    X, Camera, Check, ArrowLeft, ChevronRight, Info,
    Clock, RefreshCw, Award, Zap, Search, UserCircle, Home, Download, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import watermarkLogo from '../../../assets/WhatsApp_Image_2026-03-12_at_1.38.09_PM__1_-removebg-preview.png';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { products, addToCart, wishlist, addToWishlist, removeFromWishlist, showNotification, coupons } = useShop();
    const product = products.find(p => p.id === id || p._id === id);
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const categoryName = (product?.category?.name || product?.category || '').toString().toLowerCase();
    const isJewelleryProduct = !categoryName.includes('tool') && 
                                !categoryName.includes('machine') && 
                                !categoryName.includes('measurement') && 
                                !categoryName.includes('optics') && 
                                !categoryName.includes('cutting') && 
                                !categoryName.includes('polishing') && 
                                !categoryName.includes('forging') && 
                                !categoryName.includes('setting') && 
                                !categoryName.includes('machinery');

    // Reviews states & handlers
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [userRating, setUserRating] = useState(5);
    const [userComment, setUserComment] = useState('');
    const [reviewImage, setReviewImage] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const fetchReviews = async () => {
        try {
            setLoadingReviews(true);
            const res = await api.get(`/products/${id}/reviews`);
            setReviews(res.data || []);
        } catch (err) {
            console.error("Error fetching reviews:", err);
        } finally {
            setLoadingReviews(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchReviews();
        }
    }, [id]);

    const handleAddReview = async (e) => {
        e.preventDefault();
        if (!user) {
            showNotification({ message: 'Please login to write a review', type: 'error' });
            return;
        }
        if (!userComment.trim()) {
            showNotification({ message: 'Please enter a review comment', type: 'error' });
            return;
        }
        try {
            setIsSubmittingReview(true);
            const reviewData = {
                productId: id,
                rating: userRating,
                comment: userComment,
                images: reviewImage ? [reviewImage] : []
            };
            await api.post('/products/reviews', reviewData);
            showNotification({ message: 'Review submitted for moderation! It will appear once approved.', type: 'success' });
            setUserComment('');
            setUserRating(5);
            setReviewImage('');
            setShowReviewForm(false);
            fetchReviews();
        } catch (err) {
            console.error("Error submitting review:", err);
            showNotification({ message: err.response?.data?.message || 'Failed to submit review', type: 'error' });
        } finally {
            setIsSubmittingReview(false);
        }
    };

    // Gallery State
    const [selectedImgIdx, setSelectedImgIdx] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        if (!isZoomed) return;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setMousePos({ x, y });
    };

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

    // Accordion expand/collapse states matching the screenshot (Image 1 and 2)
    const [expandedSections, setExpandedSections] = useState({
        'PRODUCT DETAILS': false,
        'DIAMOND DETAILS': false,
        'METAL DETAILS': false,
        'PRICE BREAKUP': false,
        'TAGS': false
    });

    const toggleSection = (secName) => {
        setExpandedSections(prev => ({
            ...prev,
            [secName]: !prev[secName]
        }));
    };

    // Helper to group specs for jewellery details accordion
    const getGroupedSpecs = () => {
        const grouped = {
            'PRODUCT DETAILS': [],
            'DIAMOND DETAILS': [],
            'METAL DETAILS': [],
            'PRICE BREAKUP': [],
            'TAGS': []
        };

        const other = {};

        if (product?.specifications && product.specifications.length > 0) {
            product.specifications.forEach(spec => {
                const labelUpper = spec.label.toUpperCase();
                
                if (labelUpper.includes('PRODUCT CODE') || labelUpper.includes('HEIGHT') || labelUpper.includes('WIDTH') || labelUpper.includes('PRODUCT WEIGHT')) {
                    let cleanLabel = spec.label;
                    if (labelUpper.includes('PRODUCT CODE')) cleanLabel = 'Product Code';
                    if (labelUpper.includes('HEIGHT')) cleanLabel = 'Height';
                    if (labelUpper.includes('WIDTH')) cleanLabel = 'Width';
                    if (labelUpper.includes('PRODUCT WEIGHT')) cleanLabel = 'Product Weight';
                    grouped['PRODUCT DETAILS'].push({ label: cleanLabel, value: spec.value });
                } 
                else if (labelUpper.includes('DIAMOND') || labelUpper.includes('TOTAL WEIGHT') || labelUpper.includes('TOTAL NO. OF DIAMONDS')) {
                    let cleanLabel = spec.label;
                    if (labelUpper.includes('TOTAL WEIGHT') || labelUpper.includes('DIAMOND WEIGHT')) cleanLabel = 'Total Weight';
                    if (labelUpper.includes('TOTAL NO.') || labelUpper.includes('DIAMOND COUNT') || labelUpper.includes('TOTAL DIAMONDS') || labelUpper.includes('DIAMONDS')) cleanLabel = 'Total No. Of Diamonds';
                    grouped['DIAMOND DETAILS'].push({ label: cleanLabel, value: spec.value });
                } 
                else if (labelUpper.includes('METAL') || labelUpper.includes('TYPE') || labelUpper.includes('GOLD WEIGHT')) {
                    let cleanLabel = spec.label;
                    if (labelUpper.includes('TYPE')) cleanLabel = 'Type';
                    if (labelUpper.includes('WEIGHT')) cleanLabel = 'Weight';
                    grouped['METAL DETAILS'].push({ label: cleanLabel, value: spec.value });
                } 
                else if (labelUpper.includes('PRICE') || labelUpper.includes('GOLD') || labelUpper.includes('MAKING') || labelUpper.includes('GST') || labelUpper.includes('TOTAL')) {
                    let cleanLabel = spec.label;
                    if (labelUpper.includes('GOLD')) cleanLabel = 'Gold';
                    if (labelUpper.includes('DIAMOND')) cleanLabel = 'Diamond';
                    if (labelUpper.includes('MAKING')) cleanLabel = 'Making Charges';
                    if (labelUpper.includes('GST')) cleanLabel = 'GST';
                    if (labelUpper.includes('TOTAL')) cleanLabel = 'Total';
                    grouped['PRICE BREAKUP'].push({ label: cleanLabel, value: spec.value });
                } 
                else if (labelUpper.includes('TAGS') || labelUpper.includes('TAG')) {
                    grouped['TAGS'].push({ label: 'Tags', value: spec.value });
                } 
                else {
                    const parts = spec.label.split(' ');
                    const group = parts.length > 1 ? parts.slice(0, -1).join(' ').toUpperCase() : 'GENERAL';
                    if (!other[group]) other[group] = [];
                    other[group].push({ label: spec.label, value: spec.value });
                }
            });
        }

        // Merge any other categories
        Object.entries(other).forEach(([cat, items]) => {
            grouped[cat] = items;
        });

        // Filter out empty sections
        return Object.fromEntries(
            Object.entries(grouped).filter(([_, items]) => items && items.length > 0)
        );
    };

    const [selectedSize, setSelectedSize] = useState(9);
    const [showSizeGuide, setShowSizeGuide] = useState(false);

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
        addToCart({ ...product, selectedSize });
        setShowSuccessSheet(true);
    };

    const handleBuyNow = () => {
        // Direct buy flow: add to cart first then navigate
        addToCart({ ...product, selectedSize });
        navigate('/checkout', { state: { directBuy: true, product: { ...product, selectedSize } } });
    };

    const handleWishlist = () => {
        if (isWishlisted) removeFromWishlist(product.id);
        else addToWishlist(product);
    };

    const handleDownloadImage = async () => {
        try {
            const imageUrl = productImages[selectedImgIdx] || product?.image;
            if (!imageUrl) return;

            showNotification('Preparing high-quality PNG download...');

            // Fetch image as blob
            const response = await fetch(imageUrl, { mode: 'cors' });
            const blob = await response.blob();
            
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = URL.createObjectURL(blob);
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                // Load and overlay the transparent brand logo at the bottom-left corner
                const watermark = new Image();
                watermark.src = watermarkLogo;
                watermark.onload = () => {
                    // Set watermark width to 10% of canvas width (beautifully compact)
                    const wmWidth = canvas.width * 0.10;
                    const wmHeight = watermark.naturalHeight * (wmWidth / watermark.naturalWidth);
                    
                    // Position at bottom-left corner with nice padding
                    const padding = canvas.width * 0.04;
                    const x = padding;
                    // Leave space for the text below the logo
                    const y = canvas.height - wmHeight - padding - (canvas.width * 0.02);
                    
                    // Set watermark transparency to 40% (subtle and high-end)
                    ctx.globalAlpha = 0.40;
                    ctx.drawImage(watermark, x, y, wmWidth, wmHeight);
                    
                    // Draw dark brown premium text below the logo
                    ctx.globalAlpha = 0.70; // Highly readable
                    ctx.fillStyle = '#4E3629'; // Premium Dark Earth Brown
                    const fontSize = Math.round(canvas.width * 0.018); // Elegant sizing
                    ctx.font = `bold ${fontSize}px "Cinzel", "Playfair Display", "Georgia", serif`;
                    ctx.fillText('HG ENTERPRISES', x, y + wmHeight + (fontSize * 1.0));
                    
                    // Reset canvas alpha to default
                    ctx.globalAlpha = 1.0;
                    
                    // Export to PNG data URL
                    const pngUrl = canvas.toDataURL('image/png');
                    
                    const link = document.createElement('a');
                    link.href = pngUrl;
                    link.download = `${product.name.toLowerCase().replace(/\s+/g, '-')}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    showNotification('Downloaded successfully with brand watermark!');
                };
            };
        } catch (error) {
            console.error('Download error:', error);
            // Fallback: direct download link if fetch fails
            try {
                const link = document.createElement('a');
                link.href = productImages[selectedImgIdx] || product?.image;
                link.target = '_blank';
                link.download = `${product.name}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showNotification('Downloaded image file');
            } catch (e) {
                window.open(productImages[selectedImgIdx] || product?.image, '_blank');
            }
        }
    };

    const handleDownloadPDF = async () => {
        try {
            showNotification('Generating Technical PDF Brochure...');

            // Fetch brochure settings from backend
            const settingsRes = await api.get('/settings').catch(() => ({ data: null }));
            const brochure = settingsRes?.data?.pdfBrochure || {};

            const companyName   = brochure.companyName   || 'HARSHAD GAURI ENTERPRISES';
            const companyTagline = brochure.companyTagline || 'PRECISION MACHINERY & TOOLING SOLUTIONS';
            const address       = brochure.address        || '45/2, Golden Plaza, Business District, Mumbai - 400 001';
            const phone         = brochure.phone          || '+91 022 4028 3883';
            const email         = brochure.email          || 'sales@hgenterprises.com';
            const website       = brochure.website        || 'www.hgenterprises.com';
            const featuresHdr   = brochure.featuresHeading|| 'FEATURES :';
            const certText      = brochure.certificationText || 'ISO 9001:2015 Certified';
            const disclaimer    = brochure.footerDisclaimer || 'This is an authentic technical brochure of Harshad Gauri Enterprises.';

            // Parse hex footer color → RGB
            const hex = (brochure.footerBgColor || '#8B4356').replace('#','');
            const fR = parseInt(hex.substring(0,2),16);
            const fG = parseInt(hex.substring(2,4),16);
            const fB = parseInt(hex.substring(4,6),16);

            const doc = new jsPDF({ unit: 'mm', format: 'a4' });
            const pageW = 210;
            const pageH = 297;

            // ── HEADER STRIP ──────────────────────────────────────────
            doc.setFillColor(fR, fG, fB);
            doc.rect(0, 0, pageW, 28, 'F');

            // Company name (left-aligned in header)
            doc.setTextColor(255, 255, 255);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(16);
            doc.text(companyName, 14, 12);

            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(240, 220, 225);
            doc.text(companyTagline, 14, 19);

            // Date (top-right)
            const dateStr = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
            doc.setFontSize(7.5);
            doc.setTextColor(255, 220, 230);
            doc.text(dateStr, pageW - 14, 12, { align: 'right' });

            // ── PRODUCT TITLE BAND ────────────────────────────────────
            doc.setFillColor(245, 230, 232);
            doc.rect(0, 28, pageW, 14, 'F');

            const catLabel = product?.category?.name || product?.category || 'Precision Tooling';
            doc.setTextColor(fR, fG, fB);
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(9);
            doc.text(catLabel.toUpperCase(), pageW - 14, 34, { align: 'right' });

            doc.setTextColor(30, 20, 25);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(17);
            doc.text(product?.name || 'Product Datasheet', 14, 38);

            // ── TWO-COLUMN BODY ───────────────────────────────────────
            // Left col: product image (45mm wide)
            const imgColX = 14;
            const imgColY = 46;
            const imgW = 62;
            const imgH = 62;

            // Embed product image if possible
            const imageUrl = productImages[selectedImgIdx] || product?.image;
            if (imageUrl) {
                try {
                    const imgResp = await fetch(imageUrl, { mode: 'cors' });
                    const imgBlob = await imgResp.blob();
                    const imgDataUrl = await new Promise(resolve => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(imgBlob);
                    });
                    // Border behind image
                    doc.setDrawColor(225, 200, 205);
                    doc.setLineWidth(0.5);
                    doc.rect(imgColX, imgColY, imgW, imgH);
                    doc.addImage(imgDataUrl, 'JPEG', imgColX + 0.5, imgColY + 0.5, imgW - 1, imgH - 1);
                } catch {
                    // Draw placeholder box on error
                    doc.setFillColor(240, 230, 232);
                    doc.rect(imgColX, imgColY, imgW, imgH, 'F');
                    doc.setTextColor(180, 150, 155);
                    doc.setFontSize(8);
                    doc.text('Image Not Available', imgColX + imgW / 2, imgColY + imgH / 2, { align: 'center' });
                }
            }

            // Right col: description
            const rightColX = imgColX + imgW + 6;
            const rightColW = pageW - rightColX - 14;
            let rightY = imgColY;

            // Description
            const rawDesc = product?.description || 'No description available.';
            const cleanDesc = rawDesc.replace(/<[^>]*>/g, '').trim();
            doc.setTextColor(55, 65, 81);
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(9);
            const splitDesc = doc.splitTextToSize(cleanDesc, rightColW);
            const descLinesToShow = Math.min(splitDesc.length, 16);
            doc.text(splitDesc.slice(0, descLinesToShow), rightColX, rightY + 4);
            rightY += 4 + descLinesToShow * 4.2 + 2;

            // Specs table in right column (compact)
            const specsData = [];
            if (product?.specifications?.length > 0) {
                product.specifications.slice(0, 8).forEach(spec => specsData.push([spec.label, spec.value]));
            }
            if (specsData.length > 0) {
                autoTable(doc, {
                    startY: rightY,
                    head: [['Code', product?.sku || product?.name?.split(' ').slice(-1)[0] || 'HG-001']],
                    body: specsData,
                    theme: 'plain',
                    headStyles: { fillColor: [fR, fG, fB], textColor: [255,255,255], fontStyle: 'bold', fontSize: 8, cellPadding: 2 },
                    bodyStyles: { fontSize: 8, cellPadding: 2 },
                    alternateRowStyles: { fillColor: [253, 245, 246] },
                    columnStyles: { 0: { fontStyle: 'bold', textColor: [40,40,40] }, 1: { textColor: [80,80,80] } },
                    margin: { left: rightColX, right: 14 },
                    tableWidth: rightColW,
                });
                rightY = doc.lastAutoTable.finalY + 4;
            }

            // ── FEATURES SECTION (full width, below image + table) ────
            let featY = Math.max(imgColY + imgH + 6, rightY + 2);

            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(30, 20, 25);
            doc.text(featuresHdr, 14, featY);
            featY += 5;

            const benefitsList = product?.benefits?.length > 0
                ? product.benefits
                : ['High-performance engineering for precision operations', 'Built with premium-grade industrial alloys', 'Easy maintenance and long operational lifespan', 'Compact design for optimal workspace efficiency'];

            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(55, 65, 81);
            const halfLen = Math.ceil(benefitsList.length / 2);
            const colW2 = (pageW - 28) / 2;
            benefitsList.forEach((b, i) => {
                const colX = i < halfLen ? 14 : 14 + colW2;
                const row = i < halfLen ? i : i - halfLen;
                const lineY = featY + row * 6;
                doc.setDrawColor(fR, fG, fB);
                doc.setFillColor(fR, fG, fB);
                // Arrow bullet
                doc.triangle(colX, lineY - 2, colX, lineY + 2, colX + 3, lineY, 'F');
                const bText = doc.splitTextToSize(b, colW2 - 8);
                doc.text(bText[0], colX + 5, lineY);
            });

            const featBlockH = halfLen * 6 + 4;

            // ── SPECS TABLE (full width, below features) ───────────────
            const allSpecs = product?.specifications || [];
            if (allSpecs.length > 8) {
                let specY = featY + featBlockH + 4;
                doc.setFont('Helvetica', 'bold');
                doc.setFontSize(10);
                doc.setTextColor(30, 20, 25);
                doc.text('TECHNICAL SPECIFICATIONS', 14, specY);
                specY += 4;
                const fullSpecsData = allSpecs.map(s => [s.label, s.value]);
                autoTable(doc, {
                    startY: specY,
                    head: [['Specification', 'Value']],
                    body: fullSpecsData,
                    theme: 'striped',
                    headStyles: { fillColor: [fR, fG, fB], textColor: [255,255,255], fontStyle: 'bold', fontSize: 8 },
                    bodyStyles: { fontSize: 8 },
                    alternateRowStyles: { fillColor: [253, 245, 246] },
                    margin: { left: 14, right: 14 },
                });
            }

            // ── BRANDED FOOTER (every page) ───────────────────────────
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);

                // Footer band
                const footerY = pageH - 22;
                doc.setFillColor(fR, fG, fB);
                doc.rect(0, footerY, pageW, 22, 'F');

                // Company name
                doc.setTextColor(255, 255, 255);
                doc.setFont('Helvetica', 'bold');
                doc.setFontSize(9);
                doc.text(companyName, 14, footerY + 7);

                // Address, phone, email, website
                doc.setFont('Helvetica', 'normal');
                doc.setFontSize(7);
                doc.setTextColor(240, 220, 225);
                doc.text(address, 14, footerY + 12);
                doc.text(`\u260E ${phone}   \u2709 ${email}   \u{1F310} ${website}`, 14, footerY + 17);

                // Cert + page
                doc.setFont('Helvetica', 'bold');
                doc.setFontSize(7);
                doc.setTextColor(255, 240, 245);
                doc.text(certText, pageW - 14, footerY + 10, { align: 'right' });
                doc.setFont('Helvetica', 'normal');
                doc.setFontSize(7);
                doc.text(`Page ${i} / ${pageCount}`, pageW - 14, footerY + 16, { align: 'right' });
            }

            doc.save(`${product.name.toLowerCase().replace(/\s+/g, '-')}-datasheet.pdf`);
            showNotification('Technical PDF downloaded successfully!');
        } catch (error) {
            console.error('PDF Download error:', error);
            showNotification('Failed to generate PDF. Please try again.');
        }
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
                <div className="mb-2 lg:mb-3 px-1">
                    <div className="flex items-center gap-2 text-[7px] md:text-[8px] uppercase tracking-[0.4em] font-medium text-zinc-300 mb-2 px-1">
                        <Link to="/" className="hover:text-[#8B4356] transition-colors">Home</Link>
                        <span className="opacity-20">/</span>
                        <Link to="/shop" className="hover:text-[#8B4356] transition-colors">Catalog</Link>
                        <span className="opacity-20">/</span>
                        <span className="text-[#8B4356]/60 tracking-[0.2em] font-black">{product.name}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-1.5 relative px-1">
                        <div className="flex flex-col gap-2 flex-1">
                             <h1 className="text-2xl md:text-3xl lg:text-4xl font-assistant font-normal text-zinc-800 tracking-wide capitalize leading-none">{product.subCategory || product.subcategory || product.category || 'Collection'}</h1>
                            <div className="flex items-center gap-2">
                                <div className="h-[1px] w-8 bg-[#8B4356]/20"></div>
                                <p className="text-[7.5px] md:text-[8px] font-bold uppercase tracking-[0.6em] text-[#8B4356]/40 leading-none">Heritage Particular Selection</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsDrawerOpen(true)}
                            className="w-11 h-11 flex items-center justify-center text-[#8B4356] active:scale-95 transition-all hover:text-[#7a394b] group"
                        >
                            <SlidersHorizontal className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 items-start">

                    {/* 2. Left Column: Image Gallery - Sticky & Sharp Corners */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 w-full space-y-2">
                        <div className="px-4 lg:px-0">
                            <div 
                                onClick={() => setIsZoomed(!isZoomed)}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={() => setIsZoomed(false)}
                                className={`aspect-[1/1] bg-white rounded-[36px_4px_36px_4px] overflow-hidden shadow-sm relative group border border-[#F5E6E8]/30 max-h-[380px] mx-auto ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                            >
                                <motion.img
                                    key={selectedImgIdx}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    src={productImages[selectedImgIdx]}
                                    style={{
                                        transformOrigin: isZoomed ? `${mousePos.x}% ${mousePos.y}%` : 'center',
                                    }}
                                    className={`w-full h-full object-cover transition-transform duration-250 ${isZoomed ? 'scale-[2.2]' : 'scale-100'} rounded-[36px_4px_36px_4px]`}
                                />
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleWishlist(); }} 
                                    className="absolute top-4 right-4 flex items-center justify-center p-1.5 active:scale-90 transition-all z-10 text-zinc-600 hover:text-red-500 hover:scale-115"
                                >
                                    <Heart className={`w-5.5 h-5.5 transition-all drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.15)] ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} strokeWidth={2} />
                                </button>
                                {isJewelleryProduct ? (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDownloadImage(); }}
                                        title="Download Product Image as PNG"
                                        className="absolute top-12.5 right-4 flex items-center justify-center p-1.5 active:scale-90 transition-all z-10 text-zinc-600 hover:text-[#8B4356] hover:scale-115"
                                    >
                                        <Download className="w-5.5 h-5.5 transition-all drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.15)]" strokeWidth={2} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDownloadPDF(); }}
                                        title="Download Technical PDF Brochure"
                                        className="absolute top-12.5 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-white/90 shadow-md border border-red-100 active:scale-90 transition-all z-10 hover:bg-red-50 hover:scale-110"
                                    >
                                        <FileText className="w-4 h-4 text-red-600 transition-all" strokeWidth={2} />
                                    </button>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-[#8B4356] text-white text-[6px] font-black uppercase tracking-[.3em] px-2 py-0.5 rounded-[4px_1px_4px_1px]">New Arrival</span>
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail Selector - Sharp & Compact */}
                        <div className="flex justify-center gap-2 py-1 px-4">
                            {['FRONT', 'SIDE', 'DETAIL'].map((label, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImgIdx(idx % productImages.length)}
                                    className="flex flex-col items-center gap-1"
                                >
                                    <div className={`w-10 h-10 rounded-none overflow-hidden border transition-all p-0.5 ${selectedImgIdx === (idx % productImages.length) ? 'border-[#8B4356] scale-105' : 'border-white'}`}>
                                        <img src={productImages[idx % productImages.length]} className="w-full h-full object-cover rounded-none" />
                                    </div>
                                    <span className={`text-[5.5px] font-black uppercase tracking-widest transition-colors ${selectedImgIdx === (idx % productImages.length) ? 'text-[#8B4356]' : 'text-zinc-300'}`}>{label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Seeker's Guide - Beautiful Trust badging card under image gallery */}
                        <div className="pt-5 px-4 lg:px-0">
                            <h4 className="text-[10px] font-black uppercase tracking-[.4em] text-[#8B4356]/60 mb-3 flex items-center gap-3">Seeker's Guide <div className="h-[1px] flex-grow bg-zinc-150"></div></h4>
                            <div className="bg-[#FFF9F6]/40 p-4.5 rounded-none border border-[#F5E6E8]/40 space-y-3.5 shadow-sm">
                                <ul className="space-y-3">
                                    {(product.benefits && product.benefits.length > 0 ? product.benefits : [
                                        "BIS Hallmarked Gold: 100% certified pure metal.",
                                        "Hand-Set Settings: Exquisite craftsmanship.",
                                        "Complimentary Resizing: Free forever on all rings.",
                                        "Insured Shipping: Secure delivery to your doorstep."
                                    ]).map((point, pIdx) => (
                                        <li key={pIdx} className="flex gap-3 text-[10px] md:text-[11px] leading-relaxed text-zinc-500 font-medium">
                                            <div className="shrink-0 w-1.5 h-1.5 rounded-none bg-[#8B4356] mt-1.5 opacity-40"></div>
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* 3. Right Column: Product Detail Info - Sticky Details Flow */}
                    <div className="px-5 lg:px-0 lg:pt-0 lg:col-span-8 space-y-3.5 w-full">
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <span className="text-[10px] font-assistant font-semibold uppercase tracking-[0.25em] text-[#8B4356]/60">Premium Selection</span>
                            </div>
                            <h1 className="text-[22px] md:text-[24px] lg:text-[25px] font-assistant font-normal leading-snug text-zinc-600 tracking-wide">{product.name ? (product.name === product.name.toUpperCase() ? product.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : product.name) : ''}</h1>

                             <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 bg-[#FFF9F6] border border-[#FDF2ED] px-2 py-0.5 rounded-none shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                                    <span className="text-[11px] font-black text-zinc-800 leading-none">{product.rating || 4.5}</span>
                                    <Star className="w-3 h-3 fill-[#FFD700] text-[#FFD700]" />
                                </div>
                                <span className="text-[10.5px] font-black text-zinc-400 tracking-wider uppercase">{product.reviews || '880'} reviews</span>
                                <div className="h-3.5 w-[1px] bg-zinc-200"></div>
                                <span className="text-[10.5px] font-black text-[#8B4356] tracking-wider uppercase">5K+ Monthly Seekers</span>
                                {product.weight && (
                                    <>
                                        <div className="h-3 w-[1px] bg-zinc-200"></div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-[10px] font-black uppercase text-[#8B4356]/40 tracking-widest">Weight:</span>
                                            <span className="text-[10.5px] font-black text-black tracking-wider uppercase">{product.weight}</span>
                                        </div>
                                    </>
                                )}
                             </div>
                        </div>

                        {/* Pricing Section - Giva Style (No background card, horizontal layout, floating wish & share icons) */}
                        <div className="bg-transparent p-0 border-none relative shadow-none space-y-2">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-baseline leading-none">
                                    <span className={`text-[28px] lg:text-[32px] font-assistant font-normal tracking-wide ${appliedCoupon ? 'text-emerald-600' : 'text-black'}`}>
                                        ₹{finalPrice.toLocaleString()}
                                    </span>
                                    {(originalPrice > currentPrice || appliedCoupon) && (
                                        <span className="text-base lg:text-lg font-assistant font-normal text-zinc-400 line-through ml-3.5 leading-none">
                                            ₹{currentPrice.toLocaleString()}
                                        </span>
                                    )}
                                    {discount > 0 && (
                                        <span className="text-[#8B4356] font-assistant font-normal text-xs md:text-sm tracking-wider ml-3 leading-none">
                                            ({discount}% OFF)
                                        </span>
                                    )}
                                </div>

                                {/* Right Side: Interactive Share Action directly in Price Row */}
                                <div className="flex items-center gap-4 text-zinc-800">
                                    <button 
                                        onClick={() => {
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: product.name,
                                                    text: `Check out ${product.name} on HG Enterprises!`,
                                                    url: window.location.href,
                                                }).catch(err => console.log(err));
                                            } else {
                                                navigator.clipboard.writeText(window.location.href);
                                                showNotification("Product link copied to clipboard!");
                                            }
                                        }} 
                                        className="hover:scale-115 active:scale-95 transition-all p-1.5 rounded-full hover:bg-[#8B4356]/5 text-zinc-800"
                                        title="Share Product"
                                    >
                                        <Share2 className="w-5.5 h-5.5" strokeWidth={1.8} />
                                    </button>
                                </div>
                            </div>

                            {appliedCoupon && (
                                <div className="flex">
                                    <div className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-none border border-emerald-100/50 flex items-center gap-1.5 animate-in zoom-in-95 duration-300">
                                        <Check className="w-3 h-3" />
                                        <span className="text-[9px] font-black uppercase tracking-wider">{appliedCoupon.code} Applied (Saved ₹{(currentPrice - finalPrice).toLocaleString()})</span>
                                    </div>
                                </div>
                            )}

                            <p className="text-[9.5px] md:text-[11px] font-black uppercase tracking-[0.18em] text-zinc-400 mt-1">MRP incl. of all taxes</p>
                        </div>

                        {/* Offers Section - Dynamic Coupons - Compact & Sharp */}
                        <div>
                            <h4 className="text-[9px] font-black uppercase tracking-[.4em] text-zinc-300 mb-3 flex items-center gap-3">Available Offers <div className="h-[1px] flex-grow bg-zinc-100/30"></div></h4>
                            <div className="flex overflow-x-auto gap-2 pb-1.5 scrollbar-hide">
                                {coupons && coupons.filter(c => c.active).length > 0 ? (
                                    coupons.filter(c => c.active).map((coupon, idx) => (
                                        <div key={idx} className="shrink-0 w-[135px] bg-white p-2 rounded-none border border-[#F5E6E8] shadow-sm relative group">
                                            <div className="absolute top-0 right-0 px-2 py-0.5 bg-[#FDF5F6] rounded-none text-[4.5px] font-black text-[#8B4356]">COUPON</div>
                                            <h5 className="text-[9.5px] font-bold text-black mb-0.5 tracking-widest">{coupon.code}</h5>
                                            <p className="text-[7px] text-zinc-400 mb-1 line-clamp-2 leading-tight">{coupon.description || coupon.desc || `${coupon.type === 'percent' ? coupon.value + '%' : '₹' + coupon.value} OFF`}</p>
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


                        {/* Conditional Action Card: Sizes for Jewelry vs PDF Downloads for Machines/Tools */}
                        {isJewelleryProduct ? (
                            <div className="bg-white p-3 lg:p-3.5 rounded-none border border-[#F5E6E8] shadow-sm space-y-2.5">
                                <div className="flex items-center justify-between px-0.5">
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-800">Select Size</h4>
                                    <button
                                        onClick={() => setShowSizeGuide(true)}
                                        className="text-[10px] font-black text-[#8B4356] hover:text-[#7a394b] tracking-wider uppercase transition-colors"
                                    >
                                        Size Guide
                                    </button>
                                </div>

                                <div className="grid grid-cols-5 gap-1.5 md:gap-2.5">
                                    {[
                                        { size: 5, mm: '44.8 mm', status: 'Made to Order' },
                                        { size: 7, mm: '47.1 mm', status: 'Only 2 left!' },
                                        { size: 9, mm: '49.0 mm', status: 'in Stock!' },
                                        { size: 11, mm: '50.9 mm', status: 'Only 1 left!' },
                                        { size: 13, mm: '52.8 mm', status: 'in Stock!' },
                                        { size: 6, mm: '45.9 mm', status: 'Only 2 left!' },
                                        { size: 8, mm: '48.1 mm', status: 'Only 5 left!' },
                                        { size: 10, mm: '50.0 mm', status: 'in Stock!' },
                                        { size: 12, mm: '51.8 mm', status: 'in Stock!' },
                                        { size: 14, mm: '54.0 mm', status: 'in Stock!' }
                                    ].map((sizeOpt) => {
                                        const isSelected = selectedSize === sizeOpt.size;
                                        const isLowStock = sizeOpt.status.includes('left');
                                        const isMadeToOrder = sizeOpt.status.includes('Order');
                                        
                                        return (
                                            <button
                                                key={sizeOpt.size}
                                                onClick={() => setSelectedSize(sizeOpt.size)}
                                                className={`flex flex-col items-center justify-between py-2 px-1 rounded-none border transition-all duration-300 relative h-[72px] md:h-[78px] w-full ${
                                                    isSelected 
                                                        ? 'border-[#8B4356] bg-[#8B4356]/[0.03] ring-1 ring-[#8B4356] scale-102 shadow-sm' 
                                                        : 'border-[#F5E6E8]/60 bg-zinc-50/20 hover:bg-zinc-50/65 hover:border-zinc-200'
                                                }`}
                                            >
                                                <div className="flex flex-col items-center leading-none mb-1">
                                                    <span className={`text-[15px] md:text-[17px] font-black tracking-tight leading-none transition-colors ${isSelected ? 'text-[#8B4356]' : 'text-zinc-800'}`}>{sizeOpt.size}</span>
                                                    <span className="text-[9.5px] md:text-[10.5px] font-extrabold text-zinc-450 mt-1 whitespace-nowrap leading-none">{sizeOpt.mm}</span>
                                                </div>
                                                
                                                <div className={`w-full py-0.5 px-0.5 rounded-none text-[6.5px] md:text-[7.5px] font-black text-center uppercase tracking-wider leading-none whitespace-nowrap transition-colors ${
                                                    isSelected
                                                        ? 'bg-[#8B4356] text-white'
                                                        : isLowStock 
                                                            ? 'bg-rose-50 text-rose-500 border border-rose-100/50' 
                                                            : isMadeToOrder 
                                                                ? 'bg-zinc-100 text-zinc-500 border border-zinc-200/50'
                                                                : 'bg-emerald-50 text-emerald-600 border border-emerald-100/50'
                                                }`}>
                                                    {sizeOpt.status}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-white to-[#FDF5F6] p-4 rounded-3xl border border-[#F5E6E8] shadow-sm group transition-all duration-300 hover:shadow-md">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-500">
                                            <FileText className="w-6 h-6 text-red-600" strokeWidth={1.5} />
                                        </div>
                                        <div className="space-y-0.5">
                                            <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-800">TECHNICAL DATASHEET</h4>
                                            <p className="text-[9px] font-medium text-zinc-400 leading-tight max-w-[200px]">
                                                Manual, specs, and blueprints (PDF).
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleDownloadPDF}
                                        className="h-11 px-6 bg-[#8B4356] hover:bg-[#7a394b] text-white rounded-2xl font-black uppercase tracking-[.2em] text-[8.5px] transition-all duration-300 flex items-center justify-center gap-2 shadow-sm active:scale-95 group-hover:translate-y-[-2px]"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        Download PDF
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Stock & Delivery - Ultra Compact Card with Desktop Actions */}
                        <div className="bg-white p-2.5 lg:p-3 rounded-none border border-[#F5E6E8] shadow-sm space-y-2.5">
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
                                    className="bg-[#2a2a2a] text-white h-9 rounded-none font-black uppercase tracking-[.2em] text-[9px] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all duration-300 hover:bg-[#5C3F30]"
                                >
                                    <ShoppingBag className="w-3.5 h-3.5" strokeWidth={2.5} /> Add to Bag
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="bg-[#8B4356] text-white h-9 rounded-none font-black uppercase tracking-[.2em] text-[9px] transition-all hover:bg-[#7a394b] active:scale-95 shadow-sm"
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

                {/* Technical Specifications Section - Full Width & Clean Multi-Column Grid */}
                <div className="mt-4 border-t border-[#F5E6E8]/40 pt-4 px-4 lg:px-0">
                    <h4 className="text-[10px] font-black uppercase tracking-[.4em] text-zinc-400 mb-3 flex items-center gap-3">
                        Product Specifications <div className="h-[1px] flex-grow bg-[#F5E6E8]/40"></div>
                    </h4>
                    
                    {product.specifications && product.specifications.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                            {(() => {
                                const groupedSpecs = getGroupedSpecs();
                                return Object.entries(groupedSpecs).map(([secName, items]) => {
                                    const isExpanded = !!expandedSections[secName];
                                    return (
                                        <div key={secName} className="border border-[#F5E6E8] rounded-none overflow-hidden bg-white shadow-sm transition-all duration-300">
                                            {/* Accordion Header - Compacted Padding */}
                                            <button
                                                onClick={() => toggleSection(secName)}
                                                className="w-full flex items-center justify-between py-2.5 px-3 bg-zinc-50/45 hover:bg-zinc-50/80 active:bg-zinc-100/50 transition-colors border-b border-[#F5E6E8]"
                                            >
                                                {/* Larger Bold Header */}
                                                <span className="text-[11px] md:text-[12px] font-bold text-black tracking-[0.15em] uppercase">{secName}</span>
                                                <span className="text-zinc-500 font-bold">
                                                    {isExpanded ? <Minus className="w-3.5 h-3.5 text-black" strokeWidth={2.5} /> : <Plus className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />}
                                                </span>
                                            </button>

                                            {/* Accordion Content */}
                                            <AnimatePresence initial={false}>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.25 }}
                                                        className="overflow-hidden"
                                                    >
                                                        {/* Compacted Padding p-3 */}
                                                        <div className="p-3 space-y-0.5 divide-y divide-zinc-100 bg-[#FDF5F6]/10">
                                                            {secName === 'TAGS' ? (
                                                                <div className="p-1 text-[11px] md:text-[12px] leading-relaxed text-[#2C6E9E] font-medium tracking-wide">
                                                                    {items[0].value}
                                                                </div>
                                                            ) : (
                                                                items.map((item, idx) => {
                                                                    const isTotal = item.label.toUpperCase() === 'TOTAL';
                                                                    return (
                                                                        <div
                                                                            key={idx}
                                                                            className={`flex items-center justify-between py-1.5 px-1 text-[11px] md:text-[12.5px] ${isTotal ? 'bg-[#8B4356]/5 rounded-none px-2.5 font-bold text-black border-t border-zinc-150' : ''}`}
                                                                        >
                                                                            {/* Larger, premium text */}
                                                                            <span className={`${isTotal ? 'text-[#8B4356] font-bold' : 'text-[#2C6E9E] font-medium'}`}>
                                                                                {item.label}
                                                                            </span>
                                                                            <span className={`${isTotal ? 'text-black font-bold text-xs md:text-sm' : 'text-[#1D5C8A] font-semibold'}`}>
                                                                                {item.value}
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                })
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    ) : (
                        <div className="max-w-xl p-4 bg-white border border-[#F5E6E8] text-[11px] text-zinc-500 leading-relaxed font-assistant">
                            No additional technical specifications listed for this collection.
                        </div>
                    )}
                </div>

                {/* Ratings & Reviews Section */}
                <div className="mt-6 px-4 lg:px-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 border-b border-[#F5E6E8] pb-3">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#8B4356] mb-1">Patron Opinion</span>
                            <h3 className="font-serif text-2xl text-black leading-tight italic">Customer <span className="text-[#8B4356] not-italic">Reviews</span></h3>
                        </div>
                        <button
                            onClick={() => setShowReviewForm(!showReviewForm)}
                            className="self-start md:self-center bg-[#8B4356] text-white py-2 px-5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#7a394b] active:scale-95 transition-all shadow-sm"
                        >
                            {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                        </button>
                    </div>

                    {/* Write a Review Form */}
                    <AnimatePresence>
                        {showReviewForm && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden bg-white border border-[#F5E6E8] p-4 sm:p-6 mb-4 rounded-xl sm:rounded-2xl shadow-sm"
                            >
                                <form onSubmit={handleAddReview} className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#8B4356]">Submit Your Testimony</h4>
                                    
                                    <div>
                                        <label className="block text-[9px] font-black uppercase tracking-wider text-zinc-500 mb-2">Your Rating</label>
                                        <div className="flex gap-1.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setUserRating(star)}
                                                    className="p-1 hover:scale-110 transition-transform"
                                                >
                                                    <Star
                                                        className={`w-6 h-6 ${star <= userRating ? 'fill-[#8B4356] text-[#8B4356]' : 'text-zinc-200'}`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[9px] font-black uppercase tracking-wider text-zinc-500 mb-1">Your Review</label>
                                        <textarea
                                            value={userComment}
                                            onChange={(e) => setUserComment(e.target.value)}
                                            placeholder="Tell us what you love about this item..."
                                            rows={4}
                                            className="w-full border border-zinc-100 p-3 text-[11px] font-medium outline-none focus:border-[#8B4356]/40 rounded-none bg-zinc-50/20"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[9px] font-black uppercase tracking-wider text-zinc-500 mb-1">Image URL (Optional)</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={reviewImage}
                                                onChange={(e) => setReviewImage(e.target.value)}
                                                placeholder="Paste a photo link of your unboxing box..."
                                                className="flex-1 border border-zinc-100 p-3 text-[11px] font-medium outline-none focus:border-[#8B4356]/40 rounded-none bg-zinc-50/20"
                                            />
                                            <button
                                                type="button"
                                                className="px-4 border border-zinc-100 text-zinc-400 hover:text-[#8B4356] transition-colors flex items-center justify-center"
                                                title="Mock camera upload"
                                            >
                                                <Camera className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmittingReview}
                                        className="bg-black text-white py-3 px-8 text-[9px] font-black uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-md"
                                    >
                                        {isSubmittingReview ? 'Submitting...' : 'Post Testimonial'}
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Overall Summary Stats & Distribution Bar - Ultra Compact Landscape */}
                    <div className="grid grid-cols-12 gap-3 bg-white border border-[#F5E6E8]/70 p-2.5 sm:p-4 mb-4 max-w-xl rounded-xl sm:rounded-2xl shadow-sm">
                        {/* Summary Block */}
                        <div className="col-span-5 flex flex-col items-center justify-center text-center border-r border-[#F5E6E8]/50 pr-2 sm:pr-4">
                            <span className="text-2xl sm:text-3xl font-serif font-black text-black leading-none mb-0.5">4.9</span>
                            <div className="flex gap-0.5 mb-1">
                                {[...Array(5)].map((_, idx) => (
                                    <Star key={idx} className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-[#8B4356] text-[#8B4356]" />
                                ))}
                            </div>
                            <span className="text-[6.5px] sm:text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-tight">124 Reviews</span>
                        </div>

                        {/* Progress Distribution */}
                        <div className="col-span-7 flex flex-col justify-center space-y-1">
                            {[
                                { stars: 5, pct: 94 },
                                { stars: 4, pct: 4 },
                                { stars: 3, pct: 1 },
                                { stars: 2, pct: 1 },
                                { stars: 1, pct: 0 }
                            ].map((row, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[9px] font-bold text-zinc-500">
                                    <span className="w-2 text-right">{row.stars}</span>
                                    <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-[#8B4356]/20 text-[#8B4356]/20 shrink-0" />
                                    <div className="flex-1 h-0.5 sm:h-1 bg-zinc-50 border border-zinc-100 overflow-hidden">
                                        <div className="h-full bg-[#8B4356]" style={{ width: `${row.pct}%` }} />
                                    </div>
                                    <span className="w-6 text-right text-zinc-400 tabular-nums">{row.pct}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Testimonial List Grid - Unconditional 2-card per row grid */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                        {[...reviews, ...[
                            {
                                _id: 'default-1',
                                userId: {
                                    name: 'Anushka',
                                    userImage: ''
                                },
                                rating: 5,
                                comment: 'Love it. Extremely lightweight, feels absolutely majestic and shines beautifully.',
                                createdAt: '2025-09-05T00:00:00.000Z',
                                isVerifiedPurchase: true,
                                itemType: 'Single'
                            },
                            {
                                _id: 'default-2',
                                userId: {
                                    name: 'Rahul',
                                    userImage: ''
                                },
                                rating: 5,
                                comment: 'Good product. Elegant build, stellar packaging. Completely matches the collection guides.',
                                createdAt: '2026-04-02T00:00:00.000Z',
                                isVerifiedPurchase: true,
                                itemType: 'Single'
                            },
                            {
                                _id: 'default-3',
                                userId: {
                                    name: 'Aashim',
                                    userImage: ''
                                },
                                rating: 5,
                                comment: 'Hope you love this as much as I Do! Beautiful box package and breathtaking craftsmanship detail on this piece.',
                                createdAt: '2026-03-10T00:00:00.000Z',
                                isVerifiedPurchase: true,
                                images: [
                                    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600'
                                ],
                                itemType: 'Single'
                            },
                            {
                                _id: 'default-4',
                                userId: {
                                    name: 'Divya',
                                    userImage: ''
                                },
                                rating: 5,
                                comment: 'Absolutely stunning craftsmanship. The shine under sunlight is breathtaking. Highly recommend Harshad Gauri!',
                                createdAt: '2026-04-18T00:00:00.000Z',
                                isVerifiedPurchase: true,
                                images: [
                                    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600'
                                ],
                                itemType: 'Single'
                            }
                        ]].map((rev) => {
                            const isDummy = rev._id.startsWith('default');
                            const reviewDate = new Date(rev.createdAt).toLocaleDateString('en-US', {
                                month: 'numeric',
                                day: 'numeric',
                                year: 'numeric'
                            });

                            return (
                                <div key={rev._id} className="bg-white border border-[#F5E6E8]/60 p-2.5 sm:p-4 shadow-sm rounded-xl sm:rounded-2xl flex flex-col justify-between hover:shadow-md transition-all">
                                    <div className="space-y-1.5 sm:space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1 sm:gap-1.5">
                                                <span className="font-serif font-black text-[11px] sm:text-[15px] text-zinc-800 leading-none">{rev.userId?.name || 'Anonymous'}</span>
                                                {rev.isVerifiedPurchase && (
                                                    <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-black rounded-full flex items-center justify-center" title="Verified Buyer">
                                                        <Check className="w-1.5 sm:w-2 text-white stroke-[4px]" />
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-[7.5px] sm:text-[9px] font-bold text-zinc-400 tabular-nums">{reviewDate}</span>
                                        </div>

                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${i < rev.rating ? 'fill-[#8B4356] text-[#8B4356]' : 'text-zinc-200'}`}
                                                />
                                            ))}
                                        </div>

                                        <p className="text-[9.5px] sm:text-[11.5px] text-zinc-600 leading-relaxed font-assistant font-medium normal-case tracking-normal">
                                            "{rev.comment}"
                                        </p>

                                        {rev.images && rev.images.length > 0 && (
                                            <div className="mt-2 overflow-hidden rounded-lg sm:rounded-xl border border-zinc-100 shadow-sm max-h-[90px] sm:max-h-[180px]">
                                                <img
                                                    src={rev.images[0]}
                                                    alt="Patron Testimony Preview"
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                                    onError={(e) => {
                                                        // Gracefully hide the parent container if the image fails to load
                                                        e.target.parentElement.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-2 pt-1.5 sm:mt-4 sm:pt-3 border-t border-zinc-50 flex items-center justify-between text-[8px] sm:text-[10px] text-zinc-400">
                                        <div className="flex items-center gap-1">
                                            <span>Type:</span>
                                            <span className="font-bold text-zinc-600">{rev.itemType || 'Single'}</span>
                                        </div>
                                        {isDummy && (
                                            <span className="text-[6.5px] sm:text-[8px] bg-zinc-50 text-zinc-400 px-1 sm:px-1.5 py-0.5 font-bold uppercase tracking-wider rounded-md">Verified</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Related Products Section - Compact Gallery */}
                <div className="mt-8 px-4 lg:px-0 pb-10">
                    <h3 className="text-[10px] font-black uppercase tracking-[.6em] text-zinc-300 mb-5 flex items-center gap-3 px-1">Curated Seek <div className="h-[1px] flex-grow bg-zinc-100/20"></div></h3>
                    <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide px-1">
                        {products.filter(p => p.id !== product.id).slice(0, 6).map(rel => (
                            <div key={rel.id} className="shrink-0 w-[160px] md:w-[240px]">
                                <ProductCard product={rel} />
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Floating Action Bar - Compact & Sharp */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-xl border-t border-[#F5E6E8] p-2 z-[110] flex gap-2 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] rounded-none items-center">
                <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-[#2a2a2a] text-white h-full rounded-none font-black uppercase tracking-[.2em] text-[9.5px] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all duration-300 hover:bg-[#5C3F30]"
                >
                    <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
                </button>
                <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-[#8B4356] text-white h-full rounded-none font-black uppercase tracking-[.2em] text-[9.5px] transition-all hover:bg-[#7a394b] active:scale-95 shadow-sm"
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
                            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#FFF0F2] z-[201] shadow-2xl flex flex-col border-l border-[#8B4356]/10"
                        >
                            <div className="pt-5 pb-6 px-6 border-b border-[#8B4356]/10">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8B4356] mb-1">Our World</span>
                                        <h3 className="font-serif text-3xl md:text-3xl text-black leading-tight italic">Curated <span className="text-[#8B4356] not-italic">Discovery</span></h3>
                                    </div>
                                    <button
                                        onClick={() => setIsDrawerOpen(false)}
                                        className="p-2.5 hover:bg-[#8B4356]/10 rounded-full transition-all hover:rotate-90 group border border-transparent hover:border-[#8B4356]/20"
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
                                        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8B4356]/40 border-b border-[#8B4356]/10 pb-2">{group.category}</h4>
                                        <div className="grid grid-cols-1 gap-1.5">
                                            {group.items.map((item, iIdx) => (
                                                <Link
                                                    key={iIdx}
                                                    to={`/shop?tag=${item.name.split(' ')[0]}`}
                                                    onClick={() => setIsDrawerOpen(false)}
                                                    className="flex items-center justify-between group py-3.5 px-4 rounded-xl bg-white hover:bg-[#8B4356]/[0.05] transition-all border border-[#8B4356]/5 hover:border-[#8B4356]/10 shadow-sm"
                                                >
                                                    <span className="text-[13px] font-serif font-bold text-zinc-800 group-hover:text-[#8B4356] transition-colors">{item.name}</span>
                                                    <ChevronRight className="w-3.5 h-3.5 text-zinc-200 group-hover:text-[#8B4356] group-hover:translate-x-1 transition-all" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 border-t border-[#8B4356]/10 bg-[#8B4356]/[0.02]">
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

            {/* Size Guide Modal */}
            <AnimatePresence>
                {showSizeGuide && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSizeGuide(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[300]"
                        />

                        {/* Modal Panel */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-x-4 bottom-4 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md bg-white rounded-3xl z-[301] shadow-2xl p-6 flex flex-col max-h-[85vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-4">
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#8B4356] mb-1">Patron Sizing</span>
                                    <h3 className="font-serif text-2xl text-black leading-tight italic">Ring <span className="text-[#8B4356] not-italic">Size Guide</span></h3>
                                </div>
                                <button
                                    onClick={() => setShowSizeGuide(false)}
                                    className="p-2 hover:bg-zinc-50 rounded-full transition-all"
                                >
                                    <X className="w-5 h-5 text-zinc-400" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">Use our comprehensive conversion chart below to find your correct ring size based on your finger circumference or diameter measurements.</p>

                                {/* Size Conversion Table */}
                                <div className="border border-zinc-100 rounded-2xl overflow-hidden shadow-sm">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-zinc-50/50 border-b border-zinc-100">
                                                <th className="py-2.5 px-3 text-[9px] font-black text-black uppercase tracking-wider">Ring Size</th>
                                                <th className="py-2.5 px-3 text-[9px] font-black text-black uppercase tracking-wider">Inside Diameter</th>
                                                <th className="py-2.5 px-3 text-[9px] font-black text-black uppercase tracking-wider">Circumference</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-50 text-[10px]">
                                            {[
                                                { size: '5', diameter: '15.7 mm', circumference: '49.3 mm' },
                                                { size: '6', diameter: '16.5 mm', circumference: '51.8 mm' },
                                                { size: '7', diameter: '17.3 mm', circumference: '54.4 mm' },
                                                { size: '8', diameter: '18.2 mm', circumference: '56.9 mm' },
                                                { size: '9', diameter: '19.0 mm', circumference: '59.5 mm' },
                                                { size: '10', diameter: '19.8 mm', circumference: '62.1 mm' },
                                                { size: '11', diameter: '20.6 mm', circumference: '64.6 mm' },
                                                { size: '12', diameter: '21.3 mm', circumference: '67.2 mm' },
                                                { size: '13', diameter: '22.2 mm', circumference: '69.7 mm' },
                                                { size: '14', diameter: '23.0 mm', circumference: '72.3 mm' }
                                            ].map((row, idx) => (
                                                <tr key={idx} className="hover:bg-zinc-50/30 transition-colors">
                                                    <td className="py-2 px-3 font-bold text-[#8B4356]">{row.size}</td>
                                                    <td className="py-2 px-3 font-semibold text-zinc-600">{row.diameter}</td>
                                                    <td className="py-2 px-3 font-semibold text-zinc-600">{row.circumference}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* How to Measure section */}
                                <div className="bg-[#FDF5F6] p-4 rounded-2xl border border-[#F5E6E8]/60">
                                    <h4 className="text-[9px] font-black text-[#8B4356] uppercase tracking-widest mb-2">How to Measure at Home</h4>
                                    <ol className="list-decimal list-inside space-y-2 text-[9.5px] leading-relaxed text-zinc-600 font-medium">
                                        <li>Wrap a piece of thin string or paper strip snugly around the base of your finger.</li>
                                        <li>Mark the exact spot where the ends meet.</li>
                                        <li>Measure the paper length in millimeters with a ruler to get the <span className="font-bold text-black">circumference</span>.</li>
                                        <li>Match your measurement to the table above to choose the perfect size!</li>
                                    </ol>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowSizeGuide(false)}
                                className="mt-5 w-full h-11 bg-[#8B4356] text-white rounded-xl font-black uppercase tracking-widest text-[9px] shadow-md hover:bg-[#7a394b] active:scale-95 transition-all"
                            >
                                Got it, Thank you
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductDetails;
