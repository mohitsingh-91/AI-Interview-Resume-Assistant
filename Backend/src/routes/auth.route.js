const express= require('express');
const{registerUserController,loginUserController,logoutUserController,getUserController}=require("../controllers/auth.controller");
const {authUser,attachUserIfPresent}=require("../middlewares/auth.middleware");
const router=express.Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 */
router.post("/register",registerUserController);


/**
 * @route POST /api/auth/login
 * @description login user with email and password
 */
router.post("/login",loginUserController);


/**
 * @route POST /api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 */
router.post("/logout",logoutUserController);


/**
 * @route GET /api/auth/getUser
 * @description get the current logged in user details
 */
router.get("/getUser",attachUserIfPresent,getUserController);

module.exports = router;