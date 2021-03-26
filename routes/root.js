const express = require('express');
const { body } = require('express-validator/check');
const isAuth = require('../filter/is-auth');

const router = express.Router();

router.get('/', (req,res,next)=>{
    res.json({message:"Hello there!"});
});

module.exports = router;