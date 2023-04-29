const bcrypt = require("bcryptjs")
const storage = require("../../config/cloudinary")
const User = require("../../model/User/User");
const generateToken = require("../../utils/generateToken");
const getTokenFromHeader = require("../../utils/getTokenFromHeader");
const appErr = require("../../utils/appErr");
const Post = require("../../model/Post/Post");
const Comment = require('../../model/Comment/Comment')
const Category = require('../../model/Category/Category');
const multer = require("multer");
const mongoose = require('mongoose');

//Register user
const userRegisterCtrl = async (req, res, next) => {
    const {
        firstname,
        lastname,
        email,
        password
    } = req.body;
    //Check email 
    try {
        const userFound = await User.findOne({
            email
        })
        if (userFound) {
            return next(appErr("User Already Exits", 500));
        }

        // hash password 
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt);
        //Create User
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashPassword,
        })
        res.json({
            status: "success",
            data: user,
        })
    } catch (error) {
        next(appErr(error.message, 500));
    }
}
//Login User
const userLoginCtrl = async (req, res,next) => {
    const {
        email,
        password
    } = req.body;

    try {
        //check email exists
        const userFound = await User.findOne({
            email
        });
        if (!userFound) {
          next(appErr("Invalid User Credentials"));
        }

        //validate password
        const isPasswordMatched = await bcrypt.compare(password, userFound.password);

        if (!isPasswordMatched) {
            next(appErr("Invalid User Credentials"));
        }
        res.json({
            status: "success",
            data: {
                firstname: userFound.firstname,
                lastname: userFound.lastname,
                email: userFound.email,
                isAdmin: userFound.isAdmin,
                token: generateToken(userFound._id)
            },
        })
    } catch (error) {
       return  next(appErr("Invalid User Credentials"));
    }
}

//Who view my profile
const whoViewedMyProfileCtrl = async (req, res, next) => {
    try {
        //1. Find the original user
        const user = await User.findById(req.params.id);
        //2. Find the user who viewed the original user
        const userWhoViewed = await User.findById(req.userAuth);

        //3. Check original and who viewed are found
        if (user && userWhoViewed) {
            //4. check if userWhoViewed is already in the users viewers array 
            const isUserAlreadyViewed = user.viewers.find(
                viewer => viewer.toString() === userWhoViewed._id.toJSON());

            //5. if user already viewed
            if (isUserAlreadyViewed) {
                return next(appErr("You already viewed this profile"));
            } else {
                //6. Push the userWhoViewed to the original users array
                user.viewers.push(userWhoViewed._id);
                //7. Save the original user
                await user.save();
                res.json({
                    status: "success",
                    data: "You successfully view the profile"
                })
            }
        }

    } catch (error) {
       next(appErr(error.message));
    }
}

//Following 
const followingCtrl = async (req, res, next) => {
    try {
        //1. Find the user to follow
        const userToFollow = await User.findById(req.params.id);
        //2. Find the user who is following
        const userWhoFollowed = await User.findById(req.userAuth);

        //3. Check if user and userWhoFollowed is found
        if (userToFollow && userWhoFollowed) {
            //4. check if userWhofollowed is already in the users followers array
            const isUserAlreadyFollowed = userToFollow.following.find(follower => follower.toString() === userWhoFollowed.id.toString());
            if (isUserAlreadyFollowed) {
                return next(appErr("You Already followed this user"))
            } else {
                //5. Push userwhofollowed into the user followers  array 
                userToFollow.followers.push(userWhoFollowed._id);
                //6. Push userToFollow  to the userWhoFollowed following array 
                userWhoFollowed.following.push(userToFollow._id);

                //7. Save
                await userWhoFollowed.save();
                await userToFollow.save();
                res.json({
                    status: "success",
                    data: "You have successfully followed this user"
                })
            }
        }

    } catch (error) {
        next(appErr(error.message));
    }
}

