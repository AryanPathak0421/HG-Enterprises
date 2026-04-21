const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getInventoryReports = async (req, res) => {
    try {
        // 1. Fetch all products for category analysis
        const products = await Product.find({});

        const categoryMap = {};
        let totalValuation = 0;
        let totalQty = 0;

        products.forEach(prod => {
            const cat = prod.category || 'Uncategorized';
            if (!categoryMap[cat]) {
                categoryMap[cat] = { category: cat, uniqueProducts: 0, totalQty: 0, value: 0 };
            }

            categoryMap[cat].uniqueProducts += 1;

            const prodQty = prod.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
            const prodValue = prod.variants.reduce((sum, v) => sum + ((v.price || 0) * (v.stock || 0)), 0);

            categoryMap[cat].totalQty += prodQty;
            categoryMap[cat].value += prodValue;

            totalValuation += prodValue;
            totalQty += prodQty;
        });

        const categoryData = Object.values(categoryMap).sort((a, b) => b.value - a.value);

        // 2. Fetch all orders for sales velocity analysis
        // We'll aggregate items from completed or processed orders
        const orders = await Order.find({ status: { $ne: 'Cancelled' } });

        const salesMap = {};
        let totalRevenue = 0;
        let totalUnitsSold = 0;

        orders.forEach(order => {
            order.items.forEach(item => {
                const key = `${item.name}-${item.variant || 'Default'}`;
                if (!salesMap[key]) {
                    salesMap[key] = {
                        name: item.name,
                        category: item.category,
                        sold: 0,
                        revenue: 0,
                        prices: []
                    };
                }

                salesMap[key].sold += item.quantity;
                const itemRevenue = item.price * item.quantity;
                salesMap[key].revenue += itemRevenue;
                salesMap[key].prices.push(item.price);

                totalRevenue += itemRevenue;
                totalUnitsSold += item.quantity;
            });
        });

        const salesData = Object.values(salesMap).map(item => {
            const avgPrice = item.prices.length > 0
                ? item.prices.reduce((a, b) => a + b, 0) / item.prices.length
                : 0;
            const { prices, ...rest } = item;
            return { ...rest, avgPrice };
        }).sort((a, b) => b.revenue - a.revenue).slice(0, 50); // Top 50

        res.json({
            categoryData,
            salesData,
            summary: {
                totalValuation,
                totalQty,
                totalRevenue,
                totalUnitsSold,
                dominantSector: categoryData[0]?.category || 'N/A',
                concentration: categoryData[0] ? (categoryData[0].value / totalValuation * 100).toFixed(1) : 0
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating inventory reports', error: error.message });
    }
};
