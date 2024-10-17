const express = require('express');
const router = express.Router();
// const jsonData = require('./src/data/locations.json');
const jsonData = require('./src/data/locations copy.json');

router.get('/locations', async (req, res) => {
    // Simulate an API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    res.json(jsonData);
});

module.exports = router;
