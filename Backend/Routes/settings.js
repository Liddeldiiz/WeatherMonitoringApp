const express = require('express');
const router = express.Router();

router.get('/settings', (req, res) => {
    res.status(200).render('Settings');
    res.end()
})

module.exports = router;