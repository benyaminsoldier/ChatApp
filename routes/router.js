const express = require('express')
const router = express.Router()
const middlewares = require('../controls/middlewares.js')


router.head('/', (req, res) => {
    console.log('HEAD request received');
    res.sendStatus(200);  // Send a 200 OK status without a body
});

// Handle GET requests to the root route
router.get('/', (req, res) => {
    console.log('GET request received');
    res.send('GET response');
});

module.exports = router