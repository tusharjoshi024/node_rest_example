const express = require('express');
const {body} = require('express-validator/check');

const User = require('../models/user');
const userController = require('../controllers/user');
const isAuth = require('../filter/is-auth');

const router = express.Router();

router.post(
    '/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, {req}) => {
                return User.findOne({email: value}).then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('E-Mail address already exists!');
                    }
                });
            })
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({min: 5}),
        body('name')
            .trim()
            .not()
            .isEmpty()
    ],
    userController.signup
);

router.post('/login', userController.login);

router.get('/status', isAuth, userController.getUserStatus);

router.patch(
    '/status',
    isAuth,
    [
        body('status')
            .trim()
            .not()
            .isEmpty()
    ],
    userController.updateUserStatus
);

module.exports = router;
