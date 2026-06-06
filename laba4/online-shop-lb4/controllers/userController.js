const bcrypt = require("bcryptjs");
const { User, Order, Review } = require("../models");

const userAttributes = { exclude: ["password"] };

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: userAttributes,
            include: [
                { model: Order, as: "orders" },
                { model: Review, as: "reviews" }
            ],
            order: [["id", "ASC"]]
        });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: "Помилка отримання користувачів",
            error: error.message
        });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: userAttributes,
            include: [
                { model: Order, as: "orders" },
                { model: Review, as: "reviews" }
            ]
        });

        if (!user) {
            return res.status(404).json({
                message: "Користувача не знайдено"
            });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: "Помилка отримання користувача",
            error: error.message
        });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Потрібно вказати name, email та password"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "user"
        });

        res.status(201).json({
            message: "Користувача створено",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Помилка створення користувача",
            error: error.message
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "Користувача не знайдено"
            });
        }

        const data = { ...req.body };

        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        await user.update(data);

        res.status(200).json({
            message: "Користувача оновлено",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Помилка оновлення користувача",
            error: error.message
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "Користувача не знайдено"
            });
        }

        await user.destroy();

        res.status(200).json({
            message: "Користувача видалено"
        });
    } catch (error) {
        res.status(500).json({
            message: "Помилка видалення користувача",
            error: error.message
        });
    }
};
