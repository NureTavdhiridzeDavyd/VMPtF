const { Category, Product } = require("../models");

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            include: [{ model: Product, as: "products" }]
        });

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({
            message: "Помилка отримання категорій",
            error: error.message
        });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id, {
            include: [{ model: Product, as: "products" }]
        });

        if (!category) {
            return res.status(404).json({
                message: "Категорію не знайдено"
            });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({
            message: "Помилка отримання категорії",
            error: error.message
        });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);

        res.status(201).json({
            message: "Категорію створено",
            category
        });
    } catch (error) {
        res.status(500).json({
            message: "Помилка створення категорії",
            error: error.message
        });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: "Категорію не знайдено"
            });
        }

        await category.update(req.body);

        res.status(200).json({
            message: "Категорію оновлено",
            category
        });
    } catch (error) {
        res.status(500).json({
            message: "Помилка оновлення категорії",
            error: error.message
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: "Категорію не знайдено"
            });
        }

        await category.destroy();

        res.status(200).json({
            message: "Категорію видалено"
        });
    } catch (error) {
        res.status(500).json({
            message: "Помилка видалення категорії",
            error: error.message
        });
    }
};