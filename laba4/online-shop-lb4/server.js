const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./models");

const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const authRoutes = require("./routes/authRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/swagger");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
app.get("/docs", (req, res) => {
    res.redirect("/api-docs");
});

app.get("/", (req, res) => {
    res.json({
        message: "Online Shop API is working"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("Підключення до PostgreSQL успішне");

        await sequelize.sync({ alter: true });
        console.log("Моделі Sequelize синхронізовано з базою даних");

        app.listen(PORT, () => {
            console.log(`Сервер запущено на порту ${PORT}`);
            console.log(`Адреса: http://localhost:${PORT}`);
            console.log(`Swagger: http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error("Помилка запуску сервера:", error.message);
    }
}

startServer();