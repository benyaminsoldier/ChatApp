const express = require('express')
const router = express.Router()
const middlewares = require('../controls/middlewares.js')

router.use('/', (req,res)=>{
    console.log('hi this is the router responding by default')
    console.log(req.body)
})

module.exports = router