//UnFollow
const unFollowCtrl = async (req, res, next) => {
    try {
        //1. Find the user to unfollow
        const userToBeUnfollowed = await User.findById(req.params.id);
        //2. Find the user who is unfollowing
        const userWhoUnFollowed = await User.findById(req.userAuth);

        //3. Check if user and userWhoFollowed is found
        if (userToBeUnfollowed && userWhoUnFollowed) {
            //4. check if userWhoUnfollowed is already in the users followers array
            const isUserAlreadyFollowed = userToBeUnfollowed.followers.find(follower => follower.toString() === userWhoUnFollowed.id.toString());
            if (!isUserAlreadyFollowed) {
                return next(appErr("You have not followed this user"))
            } else {
                //5. Remove userWhoUnFollowed from the user followers array
                userToBeUnfollowed.followers = userToBeUnfollowed.followers.filter(follower => follower.toString() !== userWhoUnFollowed._id.toString());
                //6. Save
                await userToBeUnfollowed.save();
                //7. Remove userToBeUnfollowed from the userWhoUnfollowed following
                userWhoUnFollowed.following = userWhoUnFollowed.following.filter(following => following.toString() !== userToBeUnfollowed._id.toString());

                //8. Save the user
                await userWhoUnFollowed.save();
                res.json({
                    status: "success",
                    data: "You have successfully unfollowed this user"
                })
            }

        }
    } catch (error) {
        next(appErr(error.message));
    }
}


//Blocked User
const blockUserCtrl = async (req, res, next) => {
    try {
        //1. Find the user to blocked
        const userToBeBlocked = await User.findById(req.params.id);
        //2. Find the user who is blocking
        const userWhoBlocked = await User.findById(req.userAuth);
        //3. Check if user and userWhoFollowed is found
        if (userToBeBlocked && userWhoBlocked) {
            //4. check if userWhoUnfollowed is already in the users followers array
            const isUserAlreadyBlocked = userToBeBlocked.blocked.find(blocked => blocked.toString() === userWhoBlocked._id.toString());
            if (isUserAlreadyBlocked) {
                return next(appErr("You already blocked this user"))
            } else {

                //7. Push userToBeBlocked  to the userWhoBlocked blocked array 
                userWhoBlocked.blocked.push(userToBeBlocked._id);
                //8. save
                await userWhoBlocked.save();
                res.json({
                    status: "success",
                    data: "You have successfully blocked this user"
                })
            }

        }
    } catch (error) {
        next(appErr(error.message));
    }
}

//Unblock Users
const unBlockUserCtrl = async (req, res, next) => {
    try {
        //1. Find the user to unblock
        const userToBeUnBlocked = await User.findById(req.params.id);
        //2. Find the user who is blocking
        const userWhoUnBlocked = await User.findById(req.userAuth);
        //3. Check if user and userWhoFollowed is found
        if (userToBeUnBlocked && userWhoUnBlocked) {
            //4. check if userWhoUnfollowed is already in the users followers array
            const isUserAlreadyBlocked = userWhoUnBlocked.blocked.find(blocked => blocked.toString() === userToBeUnBlocked._id.toString());
            if (!isUserAlreadyBlocked) {
                return next(appErr("You have not  blocked this user"))
            }
            // 7. Remove the userToBeUnblocked from the main user
            userWhoUnBlocked.blocked = userWhoUnBlocked.blocked.filter(blocked => blocked.toString() !== userToBeUnBlocked._id.toString());
            //8. save
            await userWhoUnBlocked.save();
                //7. Push userToBeBlocked  to the userWhoBlocked blocked array 
                userWhoUnBlocked.blocked.push(userToBeUnBlocked._id);

                res.json({
                    status: "success",
                    data: "You sucessfully unblock this user"
                })
            
        }
    } catch (error) {
        next(appErr(error.message));
    }
}

// //Admin Blocked 
// const adminBlockUserCtrl = async (req, res, next) => {
//     try {
//         //1. find the user to be unblocked by admin
//         const userToBeBlocked = await User.findById(req.params.id)
//         //2. check if user found
//         if(!userToBeBlocked)
//         {
//             return next(appErr("User not Found"))
//         }
//         //change the isblocked to be true
//         userToBeBlocked.isBlocked = true;
//         //save
//         await userToBeBlocked.save();
//         res.json({
//             status: "success",
//             data: "You have successfully blocked this user"
//         })
//     } catch (error) {
//         res.json(error.message);
//     }
// }

