const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "Online Shop API - Lab 4",
        version: "1.0.0",
        description:
            "Лабораторна робота №4: інтернет-магазин з PostgreSQL, Sequelize ORM, CRUD, оптимізацією запитів та JWT-аутентифікацією."
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Local development server"
        }
    ],
    tags: [
        { name: "Root", description: "Перевірка роботи сервера" },
        { name: "Auth", description: "Реєстрація, вхід і JWT" },
        { name: "Users", description: "Керування користувачами" },
        { name: "Categories", description: "Керування категоріями" },
        { name: "Products", description: "Керування товарами, пошук і фільтрація" },
        { name: "Orders", description: "Керування замовленнями" },
        { name: "Reviews", description: "Керування відгуками" }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                description: "Вставте JWT-токен без слова Bearer. Swagger додасть Bearer автоматично."
            }
        },
        schemas: {
            Message: {
                type: "object",
                properties: {
                    message: { type: "string", example: "Online Shop API is working" }
                }
            },
            Error: {
                type: "object",
                properties: {
                    message: { type: "string", example: "Помилка виконання запиту" },
                    error: { type: "string", example: "Detailed error message" }
                }
            },
            RegisterRequest: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                    name: { type: "string", example: "Admin" },
                    email: { type: "string", format: "email", example: "admin@shop.local" },
                    password: { type: "string", example: "admin123" },
                    role: { type: "string", enum: ["user", "admin"], example: "admin" }
                }
            },
            LoginRequest: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string", format: "email", example: "admin@shop.local" },
                    password: { type: "string", example: "admin123" }
                }
            },
            LoginResponse: {
                type: "object",
                properties: {
                    message: { type: "string", example: "Вхід виконано успішно" },
                    token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                    user: { $ref: "#/components/schemas/UserSafe" }
                }
            },
            UserSafe: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 1 },
                    name: { type: "string", example: "Admin" },
                    email: { type: "string", example: "admin@shop.local" },
                    role: { type: "string", example: "admin" },
                    created_at: { type: "string", format: "date-time" },
                    updated_at: { type: "string", format: "date-time" }
                }
            },
            UserCreateRequest: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                    name: { type: "string", example: "Customer" },
                    email: { type: "string", format: "email", example: "customer2@shop.local" },
                    password: { type: "string", example: "customer123" },
                    role: { type: "string", enum: ["user", "admin"], example: "user" }
                }
            },
            Category: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 1 },
                    name: { type: "string", example: "Ноутбуки" },
                    description: { type: "string", example: "Категорія ноутбуків" },
                    created_at: { type: "string", format: "date-time" },
                    updated_at: { type: "string", format: "date-time" }
                }
            },
            CategoryRequest: {
                type: "object",
                required: ["name"],
                properties: {
                    name: { type: "string", example: "Ноутбуки" },
                    description: { type: "string", example: "Категорія ноутбуків" }
                }
            },
            Product: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 1 },
                    name: { type: "string", example: "Lenovo IdeaPad 5" },
                    description: { type: "string", example: "Ноутбук для навчання" },
                    price: { type: "number", format: "float", example: 25000 },
                    quantity: { type: "integer", example: 10 },
                    category_id: { type: "integer", example: 1 },
                    category: { $ref: "#/components/schemas/Category" },
                    reviews: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Review" }
                    },
                    created_at: { type: "string", format: "date-time" },
                    updated_at: { type: "string", format: "date-time" }
                }
            },
            ProductRequest: {
                type: "object",
                required: ["name", "price", "quantity", "category_id"],
                properties: {
                    name: { type: "string", example: "Lenovo IdeaPad 5" },
                    description: { type: "string", example: "Ноутбук для навчання" },
                    price: { type: "number", format: "float", example: 25000 },
                    quantity: { type: "integer", example: 10 },
                    category_id: { type: "integer", example: 1 }
                }
            },
            OrderItemRequest: {
                type: "object",
                required: ["product_id", "quantity"],
                properties: {
                    product_id: { type: "integer", example: 1 },
                    quantity: { type: "integer", example: 2 }
                }
            },
            OrderRequest: {
                type: "object",
                required: ["user_id", "items"],
                properties: {
                    user_id: { type: "integer", example: 2 },
                    status: { type: "string", example: "new" },
                    items: {
                        type: "array",
                        items: { $ref: "#/components/schemas/OrderItemRequest" }
                    }
                }
            },
            OrderStatusRequest: {
                type: "object",
                properties: {
                    status: { type: "string", example: "paid" }
                }
            },
            Order: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 1 },
                    user_id: { type: "integer", example: 2 },
                    total_price: { type: "number", example: 50000 },
                    status: { type: "string", example: "new" },
                    user: { $ref: "#/components/schemas/UserSafe" },
                    items: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "integer", example: 1 },
                                order_id: { type: "integer", example: 1 },
                                product_id: { type: "integer", example: 1 },
                                quantity: { type: "integer", example: 2 },
                                price: { type: "number", example: 25000 },
                                product: { $ref: "#/components/schemas/Product" }
                            }
                        }
                    },
                    created_at: { type: "string", format: "date-time" },
                    updated_at: { type: "string", format: "date-time" }
                }
            },
            Review: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 1 },
                    user_id: { type: "integer", example: 2 },
                    product_id: { type: "integer", example: 1 },
                    rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
                    comment: { type: "string", example: "Якісний товар" },
                    created_at: { type: "string", format: "date-time" },
                    updated_at: { type: "string", format: "date-time" }
                }
            },
            ReviewRequest: {
                type: "object",
                required: ["user_id", "product_id", "rating"],
                properties: {
                    user_id: { type: "integer", example: 2 },
                    product_id: { type: "integer", example: 1 },
                    rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
                    comment: { type: "string", example: "Якісний товар" }
                }
            }
        }
    },
    paths: {
        "/": {
            get: {
                tags: ["Root"],
                summary: "Перевірка запуску API",
                responses: {
                    200: {
                        description: "Сервер працює",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Message" }
                            }
                        }
                    }
                }
            }
        },
        "/api/auth/register": {
            post: {
                tags: ["Auth"],
                summary: "Реєстрація користувача",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/RegisterRequest" }
                        }
                    }
                },
                responses: {
                    201: { description: "Користувача зареєстровано" },
                    400: { description: "Помилка валідації або email вже існує" },
                    500: { description: "Помилка сервера" }
                }
            }
        },
        "/api/auth/login": {
            post: {
                tags: ["Auth"],
                summary: "Вхід користувача та отримання JWT",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/LoginRequest" }
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Успішний вхід",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/LoginResponse" }
                            }
                        }
                    },
                    401: { description: "Неправильний email або пароль" }
                }
            }
        },
        "/api/users": {
            get: {
                tags: ["Users"],
                summary: "Отримати всіх користувачів",
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: "Список користувачів" },
                    401: { description: "Немає токена" },
                    403: { description: "Тільки адміністратор" }
                }
            },
            post: {
                tags: ["Users"],
                summary: "Створити користувача адміністратором",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/UserCreateRequest" }
                        }
                    }
                },
                responses: {
                    201: { description: "Користувача створено" },
                    401: { description: "Немає токена" },
                    403: { description: "Тільки адміністратор" }
                }
            }
        },
        "/api/users/{id}": {
            get: {
                tags: ["Users"],
                summary: "Отримати користувача за id",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: {
                    200: { description: "Користувача знайдено" },
                    404: { description: "Користувача не знайдено" }
                }
            },
            put: {
                tags: ["Users"],
                summary: "Оновити користувача",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/UserCreateRequest" }
                        }
                    }
                },
                responses: { 200: { description: "Користувача оновлено" } }
            },
            delete: {
                tags: ["Users"],
                summary: "Видалити користувача",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Користувача видалено" } }
            }
        },
        "/api/categories": {
            get: {
                tags: ["Categories"],
                summary: "Отримати всі категорії з товарами",
                responses: { 200: { description: "Список категорій" } }
            },
            post: {
                tags: ["Categories"],
                summary: "Створити категорію",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { $ref: "#/components/schemas/CategoryRequest" } } }
                },
                responses: { 201: { description: "Категорію створено" }, 403: { description: "Тільки admin" } }
            }
        },
        "/api/categories/{id}": {
            get: {
                tags: ["Categories"],
                summary: "Отримати категорію за id",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Категорію знайдено" }, 404: { description: "Категорію не знайдено" } }
            },
            put: {
                tags: ["Categories"],
                summary: "Оновити категорію",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CategoryRequest" } } } },
                responses: { 200: { description: "Категорію оновлено" } }
            },
            delete: {
                tags: ["Categories"],
                summary: "Видалити категорію",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Категорію видалено" } }
            }
        },
        "/api/products": {
            get: {
                tags: ["Products"],
                summary: "Отримати товари з категоріями та відгуками",
                description: "Підтримує пошук і фільтрацію. Це демонструє оптимізацію: індекси на category_id/name та eager loading через include.",
                parameters: [
                    { name: "q", in: "query", required: false, schema: { type: "string" }, description: "Пошук за назвою товару" },
                    { name: "category_id", in: "query", required: false, schema: { type: "integer" }, description: "Фільтр за категорією" },
                    { name: "min_price", in: "query", required: false, schema: { type: "number" }, description: "Мінімальна ціна" },
                    { name: "max_price", in: "query", required: false, schema: { type: "number" }, description: "Максимальна ціна" }
                ],
                responses: { 200: { description: "Список товарів" } }
            },
            post: {
                tags: ["Products"],
                summary: "Створити товар",
                security: [{ bearerAuth: [] }],
                requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ProductRequest" } } } },
                responses: { 201: { description: "Товар створено" }, 403: { description: "Тільки admin" } }
            }
        },
        "/api/products/{id}": {
            get: {
                tags: ["Products"],
                summary: "Отримати товар за id",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Товар знайдено" }, 404: { description: "Товар не знайдено" } }
            },
            put: {
                tags: ["Products"],
                summary: "Оновити товар",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ProductRequest" } } } },
                responses: { 200: { description: "Товар оновлено" } }
            },
            delete: {
                tags: ["Products"],
                summary: "Видалити товар",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Товар видалено" } }
            }
        },
        "/api/orders": {
            get: {
                tags: ["Orders"],
                summary: "Отримати всі замовлення",
                security: [{ bearerAuth: [] }],
                responses: { 200: { description: "Список замовлень" } }
            },
            post: {
                tags: ["Orders"],
                summary: "Створити замовлення",
                description: "Замовлення створюється в транзакції: створення order, order_items і зменшення кількості товарів виконуються атомарно.",
                security: [{ bearerAuth: [] }],
                requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/OrderRequest" } } } },
                responses: { 201: { description: "Замовлення створено" } }
            }
        },
        "/api/orders/{id}": {
            get: {
                tags: ["Orders"],
                summary: "Отримати замовлення за id",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Замовлення знайдено" } }
            },
            put: {
                tags: ["Orders"],
                summary: "Оновити статус замовлення",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/OrderStatusRequest" } } } },
                responses: { 200: { description: "Замовлення оновлено" } }
            },
            delete: {
                tags: ["Orders"],
                summary: "Видалити замовлення",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Замовлення видалено" } }
            }
        },
        "/api/reviews": {
            get: {
                tags: ["Reviews"],
                summary: "Отримати всі відгуки",
                responses: { 200: { description: "Список відгуків" } }
            },
            post: {
                tags: ["Reviews"],
                summary: "Створити відгук",
                security: [{ bearerAuth: [] }],
                requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ReviewRequest" } } } },
                responses: { 201: { description: "Відгук створено" } }
            }
        },
        "/api/reviews/{id}": {
            get: {
                tags: ["Reviews"],
                summary: "Отримати відгук за id",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Відгук знайдено" } }
            },
            put: {
                tags: ["Reviews"],
                summary: "Оновити відгук",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ReviewRequest" } } } },
                responses: { 200: { description: "Відгук оновлено" } }
            },
            delete: {
                tags: ["Reviews"],
                summary: "Видалити відгук",
                security: [{ bearerAuth: [] }],
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { 200: { description: "Відгук видалено" } }
            }
        }
    }
};

module.exports = swaggerDocument;
