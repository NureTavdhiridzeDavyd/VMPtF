const { Review, User, Product } = require("../models");

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            include: [
                { model: User, as: "user", attributes: { exclude: ["password"] } },
                { model: Product, as: "product" }
            ]
        });

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({
            message: "Помилка отримання відгуків",
            error: error.message
        });
    }
};

exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id, {
            include: [
                { model: User, as: "user", attributes: { exclude: ["password"] } },
                { model: Product, as: "product" }
            ]
        });

        if (!review) {
            return res.status(404).json({
                message: "Відгук не знайдено"
            });
        }

        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({
            message: "Помилка отримання відгуку",
            error: error.message
        });
    }
};

exports.createReview = async (req, res) => {
    try {
        const review = await Review.create(req.body);

        res.status(201).json({
            message: "Відгук створено",
            review
        });
    } catch (error) {
        res.status(500).json({
            message: "Помилка створення відгуку",
            error: error.message
        });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);

        if (!review) {
            return res.status(404).json({
                message: "Відгук не знайдено"
            });
        }

        await review.update(req.body);

        res.status(200).json({
            message: "Відгук оновлено",
            review
        });
    } catch (error) {
        res.status(500).json({
            message: "Помилка оновлення відгуку",
            error: error.message
        });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);

        if (!review) {
            return res.status(404).json({
                message: "Відгук не знайдено"
            });
        }

        await review.destroy();

        res.status(200).json({
            message: "Відгук видалено"
        });
    } catch (error) {
        res.status(500).json({
            message: "Помилка видалення відгуку",
            error: error.message
        });
    }
};