// //Admin unBlocked 
// const adminUnBlockUserCtrl = async (req, res, next) => {
//     try {
//         //1. find the user to be unblocked 
//         const userToBeUnBlocked = await User.findById(req.params.id)
//         //2. check if user found
//         if(!userToBeUnBlocked)
//         {
//             return next(appErr("User not Found"))
//         }
//         //change the isblocked to be false
//         userToBeUnBlocked.isBlocked = false;
//         //save
//         await userToBeUnBlocked.save();
//         res.json({
//             status: "success",
//             data: "You have successfully Unblocked this user"
//         })
//     } catch (error) {
//         res.json(error.message);
//     }
// }




//All Users
const allUserCtrl = async (req, res) => {
    try {
        const users= await User.find()
        res.json({
            status: "success",
            data: users,
        })
    } catch (error) {
        next(appErr(error.message));
    }
}

//Profile User
const profileUserCtrl = async (req, res) => {
    try {
        const user = await User.findById(req.userAuth);
        

        res.json({
            status: "success",
            data: user,
        })
    } catch (error) {
        next(appErr(error.message));
    }
}
//Delete User Account
const deleteUserAccountCtrl = async (req, res,next) => {
    try {
        //find the user to be deleted
        const userTodelete = await User.findById(req.userAuth);
        //find all post to be deleted
        await Post.deleteMany({user: req.userAuth});
        //Delete all comments of user
        await Comment.deleteMany({user: req.userAuth});
        //Delete all category
        await Category.deleteMany({user: req.userAuth});

        // await userTodelete.deleteMany({});
        //Response
        res.json({
            status: "success",
            data: "Your account has been delted successfully"
        })
    } catch (error) {
        next(appErr(error.message));
    }
}

//Update User
const updateUserCtrl = async (req, res, next) => {
    const {email, lastname,firstname}= req.body;
    try {
        //check if email is not taken somebody
        if(email){
            const emailTaken = await User.findOne({email});
            if(emailTaken){
                return next(appErr("Email is Taken", 400));
            }
        }
            //update the user 
            const user = await User.findByIdAndUpdate(req.userAuth,{
                firstname,
                lastname,
                email,
            }, {
                new: true,
                runValidators: true,
            }
            );
            //send response
            res.json({
                status: "success",
                data: user,
            });
        }
         catch (error) {
            next(appErr(error.message));
    }
};

//Update Password
const updatePasswordCtrl = async (req, res,next) => {
    const {password} = await req.body;
    try {
        //Check if user is updating  the password
        if(password)
        {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);
            //update user
            await User.findByIdAndUpdate(
                req.userAuth,
                {password: hashedPassword},
                {new: true , runValidators: true}
            );
            res.json({
                status: "success",
                data: "Password has been changed successfully",
            });
        }
        else {
            return next(appErr("Please provide password feild"))
        }
       
    } catch (error) {
        next(appErr(error.message));
    }
}

//Profile Photo Upload
const profilePhotoUploadCtrl = async (req, res, next) => {

    try {
        //1.  Find the User to be Updated
        const userToUpdate = await User.findById(req.userAuth);
        //2. check if user is found

        if (!userToUpdate) {
            return next(appErr("User not found", 404))
        }
        //3. check if user is blocked

        if (userToUpdate.isBlocked) {
            return next(appErr("Action not allowed, Your account is blocked", 404))
        }
        //4. check if user is updating their photo
        if (req.file) {
            //5. update profile photo
            await User.findByIdAndUpdate(req.userAuth, {
                $set: {
                    profilePhoto: req.file.path,
                }
            }, {
                new: true,
            });
            res.json({
                status: "success",
                data: "You have Successfully updated your profile photo",
            });
        }
    } catch (error) {
        next(appErr(error.message, 500));
    }
};

module.exports = {
    userRegisterCtrl,
    userLoginCtrl,
    allUserCtrl,
    profileUserCtrl,
    updateUserCtrl,
    profilePhotoUploadCtrl,
    whoViewedMyProfileCtrl,
    followingCtrl,
    unFollowCtrl,
    blockUserCtrl,
    deleteUserAccountCtrl,
    unBlockUserCtrl,
    updatePasswordCtrl,
    // adminBlockUserCtrl,
    // adminUnBlockUserCtrl,

}