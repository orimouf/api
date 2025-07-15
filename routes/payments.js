const router = require("express").Router()
const Payment = require("../models/Payment")
const verify = require("../verifyToken")
const mongoose = require("mongoose")

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

router.put("/:id", async (req, res) => {
    // if(req.user.isAdmin) {
        try {

            const newData = {
                clientName: req.body.clientName,
                clientId: new mongoose.mongo.ObjectId(req.body.clientId),
                oldSomme: req.body.totalToPay,
                verssi: req.body.verssi,
                rest: req.body.rest,
                date: req.body.date,
                camion: req.body.camion,
                isCheck: req.body.isCheck,
            }
            const updatedPayment = await Payment.findByIdAndUpdate(
                req.params.id, 
                { $set: newData },
                { new: true }
            )
            res.status(200).json(updatedPayment)
        } catch (err) {
            res.status(500).json(err)
        }
    // } else {
    //     res.status(500).json("you are not allowed!")
    // }
})

//DELETE

router.delete("/:id", async (req, res) => { //, verify
    // if(req.user.isAdmin) {
        try {
            await Payment.findByIdAndDelete(req.params.id)
            res.status(200).json("The Payment has been deleted...")
        } catch (err) {
            res.status(500).json(err)
        }
    // } else {
    //     res.status(500).json("you are not allowed!")
    // }
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

router.get("/:type/:value", async (req, res) => {
    const query = req.query.new
    var match
    
    if(req.params.type === "date") { match = { date : req.params.value } } 
    else if(req.params.type === "clientName") { match = { clientName : req.params.value } } 
    else if(req.params.type === "clientId") { 
        const propertyId = req.params.value;
        const ObjectId = require('mongoose').Types.ObjectId;
        const objectId = new ObjectId(propertyId);
        match = { clientId : objectId }
    } else { res.status(500).json(err) }
    // if(req.user.isAdmin) {
        try {
            const payments = query ? await Payment.find(match).sort({_id: -1}).limit(10) : await Payment.find(match)
            console.log(payments.clientName);
            
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