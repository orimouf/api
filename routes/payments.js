const router = require("express").Router()
const Payment = require("../models/Payment")
const verify = require("../verifyToken")

// CREATE

router.post("/", verify, async (req, res) => {
    if(req.user.isAdmin) {
        const newPayment = new Payment(req.body)

        try {
            const savedPayment = await newPayment.save()
            res.status(200).json(savedPayment)
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(500).json("you are not allowed!")
    }
})

//UPDATE

router.put("/:id", verify, async (req, res) => {
    if(req.user.isAdmin) {
        try {
            const updatedPayment = await Payment.findByIdAndUpdate(
                req.params.id, 
                { $set: req.body },
                { new: true }
            )
            res.status(200).json(updatedPayment)
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(500).json("you are not allowed!")
    }
})

//DELETE

router.delete("/:id", verify, async (req, res) => {
    if(req.user.isAdmin) {
        try {
            await Payment.findByIdAndDelete(req.params.id)
            res.status(200).json("The Payment has been deleted...")
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(500).json("you are not allowed!")
    }
})

//GET

router.get("/find/:id", verify, async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
        res.status(200).json(payment)
    } catch (err) {
        res.status(500).json(err)
    }
})

//GET RANDOM

router.get("/random", verify, async (req, res) => {
    const type = req.query.type
    let payments
    try {
        if (type === "promo") {
            payments = await Payment.aggregate([
              {$match: { isPromo: true} },
              { $sample: { size: 10 } },
          ])
        } else {
            payments = await Payment.aggregate([
                {$match: { isPromo: false} },
                { $sample: { size: 10 } },
            ])
        }
        res.status(200).json(payments)
    } catch (err) {
        res.status(500).json(err)
    }
})

//GET ALL IN SAME DATE

router.get("/date/:date", async (req, res) => {
    const query = req.query.new
    // if(req.user.isAdmin) {
        try {
            const payments = query ? await Payment.find({ date : req.params.date }).sort({_id: -1}).limit(10) : await Payment.find({ date : req.params.date })
            res.status(200).json({ payments })
        } catch (err) {
            res.status(500).json(err)
        }
    // } else {
    //     res.status(500).json("you are not allowed!")
    // }
})

//GET ALL

router.get("/", async (req, res) => {
    const query = req.query.new
    // if(req.user.isAdmin) {
        try {
            const payments = query ? await Payment.find().sort({_id: -1}).limit(10) : await Payment.find()
            res.status(200).json({ payments })
        } catch (err) {
            res.status(500).json(err)
        }
    // } else {
    //     res.status(500).json("you are not allowed!")
    // }
})

module.exports = router