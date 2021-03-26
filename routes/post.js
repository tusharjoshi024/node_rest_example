const express = require('express');
const {body} = require('express-validator/check');

const postController = require('../controllers/post');
const isAuth = require('../filter/is-auth');

const router = express.Router();

router.get('/', isAuth, postController.getPosts);

router.post(
    '/',
    isAuth,
    [
        body('title')
            .trim()
            .isLength({min: 5}),
        body('content')
            .trim()
            .isLength({min: 5})
    ],
    postController.createPost
);

router.get('/:postId', isAuth, postController.getPost);

router.put(
    '/:postId',
    isAuth,
    [
        body('title')
            .trim()
            .isLength({min: 5}),
        body('content')
            .trim()
            .isLength({min: 5})
    ],
    postController.updatePost
);

router.delete('/:postId', isAuth, postController.deletePost);

module.exports = router;
