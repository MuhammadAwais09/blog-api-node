const express = require('express');
const dotenv = require('dotenv');
const userRouter = require('./routes/users/userRoutes');
const postsRouter = require('./routes/posts/postsRouters');
const commentsRouter = require('./routes/comments/commentsRoutes');
const categoryRouter = require('./routes/category/categoryRoutes');
const globalErrHandler = require('./middleware/globalErrHandler');
const isAdmin = require('./middleware/isAdmin');
const Post = require('./model/Post/Post');
dotenv.config();
 require('./config/dbConnect');
const app = express();
// app.use(isAdmin);

console.log(app);

//middleware
app.use(express.json()); //parse incoming payload

const userAuth = {
    isLogin: true,
    isAdmin: false,
}

app.use((req,res,next)=>{
    if(userAuth.isLogin)
    {
next();
    }
    else {
        return res.json({
            msg: "invalid user"
        })
    }
});

//Home 
app.get('/', async(req,res,next)=>{
    try {
        const posts = await Post.find();
        res.json({
            status: "success",
            data: posts,
        })
    } catch (error) {
        res.json(error)
    }
})

//-----
//routes
//----
//user routes
app.use('/api/v1/users/',userRouter);

//posts routes
app.use('/api/v1/posts', postsRouter);

//comments routes
app.use('/api/v1/comments',commentsRouter);

//category routes
app.use('/api/v1/category', categoryRouter);


//Error handler middleware
app.use(globalErrHandler);

//404 error handle
app.use('*', (req,res)=>{
    res.status(404).json({
        message: `${req.originalUrl} - Route not Found`,
    })
})

const PORT= process.env.PORT || 3000;
app.listen(PORT, console.log(`server is up and running on ${PORT}`));