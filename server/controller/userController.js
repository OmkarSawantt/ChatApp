const User = require("../models/UserModel");
const bcryptjs = require('bcryptjs')
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const { encryptData, decryptData , generateKeyPair } = require("../helpers/cryptoUtilsServer");

//register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const cheackEmail = await User.findOne({ email })
        if (cheackEmail) {
            return res.status(400).json({
                message: "User Already Exsist",
                error: true
            })
        }
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const { publicKey, privateKey } = generateKeyPair();
        const private_key=encryptData(privateKey)

        const payLoad = {
            name,
            email,
            password: hashedPassword,
            public_key:publicKey,
            private_key
        }
        const user = new User(payLoad)
        const userSave = await user.save()
        if (userSave) {
            return res.status(201).json({
                message: "User Created Successfully",
                data: userSave,
                success: true
            })
        } else {
            return res.status(400).json({
                message: "Something went Wrong",
                error: true
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}
//checkEmail
const cheackEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const cheackEmail = await User.findOne({ email }).select("-password")
        if (!cheackEmail) {
            return res.status(400).json({
                message: "User not Exsist",
                error: true
            })
        }
        return res.status(200).json({
            message: "email verified",
            success: true,
            data: cheackEmail
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}
//cheack Password
const checkPassword = async (req, res) => {
    try {
        const { userID, password } = req.body;
        const user = await User.findById(userID)
        const verifyPass = await bcryptjs.compare(password, user.password)
        if (!verifyPass) {
            return res.status(400).json({
                message: "Please Check Password",
                error: true
            })
        } else {
            const tokendata = {
                id: user._id,
            }
            const token = jwt.sign(tokendata, process.env.JWT_SECREAT_KEY, { expiresIn: '10y' })
            const cookieOptions = {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000)
            };

            return res.cookie('token', token, cookieOptions).status(200).json({
                message: "You have been successfully logged in!",
                token: token,
                success: true
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}
//UserDetail
const userDetails = async (req, res) => {
    try {

        const token = req.cookies.token || ""
        if (!token) {
            return res.json({
                message: "User not Loged in",
                logout: true,
            })
        }
        const userID = await getUserDetailsFromToken(token)
        const user = await User.findById(userID).select('-password')
        const decryptedPrivateKey = decryptData(user.private_key);
        return res.status(200).json({
            message: "User Details",
            data: {
                ...user.toObject(),
                private_key: decryptedPrivateKey,
            },
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}
//Logout
const logout = async (req, res) => {
    try {
        const cookieOptions = {
            http: true,
            secure: true,
            expires: new Date(0)
        }
        return res.cookie('token', '', cookieOptions).status(200).json({
            message: "You have successfully logged out!",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}
//update profile_pic
const updateProfilePic = async (req, res) => {
    try {
        const { profile_pic } = req.body;
        const token = req.cookies.token || ""
        const userID = await getUserDetailsFromToken(token)
        if (!profile_pic) {
            return res.status(500).json({
                message: "Image not found",
                error: true
            })
        }
        const updateUser=await User.findByIdAndUpdate(userID,{ profile_pic: profile_pic },{ new: true })
        return res.json({
            message: "Profile Pic is Updated",
            data: { user: updateUser },
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}
//Update User details
const updateUser = async (req, res) => {
    try {
        const token = req.cookies.token || ""
        const user = await getUserDetailsFromToken(token)
        const { name, email, password } = req.body;
        const updates = {};
        if (name) {
            updates.name = name;
        }
        if (email) {
            updates.email = email;
        }
        if (password) {
            const salt = await bcryptjs.genSalt(10)
            const hashedPassword = await bcryptjs.hash(password, salt)
            updates.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(user, updates, { new: true });
        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
                error: true
            });
        }

        return res.status(200).json({
            message: "User information updated successfully",
            user: updatedUser,
            error: false
        });



    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}
const searchUser = async (req, res) => {
    try {
        const { search } = req.body;
        const query = new RegExp(search, 'i', 'g')
        const user = await User.find({
            '$or': [
                { name: query },
                { email: query }
            ]
        }).select("-password")

        return res.json({
            message: 'all user',
            data: user,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}


module.exports = { registerUser, cheackEmail, checkPassword, userDetails, logout, updateProfilePic, updateUser, searchUser }