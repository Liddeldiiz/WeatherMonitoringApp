const express = require('express');
const router = express.Router();

const {
    displayDashboard
} = require('../Controllers/dashboard_controller');

router.get('/', displayDashboard);

module.exports = router;