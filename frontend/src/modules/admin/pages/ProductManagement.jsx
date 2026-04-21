import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Edit2, Trash2, Eye, Package, TrendingUp, Check, Plus } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import { useShop } from '../../../context/ShopContext';
import BulkUpdateModal from '../components/BulkUpdateModal';

const ProductManagement = () => {
    const navigate = useNavigate();
    const { products, deleteProduct, toggleProductStatus, bulkUpdatePrices } = useShop();
    const [searchParams] = useSearchParams();
    const isSelectMode = searchParams.get('selectMode') === 'true';
    const returnUrl = searchParams.get('returnUrl') || '/admin/products';

    const [searchTerm, setSearchTerm] = useState('');
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedIds, setSelectedIds] = useState([]);

    const toggleSelection = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    const handleConfirmSelection = () => {
        const selectedProducts = products.filter(p => selectedIds.includes(p.id || p._id));
        sessionStorage.setItem('temp_selected_products', JSON.stringify(selectedProducts));
        navigate(returnUrl);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
        }
    };

    const columns = [
        ...(isSelectMode ? [{
            header: '',
            render: (item) => (
                <div onClick={(e) => { e.stopPropagation(); toggleSelection(item.id || item._id); }} className="cursor-pointer">
                    <div className={`w-4 h-4 rounded-none border flex items-center justify-center transition-all ${selectedIds.includes(item.id || item._id) ? 'bg-black border-black text-white' : 'border-black/20 bg-white'}`}>
                        {(selectedIds.includes(item.id || item._id)) && <Check size={10} strokeWidth={4} />}
                    </div>
                </div>
            )
        }] : []),
        {
            header: 'Identification',
            render: (item) => (
                <div className="flex flex-col py-0.5">
                    <span className="font-black text-black text-[10px] tracking-tight uppercase leading-tight">{item.name}</span>
                    <span className="text-[7px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">id: {(item._id || item.id || '').slice(-6).toUpperCase() || 'N/A'}</span>
                </div>
            )
        },
        {
            header: 'Classification',
            render: (item) => {
                return (
                    <div className="flex flex-col justify-center">
                        <span className="font-black text-gold text-[9px] uppercase tracking-tight">{item.category || 'N/A'}</span>
                        {item.subcategory && <span className="text-[7px] text-gray-400 font-bold uppercase tracking-widest">{item.subcategory}</span>}
                    </div>
                );
            }
        },
        {
            header: 'Valuation',
            align: 'center',
            render: (item) => {
                const price = item.price || (item.variants?.[0]?.price) || '0';
                return <span className="font-serif font-black text-black text-[11px] tabular-nums tracking-tighter">₹ {parseFloat(price).toLocaleString()}</span>;
            }
        },
        {
            header: 'Inventory',
            align: 'center',
            render: (item) => {
                const totalStock = item.stock || (item.variants || []).reduce((sum, v) => sum + (v.stock || 0), 0);
                const inStock = totalStock > 0;
                return (
                    <span className={`px-2 py-0.5 rounded-none text-[8px] font-black uppercase tracking-widest border ${inStock
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'bg-red-50 text-red-600 border-red-100'
                        }`}>
                        {inStock ? `${totalStock} In Stock` : 'Depleted'}
                    </span>
                );
            }
        },
        {
            header: 'Sentiment',
            align: 'center',
            render: (item) => (
                <div className="flex items-center justify-center gap-1">
                    <span className="text-gold text-[8px]">★</span>
                    <span className="font-serif font-black text-black text-[10px]">{item.rating || '0.0'}</span>
                </div>
            )
        },
        {
            header: 'Protocol',
            align: 'center',
            render: (item) => {
                const isActive = item.isActive !== false;
                return (
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleProductStatus(item._id || item.id); }}
                        className={`px-3 py-0.5 rounded-none text-[8px] font-black uppercase tracking-widest border transition-all ${isActive
                            ? 'bg-gold/10 text-gold border-gold/30'
                            : 'bg-gray-50 text-gray-400 border-black/5'
                            }`}>
                        {isActive ? 'Active' : 'Restricted'}
                    </button>
                );
            }
        },
        {
            header: 'Log Date',
            align: 'center',
            render: (item) => <span className="text-gray-400 text-[9px] font-black uppercase tracking-widest">{new Date(item.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}</span>
        },
        ...(!isSelectMode ? [{
            header: 'Access',
            align: 'right',
            render: (item) => (
                <div className="flex items-center justify-end gap-1">
                    <button onClick={() => navigate(`/admin/products/view/${item._id || item.id}`)} title="View" className="p-1.5 text-gray-400 hover:text-black hover:bg-gold/10 transition-all">
                        <Eye size={12} />
                    </button>
                    <button onClick={() => navigate(`/admin/products/edit/${item._id || item.id}`)} title="Edit" className="p-1.5 text-gray-400 hover:text-black hover:bg-gold/10 transition-all">
                        <Edit2 size={12} />
                    </button>
                    <button onClick={() => handleDelete(item._id || item.id)} title="Delete" className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                        <Trash2 size={12} />
                    </button>
                </div>
            )
        }] : [])
    ];

    const filters = [
        {
            options: [
                { label: 'ALL DEPARTMENTS', value: 'all' },
                { label: 'NECKLACES', value: 'necklaces' },
                { label: 'RINGS', value: 'rings' },
                { label: 'EARRINGS', value: 'earrings' },
                { label: 'BANGLES', value: 'bangles' }
            ],
            onChange: (val) => setSelectedCategory(val)
        }
    ];

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const categories = p.categories || (p.category ? [{ category: p.category, subcategory: p.subcategory }] : []);
        const matchesCategory = selectedCategory === 'all' || categories.some(cat => cat.category === selectedCategory);
        return matchesSearch && matchesCategory;
    });

    const handleBulkApply = (config) => {
        bulkUpdatePrices({ category: selectedCategory, ...config });
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-500 pb-12 text-left font-outfit px-1">
            <PageHeader
                title={isSelectMode ? "Selection Protocol" : "Global Inventory"}
                subtitle={isSelectMode ? `${selectedIds.length} items staged for showcase` : "Manage your premium jewelry catalog and valuation metrics."}
                action={!isSelectMode ? {
                    label: "ADD NEW PRODUCT",
                    onClick: () => navigate('/admin/products/new'),
                    icon: <Plus className="w-3.5 h-3.5" />
                } : undefined}
            />

            <DataTable
                columns={columns}
                data={filteredProducts}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchPlaceholder="Search product by nomenclature..."
                filters={filters}
            >
                {!isSelectMode && (
                    <button
                        onClick={() => setIsBulkModalOpen(true)}
                        className="bg-black text-white rounded-none px-4 py-2 text-[9px] font-black uppercase tracking-widest hover:bg-gold hover:text-black transition-all flex items-center gap-2 active:scale-95 shadow-md"
                    >
                        <TrendingUp size={14} />
                        <span>Bulk Protocol</span>
                    </button>
                )}
            </DataTable>

            {isSelectMode && selectedIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-8 py-3 rounded-none shadow-2xl flex items-center gap-6 z-50 animate-in slide-in-from-bottom-5 border border-gold/30">
                    <span className="font-black text-[10px] uppercase tracking-[0.2em]">{selectedIds.length} Items Stage Ready</span>
                    <button
                        onClick={handleConfirmSelection}
                        className="bg-gold text-black px-6 py-2 rounded-none text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all active:scale-95"
                    >
                        Execute Selection
                    </button>
                </div>
            )}

            <BulkUpdateModal
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                onApply={handleBulkApply}
                products={filteredProducts}
            />
        </div>
    );
};

export default ProductManagement;
