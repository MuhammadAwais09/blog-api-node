const express = require('express');
const {userRegisterCtrl, userLoginCtrl, allUserCtrl,profileUserCtrl,
    profilePhotoUploadCtrl,
    whoViewedMyProfileCtrl,updateUserCtrl,
    followingCtrl,blockUserCtrl,unBlockUserCtrl,adminBlockUserCtrl,
    adminUnBlockUserCtrl,updatePasswordCtrl,deleteUserAccountCtrl,
    unFollowCtrl} = require("../../controllers/users/usersctrl");
const isLogin = require('../../middleware/isLogin');
const storage = require('../../config/cloudinary');
const userRouter = express.Router();
const multer =  require('multer');
const isAdmin = require('../../middleware/isAdmin');

//Instance of multer
const upload = multer({storage});




//POST/api/v1/users/register
userRouter.post('/register',userRegisterCtrl);

//POST/api/v1/users/login
userRouter.post('/login', userLoginCtrl);

//GET/api/v1/users/profile-viewers/:id
userRouter.get('/profile-viewers/:id',isLogin, whoViewedMyProfileCtrl);

//GET/api/v1/users/following/:id
userRouter.get('/following/:id',isLogin, followingCtrl);

//GET/api/v1/users/unfollow/:id
userRouter.get('/unfollow/:id',isLogin, unFollowCtrl);



//GET/api/v1/users/block/:id
userRouter.get('/block/:id',isLogin,blockUserCtrl);



//GET/api/v1/users/unblock/:id
userRouter.get('/unblock/:id',isLogin,unBlockUserCtrl);



// //PUT/api/v1/users/adminblock/:id
// userRouter.put('/adminblock/:id',isLogin,isAdmin,adminBlockUserCtrl);



// //PUT/api/v1/users/admin-unblock/:id
// userRouter.put('/admin-unblock/:id',isLogin,isAdmin,adminUnBlockUserCtrl); 

//GET/api/v1/users
userRouter.get('/', allUserCtrl);

//GET/api/v1/users/profile/:id
userRouter.get('/profile/', isLogin, profileUserCtrl);



//PUT/api/v1/users/
userRouter.put('/',isLogin, updateUserCtrl);

//PUT/api/v1/users/update-password
userRouter.put('/update-password',isLogin, updatePasswordCtrl);

//DELETE/api/v1/users/delete-account
userRouter.delete('/delete-account', isLogin,deleteUserAccountCtrl);

//POST/api/v1/users/profile-photo
userRouter.post('/profile-photo-upload',isLogin,upload.single("profile"), profilePhotoUploadCtrl);

module.exports = userRouter;
