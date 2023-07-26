const express = require('express');
const router = express.Router();

const { setSettingsUpdateCallbackUpdateCallback } = require('../Controllers/settings_controller');
const { getServerStatus } = require('../Data/settings');

router.get('/settings', (req, res) => {
    res.status(200).render('Settings');
    res.end()
})

module.exports = router;