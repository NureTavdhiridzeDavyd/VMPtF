const bcrypt = require("bcryptjs");
const { sequelize, User, Category, Product, Review } = require("../models");

async function seed() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });

        const adminPassword = await bcrypt.hash("admin123", 10);
        const customerPassword = await bcrypt.hash("customer123", 10);

        const [admin] = await User.findOrCreate({
            where: { email: "admin@shop.local" },
            defaults: {
                name: "Admin",
                email: "admin@shop.local",
                password: adminPassword,
                role: "admin"
            }
        });

        const [customer] = await User.findOrCreate({
            where: { email: "customer@shop.local" },
            defaults: {
                name: "Customer",
                email: "customer@shop.local",
                password: customerPassword,
                role: "user"
            }
        });

        const [laptops] = await Category.findOrCreate({
            where: { name: "Ноутбуки" },
            defaults: { description: "Категорія ноутбуків для навчання та роботи" }
        });

        const [phones] = await Category.findOrCreate({
            where: { name: "Смартфони" },
            defaults: { description: "Категорія мобільних телефонів" }
        });

        const [lenovo] = await Product.findOrCreate({
            where: { name: "Lenovo IdeaPad 5" },
            defaults: {
                description: "Ноутбук для навчання",
                price: 25000,
                quantity: 10,
                category_id: laptops.id
            }
        });

        await Product.findOrCreate({
            where: { name: "MacBook Air" },
            defaults: {
                description: "Легкий ноутбук для роботи та навчання",
                price: 45000,
                quantity: 5,
                category_id: laptops.id
            }
        });

        await Product.findOrCreate({
            where: { name: "Samsung Galaxy A55" },
            defaults: {
                description: "Смартфон середнього класу",
                price: 18000,
                quantity: 12,
                category_id: phones.id
            }
        });

        await Review.findOrCreate({
            where: { user_id: customer.id, product_id: lenovo.id },
            defaults: {
                user_id: customer.id,
                product_id: lenovo.id,
                rating: 5,
                comment: "Зручний ноутбук для навчання"
            }
        });

        console.log("Seed виконано успішно");
        console.log("Admin: admin@shop.local / admin123");
        console.log("Customer: customer@shop.local / customer123");
    } catch (error) {
        console.error("Помилка seed:", error.message);
    } finally {
        await sequelize.close();
    }
}

seed();
