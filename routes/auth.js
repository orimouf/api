const router = require("express").Router()
const User = require("../models/User")
const Client = require("../models/Client")
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")

//REGISTER
router.post("/register", async (req, res) => {
    res.status(201).json({
        status: 1,
        message: "Registration Successful",
        data: {
            
        }
    })

    const newUser = new User({
        appId: req.body.appId,
        username: req.body.username,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.SECRET_KEY
            ).toString(),
        email: req.body.email
    })

    try{
        const usernameCheck = await User.findOne({ username: req.body.username})
        usernameCheck && res.status(201).json({
            status: 0,
            message: "Username already exist."
        })

        const emailCheck = await User.findOne({ email: req.body.email})
        emailCheck && res.status(201).json({
            status: 0,
            message: "Email already exist."
        })

        const user = await newUser.save()
        res.status(201).json({
            status: 1,
            message: "Registration Successful",
            data: {
                user
            }
        })
    } catch (err) {
        res.status(500).json(err)
    }
    
})

//LOGIN
router.post("/login", async (req, res) => {
    try{
        const user = await User.findOne({ email: req.body.email})
        !user && res.status(401).json({
            status: 2,
            message: "Wrong password or username!",
        })

        const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY )
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8)

        originalPassword !== req.body.password &&
            res.status(401).json({
                status: 2,
                message: "Wrong password or username!",
            })

        const accessToken = jwt.sign(
            {id: user._id, isAdmin: user.isAdmin},
            process.env.SECRET_KEY,
            {expiresIn: "5d"}
        )

        const { password, ...info } = user._doc
        // res.status(200).json({...info, accessToken})
        res.status(200).json({
            status: 1,
            message: "Login Successful",
            data: {
                ...info, accessToken
            }
        })
    } catch(err) {
        res.status(500).json(err)
    }
})

//GET PROFILE
router.post("/getprofile", async (req, res) => {
    try{
        const user = await User.findOne({ _id: req.body.user_id})
        !user && res.status(401).json("Wrong id!")

        const { password, ...info } = user._doc

        res.status(200).json({
            status: 1,
            message: "Get Profile Successful",
            data: {
                ...info
            }
        })
    } catch(err) {
        res.status(500).json(err)
    }
})

module.exports = router