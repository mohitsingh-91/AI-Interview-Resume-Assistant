const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 */
exports.registerUserController=async (req, res)=>{
    try{
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide username, email and password"
            })
        }

        const isUserAlreadyExists = await userModel.findOne({
            $or: [ { username }, { email } ]
        })

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: "Account already exists with this email address or username"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hashPassword
        });

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" }
        );

        res.cookie("token", token,
            {
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
    })
    }catch (error) {
        console.error("Error while registering user:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }

}


/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 */
exports.loginUserController=async(req, res)=>{
    try{
         const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" }
        );

        res.cookie("token", token,
            {
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(200).json({
            message: "User loggedIn successfully.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    }catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
}
   
}


/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 */
exports.logoutUserController=async(req, res)=>{
    try{
         const token = req.cookies?.token;

        if (token) {
            await tokenBlacklistModel.create({ token });
        }
        res.clearCookie("token");

        res.status(200).json({
            message: "User logged out successfully"
        })
    }catch (error) {
        console.error("Error while logging out:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
   
}

/**
 * @name getUserController
 * @description get the current logged in user details.
 */
exports.getUserController=async(req, res)=>{
    try{
        if (!req.user) {
            return res.status(200).json({
                message: "No user logged in",
                user: null 
            });
        }

        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(200).json({
                message: "User not found",
                user: null
            });
        }

        res.status(200).json({
            message: "User details fetched successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    }catch (error) {
        console.error("Error while fetching user details:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}





