import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Upload, X, Plus } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { FormSection, Input, Select } from '../components/common/FormControls';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

const CATEGORY_HIERARCHY = {
    'necklaces': ['Kundan', 'Oxidized', 'Gold Chain', 'Temple', 'Diamond', 'Choker', 'Pendant', 'Mangalsutra'],
    'rings': ['Solitaire', 'Gold Band', 'Diamond Ring', 'Engagement', 'Cocktail', 'Couple Rings'],
    'earrings': ['Studs', 'Jhumkas', 'Drops', 'Hoops', 'Sui Dhaga', 'Chandbali'],
    'bangles': ['Temple Jewellery', 'Gold Bangles', 'Bracelets', 'Kada', 'Cuff'],
    'anklets': ['Silver Anklets', 'Gold Anklets', 'Chain Anklets'],
    'sets': ['Bridal Sets', 'Party Wear', 'Minimal Sets'],
    'combos-packs': ['Office Wear', 'Gift Sets', 'Daily Wear'],
    'nose-pins': ['Gold', 'Diamond', 'Silver']
};

const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
    ],
};

const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list',
    'link', 'image'
];

const ItemEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Determine context
    const isCategory = location.pathname.includes('/categories');
    const isSubcategory = location.pathname.includes('/subcategories');
    const isProduct = location.pathname.includes('/products');
    const isViewMode = location.pathname.includes('/view/');

    const resourceType = isCategory ? 'Category' : (isSubcategory ? 'Subcategory' : 'Product');
    const backPath = isCategory ? '/admin/categories' : (isSubcategory ? '/admin/subcategories' : '/admin/products');

    const isEditMode = Boolean(id) && !isViewMode;

    const [formData, setFormData] = useState({
        name: '',
        parentId: '',
        department: 'jewellery',
        subCategoryId: '',
        description: '',
        stylingTips: '',
        showInCollection: true,
        showInNavbar: true,
        cardLabel: '',
        cardBadge: '',
        material: '925 Silver',
        specifications: '',
        supplierInfo: '',
        originalPrice: '',
        sellingPrice: '',
        discount: 0,
        stock: '',
        status: 'Active',
        images: [],
        sizes: [],
        variantStock: {},
        categories: [{ id: Date.now(), category: '', subcategory: '' }],
        tags: {
            isNewArrival: false,
            isMostGifted: false,
            isNewLaunch: false
        }
    });

    useEffect(() => {
        const fetchResource = async () => {
            if (!isEditMode && !isViewMode) {
                const searchParams = new URLSearchParams(location.search);
                const dept = searchParams.get('department');
                if (dept) setFormData(prev => ({ ...prev, department: dept }));
                return;
            }

            try {
                const endpoint = isCategory ? `/categories/${id}` : (isSubcategory ? `/subcategories/${id}` : `/products/${id}`);
                const res = await api.get(endpoint);
                const data = res.data;

                const normalizedData = {
                    ...data,
                    parentId: data.parentId || '',
                    images: data.images?.length > 0 ? data.images : (data.image ? [data.image] : []),
                    categories: data.categories?.length > 0 ? data.categories : [{
                        id: Date.now(),
                        category: data.category || '',
                        subcategory: data.subcategory || ''
                    }]
                };

                if (isProduct && data.variants?.length > 0) {
                    normalizedData.originalPrice = data.variants[0].mrp;
                    normalizedData.sellingPrice = data.variants[0].price;
                    normalizedData.stock = data.variants[0].stock;
                }

                setFormData(normalizedData);
            } catch (error) {
                console.error("Error fetching resource:", error);
                toast.error("Failed to load details");
            }
        };

        fetchResource();
    }, [id, isEditMode, isViewMode, isCategory, isSubcategory, isProduct]);

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        toast.loading('Uploading assets...', { id: 'upload' });
        try {
            const uploadedUrls = [];
            for (const file of files) {
                const formDataUpload = new FormData();
                formDataUpload.append('image', file);
                const res = await api.post('/banners/upload', formDataUpload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                uploadedUrls.push(res.data.imageUrl);
            }
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...uploadedUrls].slice(0, 5)
            }));
            toast.success('Assets uploaded successfully', { id: 'upload' });
        } catch (error) {
            console.error("Upload error:", error);
            toast.error('Failed to upload some assets', { id: 'upload' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isCategory ? '/categories' : (isSubcategory ? '/subcategories' : '/products');

            let data = { ...formData };

            // Map simple fields to variant collection for Product schema compatibility
            if (isProduct) {
                data.variants = [{
                    name: 'Default',
                    mrp: Number(formData.originalPrice) || 0,
                    price: Number(formData.sellingPrice) || 0,
                    stock: Number(formData.stock) || 0,
                    sold: formData.variants?.[0]?.sold || 0
                }];
                data.image = formData.images[0] || '';
                data.unit = formData.unit || 'pcs';

                // CRITICAL: Map selected category/subcategory for backend validation
                data.category = formData.categories[0]?.category;
                data.subcategory = formData.categories[0]?.subcategory;
                data.department = formData.department || 'jewellery';
                data.brand = formData.brand || 'HG JEWELS';

                // Clean up transient UI fields
                delete data.originalPrice;
                delete data.sellingPrice;
                delete data.stock;
                delete data.categories;
                if (typeof data.specifications === 'string') data.specifications = [];
            } else if (isCategory || isSubcategory) {
                // Categories and Subcategories use a single 'image' string field
                data.image = formData.images[0] || '';
                // Ensure ID is generated for new categories if not present
                if (!isEditMode && !data.id) {
                    data.id = data.name.toLowerCase().replace(/\s+/g, '-');
                }
            }

            if (isEditMode) {
                await api.put(`${endpoint}/${id}`, data);
                toast.success(`${resourceType} updated successfully`);
            } else {
                await api.post(endpoint, data);
                toast.success(`${resourceType} created successfully`);
            }
            navigate(backPath);
        } catch (error) {
            console.error("Error saving resource:", error);
            toast.error(`Error: ${error.response?.data?.message || 'Failed to save resource'}`);
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const addCategory = () => {
        setFormData(prev => ({
            ...prev,
            categories: [...prev.categories, { id: Date.now(), category: '', subcategory: '' }]
        }));
    };

    const removeCategory = (id) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.filter(c => c.id !== id)
        }));
    };

    const handleCategoryChange = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.map(c => {
                if (c.id === id) {
                    if (field === 'category') {
                        return { ...c, category: value, subcategory: '' };
                    }
                    return { ...c, [field]: value };
                }
                return c;
            })
        }));
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
            <div className="max-w-[1500px] mx-auto w-full">
                <PageHeader
                    title={isViewMode ? `Overview: ${resourceType}` : (isEditMode ? `Edit: ${resourceType}` : `Create ${resourceType}`)}
                    subtitle={isViewMode ? `Detailed record for ${formData.name || id}` : (isEditMode ? `Ref: ${id || 'N/A'}` : `Initialize new ${resourceType.toLowerCase()} specifications`)}
                    backPath={backPath}
                    action={!isViewMode ? {
                        label: isEditMode ? 'Commit Changes' : `Finalize ${resourceType}`,
                        onClick: handleSubmit
                    } : undefined}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-4 space-y-6">
                        <FormSection title={isProduct ? "Visual Assets (Max 5)" : "Cover Asset"}>
                            <div className="grid grid-cols-2 gap-2">
                                {formData.images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-none overflow-hidden group border border-black/5 shadow-sm">
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                        {!isViewMode && (
                                            <button
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 p-1 bg-black text-white rounded-none opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {!isViewMode && formData.images.length < (isProduct ? 5 : 1) && (
                                    <label className="aspect-square rounded-none bg-white border border-dashed border-black/10 flex flex-col items-center justify-center cursor-pointer hover:border-gold/50 hover:bg-gold/5 transition-all group">
                                        <Upload className="w-5 h-5 text-gray-300 group-hover:text-gold transition-colors" />
                                        <span className="text-[8px] font-black text-gray-400 mt-2 uppercase tracking-widest font-serif italic">Upload Asset</span>
                                        <input type="file" multiple={isProduct} className="hidden" onChange={handleImageUpload} accept="image/*" disabled={isViewMode} />
                                    </label>
                                )}
                            </div>
                        </FormSection>

                        {isProduct && (
                            <FormSection title="Specifications & Pricing" className="space-y-6">
                                <div className="grid grid-cols-1 gap-4">
                                    <Input
                                        label="Original Price (₹)"
                                        type="number"
                                        value={formData.originalPrice}
                                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                                        disabled={isViewMode}
                                    />
                                    <Input
                                        label="Offer Price (₹)"
                                        type="number"
                                        value={formData.sellingPrice}
                                        onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                                        disabled={isViewMode}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Stock Quantity"
                                            type="number"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            disabled={isViewMode}
                                            placeholder="0"
                                        />
                                        <Select
                                            label="Unit"
                                            value={formData.unit || 'pcs'}
                                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                            options={[
                                                { label: 'Pieces (pcs)', value: 'pcs' },
                                                { label: 'Grams (g)', value: 'g' },
                                                { label: 'Kilograms (kg)', value: 'kg' },
                                                { label: 'Sets (set)', value: 'set' },
                                                { label: 'Meters (m)', value: 'm' }
                                            ]}
                                            disabled={isViewMode}
                                        />
                                    </div>
                                </div>
                            </FormSection>
                        )}
                    </div>

                    <div className="lg:col-span-8 space-y-6">
                        <FormSection title="Core Information" className="space-y-6">
                            <Input
                                label={isCategory ? "Category Name" : (isSubcategory ? "Subcategory Name" : "Product Title")}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={isViewMode}
                            />

                            {isProduct && (
                                <div className="space-y-6">
                                    <Select
                                        label="Target Department"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        options={[
                                            { label: 'Jewellery', value: 'jewellery' },
                                            { label: 'Tools', value: 'tools' },
                                            { label: 'Machines', value: 'machines' }
                                        ]}
                                        disabled={isViewMode}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Select
                                            label="Main Category"
                                            value={formData.categories?.[0]?.category || ''}
                                            onChange={(e) => handleCategoryChange(formData.categories?.[0]?.id, 'category', e.target.value)}
                                            options={[
                                                { label: 'Select Category', value: '' },
                                                ...Object.keys(CATEGORY_HIERARCHY).map(cat => ({
                                                    label: cat.toUpperCase(),
                                                    value: cat
                                                }))
                                            ]}
                                            disabled={isViewMode}
                                        />
                                        <Select
                                            label="Sub-Category"
                                            value={formData.categories?.[0]?.subcategory || ''}
                                            onChange={(e) => handleCategoryChange(formData.categories?.[0]?.id, 'subcategory', e.target.value)}
                                            options={[
                                                { label: 'Select Sub-Category', value: '' },
                                                ...(CATEGORY_HIERARCHY[formData.categories?.[0]?.category] || []).map(sub => ({
                                                    label: sub,
                                                    value: sub
                                                }))
                                            ]}
                                            disabled={isViewMode || !formData.categories[0]?.category}
                                        />
                                    </div>
                                </div>
                            )}

                            {isCategory && (
                                <Select
                                    label="Target Department"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    options={[
                                        { label: 'Jewellery', value: 'jewellery' },
                                        { label: 'Tools', value: 'tools' },
                                        { label: 'Machines', value: 'machines' }
                                    ]}
                                    disabled={isViewMode}
                                />
                            )}

                            {isCategory && (
                                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                    <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all flex-1 ${formData.showInCollection ? 'border-primary bg-primary/5' : 'border-gray-200'} ${isViewMode ? 'pointer-events-none' : ''}`}>
                                        <input type="checkbox" checked={formData.showInCollection} onChange={(e) => setFormData({ ...formData, showInCollection: e.target.checked })} className="w-4 h-4" />
                                        <span className="text-sm">Show in Collection</span>
                                    </label>
                                    <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all flex-1 ${formData.showInNavbar ? 'border-primary bg-primary/5' : 'border-gray-200'} ${isViewMode ? 'pointer-events-none' : ''}`}>
                                        <input type="checkbox" checked={formData.showInNavbar} onChange={(e) => setFormData({ ...formData, showInNavbar: e.target.checked })} className="w-4 h-4" />
                                        <span className="text-sm">Show in Navbar</span>
                                    </label>
                                </div>
                            )}
                        </FormSection>

                        <FormSection title="Product Narrative">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Description</label>
                                <ReactQuill theme="snow" value={formData.description} onChange={(val) => setFormData({ ...formData, description: val })} readOnly={isViewMode} modules={quillModules} formats={quillFormats} style={{ height: '200px', marginBottom: '50px' }} />
                            </div>
                        </FormSection>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemEditor;
