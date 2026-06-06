const { Op } = require("sequelize");
const { Product, Category, Review } = require("../models");

exports.getAllProducts = async (req, res) => {
    try {
        const { q, category_id, min_price, max_price } = req.query;
        const where = {};

        if (q) {
            where.name = { [Op.iLike]: `%${q}%` };
        }

        if (category_id) {
            where.category_id = category_id;
        }

        if (min_price || max_price) {
            where.price = {};

            if (min_price) {
                where.price[Op.gte] = Number(min_price);
            }

            if (max_price) {
                where.price[Op.lte] = Number(max_price);
            }
        }

        const products = await Product.findAll({
            where,
            include: [
                { model: Category, as: "category" },
                { model: Review, as: "reviews" }
            ],
            order: [["id", "ASC"]]
        });

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            message: "Помилка отримання товарів",
            error: error.message
        });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [
                { model: Category, as: "category" },
                { model: Review, as: "reviews" }
            ]
        });

        if (!product) {
            return res.status(404).json({
                message: "Товар не знайдено"
            });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({
            message: "Помилка отримання товару",
            error: error.message
        });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            message: "Товар створено",
            product
        });
    } catch (error) {
        res.status(500).json({
            message: "Помилка створення товару",
            error: error.message
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Товар не знайдено"
            });
        }

        await product.update(req.body);

        res.status(200).json({
            message: "Товар оновлено",
            product
        });
    } catch (error) {
        res.status(500).json({
            message: "Помилка оновлення товару",
            error: error.message
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Товар не знайдено"
            });
        }

        await product.destroy();

        res.status(200).json({
            message: "Товар видалено"
        });
    } catch (error) {
        res.status(500).json({
            message: "Помилка видалення товару",
            error: error.message
        });
    }
};
