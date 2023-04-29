const Post = require("../../model/Post/Post");
const User = require("../../model/User/User");
// create post 
const createPostsCtrl = async(req,res,next)=>{
    const {title, description} = req.body;
    try {
        //Find the user 
        const author = await User.findById(req.userAuth)
        //Create the post 
        const postCreated = await Post.create({
            title,
            description,
            user: author._id,
        })
        //Associate user to a post --Push the post into the user posts field
        author.posts.push(postCreated);
        //save
        await author.save()
        res.json({
            status: "success",
            data: postCreated,
        })
    } catch (error) {
        res.json(error.message);
    }
}

//All posts
const allPostsCtrl =  async(req,res)=>{
    try {
        res.json({
            status: "success",
            data: "Posts routes"
        })
    } catch (error) {
        res.json(error.message);
    }
}

//single posts 
const singlePostsCtrl =  async(req,res)=>{
    try {
        res.json({
            status: "success",
            data: "Posts single routes"
        })
    } catch (error) {
        res.json(error.message);
    }
}

//Delete Post
const deletePostsCtrl = async(req,res)=>{
    try {
        res.json({
            status: "success",
            data: "Delete posts routes"
        })
    } catch (error) {
        res.json(error.message);
    }
}

//Update posts 

const updatePostsCtrl = async(req,res)=>{
    try {
        res.json({
            status: "success",
            data: "Update posts routes"
        })
    } catch (error) {
        res.json(error.message);
    }
}
module.exports = {
    createPostsCtrl,
    allPostsCtrl,
    singlePostsCtrl,
    deletePostsCtrl,
    updatePostsCtrl
}