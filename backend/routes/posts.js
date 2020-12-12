const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const PostModel = require('../models/PostModel');


router.get('/', authorize, (request, response) => {

    // Endpoint to get posts of people that currently logged in user follows or their own posts

    PostModel.getAllForUser(request.currentUser.id, (postIds) => {

        if (postIds.length) {
            PostModel.getByIds(postIds, request.currentUser.id, (posts) => {
                response.status(201).json(posts)
            });
            return;
        }
        response.json([])

    })

});

router.post('/', authorize,  (request, response) => {

    // Endpoint to create a new post
  
    let post = request.body;
    post.userId = request.currentUser.id;
    
    if((!post.media.type && post.media.url) || (post.media.type && !post.media.url)) {
        response.status(409)
        .json({
            code: 'missing_url_or_type',
            message: 'You are missing media url or type'
        });
    }else {
        PostModel.create(post, (rows, context) => {
            PostModel.getByIds([context.lastID], request.currentUser.id, (posts) => { 
                response.status(201).json(posts[0])
            })
        });
    }
});


router.put('/:postId/likes', authorize, (request, response) => {

    // Endpoint for current user to like a post
    let postId = request.params.postId;
    let userId = request.currentUser.id;

    PostModel.getLikesByUserIdAndPostId(userId, postId, (rows) => {
        if (rows.length) {
            response.status(409)
                .json({
                    code: 'already_liking',
                    message: 'You are already liking this post'
                });
        } else {
            PostModel.like(userId, postId, () => {
                response.json({
                    ok: true
                })
            })
        }
    })

});

router.delete('/:postId/likes', authorize, (request, response) => {

    // Endpoint for current user to unlike a post
    let userId = request.currentUser.id;
    let postId = request.params.postId;

    PostModel.getLikesByUserIdAndPostId(userId, postId, (rows) => {

        if (!rows.length) {
            response.status(409)
                .json({
                    code: 'not_liking',
                    message: 'You are not liking this post'
                });
        } else {
            PostModel.unlike(userId, postId, () => {

                response.json({
                    ok: true
                })
            })
        }
    })
});

module.exports = router;
