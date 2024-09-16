const router = require("express").Router()
const Facture = require("../models/Facture")
const CryptoJS = require("crypto-js")
const verify = require("../verifyToken")

// CREATE
router.post("/", async (req, res) => {
    // if(req.user.isAdmin) {
        const newFacture = new Facture(req.body)

        try {
            const savedFacture = await newFacture.save()
            res.status(200).json(savedFacture)
        } catch (err) {
            res.status(500).json(err)
        }
    // } else {
    //     res.status(500).json("you are not allowed!")
    // }
})

//UPDATE
router.put("/:id", verify, async (req, res) => {
    if(req.user.id === req.params.id || req.user.isAdmin) {
        if(req.body.password){
            req.body.password = CryptoJS.AES.encrypt(
                    req.body.password,
                    process.env.SECRET_KEY
                ).toString()
        }
        try {
            const updatedFacture = await Facture.findByIdAndUpdate(req.params.id, 
                {
                    $set:req.body,
                },
                { new: true }
            )
            res.status(200).json(updatedFacture)
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(500).json("you can update only your account!")
    }
})

//DELETE
router.delete("/:id", verify, async (req, res) => {
    if(req.user.id === req.params.id || req.user.isAdmin) {
        try {
            await Facture.findByIdAndDelete(req.params.id)
            res.status(200).json("Facture has been deleted...")
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(500).json("you can delete only your account!")
    }
})

//GET FIND BY ID
router.get("/find/:id", async (req, res) => {
    try {
        const facture = await Facture.findByIdAndDelete(req.params.id)
        const { password, ...info } = facture._doc

        res.status(200).json(info)
    } catch (err) {
        res.status(500).json(err)
    }
})

//GET ALL
router.get("/", async (req, res) => {
    const query = req.query.new
    // if(req.user.isAdmin) {
        try {
            const factures = query ? await Facture.find().sort({_id: -1}).limit(10) : await Facture.find()
            res.status(200).json({ factures })
        } catch (err) {
            res.status(500).json(err)
        }
    // } else {
    //     res.status(500).json("you are not allowed to see all factures!")
    // }
})

//GET USER STATS
router.get("/stats", async (req, res) => {
    const today = new Date()
    const lastYear = today.setFullYear(today.setFullYear() - 1)

    const monthsArray = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]

    try {
        const data = await Facture.aggregate([
            {
                $project:{
                    month: {$month: "$createdAt"} // or $year
                }
            },{
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                }
            }
        ])
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router