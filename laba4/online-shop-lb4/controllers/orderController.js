const { sequelize, Order, OrderItem, Product, User } = require("../models");

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: User, as: "user", attributes: { exclude: ["password"] } },
                {
                    model: OrderItem,
                    as: "items",
                    include: [{ model: Product, as: "product" }]
                }
            ]
        });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: "Помилка отримання замовлень",
            error: error.message
        });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [
                { model: User, as: "user", attributes: { exclude: ["password"] } },
                {
                    model: OrderItem,
                    as: "items",
                    include: [{ model: Product, as: "product" }]
                }
            ]
        });

        if (!order) {
            return res.status(404).json({
                message: "Замовлення не знайдено"
            });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({
            message: "Помилка отримання замовлення",
            error: error.message
        });
    }
};

exports.createOrder = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { user_id, status, items } = req.body;

        if (!user_id || !Array.isArray(items) || items.length === 0) {
            await transaction.rollback();
            return res.status(400).json({
                message: "Потрібно вказати user_id та масив items"
            });
        }

        let totalPrice = 0;
        const preparedItems = [];

        for (const item of items) {
            const product = await Product.findByPk(item.product_id, { transaction });

            if (!product) {
                await transaction.rollback();
                return res.status(404).json({
                    message: `Товар з id ${item.product_id} не знайдено`
                });
            }

            const quantity = Number(item.quantity || 1);

            if (quantity < 1) {
                await transaction.rollback();
                return res.status(400).json({
                    message: "Кількість товару має бути більшою за 0"
                });
            }

            if (product.quantity < quantity) {
                await transaction.rollback();
                return res.status(400).json({
                    message: `Недостатньо товару на складі: ${product.name}`
                });
            }

            const price = Number(product.price);
            totalPrice += price * quantity;

            preparedItems.push({
                product,
                product_id: product.id,
                quantity,
                price
            });
        }

        const order = await Order.create(
            {
                user_id,
                total_price: totalPrice,
                status: status || "new"
            },
            { transaction }
        );

        for (const item of preparedItems) {
            await OrderItem.create(
                {
                    order_id: order.id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.price
                },
                { transaction }
            );

            await item.product.update(
                {
                    quantity: item.product.quantity - item.quantity
                },
                { transaction }
            );
        }

        await transaction.commit();

        const createdOrder = await Order.findByPk(order.id, {
            include: [
                { model: User, as: "user", attributes: { exclude: ["password"] } },
                {
                    model: OrderItem,
                    as: "items",
                    include: [{ model: Product, as: "product" }]
                }
            ]
        });

        res.status(201).json({
            message: "Замовлення створено",
            order: createdOrder
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            message: "Помилка створення замовлення",
            error: error.message
        });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Замовлення не знайдено"
            });
        }

        await order.update({
            status: req.body.status || order.status
        });

        res.status(200).json({
            message: "Замовлення оновлено",
            order
        });
    } catch (error) {
        res.status(500).json({
            message: "Помилка оновлення замовлення",
            error: error.message
        });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Замовлення не знайдено"
            });
        }

        await order.destroy();

        res.status(200).json({
            message: "Замовлення видалено"
        });
    } catch (error) {
        res.status(500).json({
            message: "Помилка видалення замовлення",
            error: error.message
        });
    }
};
