const Category = require('../models/Category');

exports.getAllCategories = async (req, res) => {
    try {
        let { department } = req.query;
        if (department) {
            department = department.toLowerCase();
            // Handle singular/plural mismatches
            if (department === 'machine') department = 'machines';
            if (department === 'tool') department = 'tools';
        }

        const query = department ? { department } : {};
        const categories = await Category.find(query);
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findOne({ id: req.params.id });
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category', error: error.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findOneAndDelete({ id: req.params.id });
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
};
