const express = require('express');
const {createPostsCtrl, allPostsCtrl, singlePostsCtrl, deletePostsCtrl, updatePostsCtrl} = require("../../controllers/posts/postsctrl")
const postsRouter = express.Router();
const isLogin = require("../../middleware/isLogin");

//POST/api/v1/posts/:id
postsRouter.post('/',isLogin,createPostsCtrl);

//GET/api/v1/posts/
postsRouter.get('/',allPostsCtrl);
//GET/api/v1/posts/:id
postsRouter.get('/:id',singlePostsCtrl);

//DELETE/api/v1/posts/:id
postsRouter.delete('/:id', deletePostsCtrl);

//PUT/api/v1/posts/:id
postsRouter.put('/:id', updatePostsCtrl );

module.exports = postsRouter;