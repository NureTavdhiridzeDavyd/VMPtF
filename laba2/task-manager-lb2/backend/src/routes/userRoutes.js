const express = require('express');
const { listUsers } = require('../controllers/userController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, adminOnly, listUsers);

module.exports = router;
