// Create web server
const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const {isLoggedIn} = require('./middlewares');

// Create comment
router.post('/:id', isLoggedIn, async(req, res, next) => {
    try {
        const post = await Post.findOne({where: {id: req.params.id}});
        if (!post) {
            return res.status(404).send('No post');
        }
        await Comment.create({
            commenter: req.user.id,
            comment: req.body.comment,
            postId: req.params.id,
        });
        res.redirect(`/posts/${req.params.id}`);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// Update comment
router.patch('/:id', isLoggedIn, async(req, res, next) => {
    try {
        await Comment.update({comment: req.body.comment}, {
            where: {
                id: req.params.id,
                commenter: req.user.id,
            }
        });
        res.redirect(`/posts/${req.body.postId}`);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// Delete comment
router.delete('/:id', isLoggedIn, async(req, res, next) => {
    try {
        await Comment.destroy({
            where: {
                id: req.params.id,
                commenter: req.user.id,
            }
        });
        res.redirect(`/posts/${req.body.postId}`);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;