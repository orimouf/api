const router = require("express").Router()
const Fridge = require("../models/Fridge")
const Client = require("../models/Client")
const verify = require("../verifyToken")
const mongoose = require("mongoose")

// CREATE

router.post("/", async (req, res) => {
    // if(req.user.isAdmin) {
        const newFridge = new Fridge(req.body)

        try {
            const savedFridge = await newFridge.save()
            res.status(200).json(savedFridge)
        } catch (err) {
            res.status(500).json(err)
        }
    // } else {
    //     res.status(500).json("you are not allowed!")
    // }
})

//UPDATE

router.put("/:id", async (req, res) => {
    // if(req.user.isAdmin) {
        try {

            const newData = {
                clientName: req.body.clientName,
                clientId: new mongoose.mongo.ObjectId(req.body.clientId),
                totalFridgePrice: req.body.totalToPay,
                paymentFridgePrice: req.body.verssi,
                restFridgePrice: req.body.rest,
                date: req.body.date,
                camion: req.body.camion,
                isCheck: req.body.isCheck,
            }
            const updatedFridge = await Fridge.findByIdAndUpdate(
                req.params.id, 
                { $set: newData },
                { new: true }
            )
            res.status(200).json(updatedFridge)
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
            await Fridge.findByIdAndDelete(req.params.id)
            res.status(200).json("The Fridge payment has been deleted...")
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
        const fridge = await Fridge.findById(req.params.id)
        res.status(200).json(fridge)
    } catch (err) {
        res.status(500).json(err)
    }
})

//GET RANDOM

router.get("/random", verify, async (req, res) => {
    const type = req.query.type
    let fridges
    try {
        if (type === "promo") {
            fridges = await Fridge.aggregate([
              {$match: { isPromo: true} },
              { $sample: { size: 10 } },
          ])
        } else {
            fridges = await Fridge.aggregate([
                {$match: { isPromo: false} },
                { $sample: { size: 10 } },
            ])
        }
        res.status(200).json(fridges)
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
            const fridges = query ? await Fridge.find(match).sort({_id: -1}).limit(10) : await Fridge.find(match)
            console.log(fridges.clientName);
            
            res.status(200).json({ fridges })
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
            // const fridges = query ? await Fridge.find().sort({_id: -1}).limit(10) : await Fridge.find()

            Client.aggregate([
                            {
                               $lookup:{
                                    from: "fridges", // collection name in db
                                    localField: "_id",
                                    foreignField: "clientId",
                                    as: "fridgesPayments"
                               }
                            }
                         ]).exec(function(err, fridges) {
                            // students contain WorksnapsTimeEntries
                            var Data = fridges.filter( e => e.fridgesPayments.length != 0)
                            Promise.all(Data.map( async (receive, i) => {
                                const initialValue = 0;
                                receive.appId = i+1
                                receive['totalFridgeCapital'] = receive.fridgesPayments[0].totalFridgePrice,
                                receive['totalPayments'] = receive.fridgesPayments.map( e => parseFloat(e.paymentFridgePrice)).reduce((a, b) =>  a + b, initialValue),
                                receive['totalCredit'] = receive.fridgesPayments[0].totalFridgePrice - receive.fridgesPayments.map( e => parseFloat(e.paymentFridgePrice)).reduce((a, b) =>  a + b, initialValue)
                            })).then(results => { 
                                res.status(200).json({ Data })})
                            .catch(function (err) {
                                res.status(505).json(err)
                            });
                        });
            // Promise.all(fridges.map( async (fridgesPayments, i) => {
            //         const initialValue = 0;
            //         fridgesPayments.appId = i+1,
            //         fridgesPayments['totalCapital'] = fridgesPayments.orders.map( e => parseFloat(e.totalToPay)).reduce((a, b) =>  a + b, initialValue),
            //         fridgesPayments['totalPayments'] = fridgesPayments.payments.map( e => parseFloat(e.verssi)).reduce((a, b) =>  a + b, initialValue),
            //         fridgesPayments['totalCredit'] = fridgesPayments.orders.map( e => parseFloat(e.rest)).reduce((a, b) =>  a + b, initialValue) - fridgesPayments.payments.map( e => parseFloat(e.verssi)).reduce((a, b) =>  a + b, initialValue),
            //         fridgesPayments['totalBonOrders'] = fridgesPayments.orders.length,
            //         fridgesPayments['totalBonPayments'] = fridgesPayments.payments.length
            //     })).then(results => { 
            //         res.status(200).json({ orders })})
            //     .catch(function (err) {
            //         res.status(505).json(err)
            //     });
            // res.status(200).json({ fridges })
        } catch (err) {
            res.status(500).json(err)
        }
    // } else {
    //     res.status(500).json("you are not allowed!")
    // }
})

module.exports = router