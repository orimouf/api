const router = require("express").Router()
const Order = require("../models/Order")
const Client = require("../models/Client")
const verify = require("../verifyToken")
const mongoose = require("mongoose")

// CREATE

router.post("/", verify, async (req, res) => {
    if(req.user.isAdmin) {
        const newOrder = new Order(req.body)

        try {
            const savedOrder = await newOrder.save()
            res.status(200).json(savedOrder)
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(500).json("you are not allowed!")
    }
})

//UPDATE

router.put("/:id", verify, async (req, res) => {
    console.log("0000000000");
    // if(req.user.isAdmin) {
        try {
            console.log("111111111");
            const newData = {
                clientName: req.body.clientName,
                clientId: new mongoose.mongo.ObjectId(req.body.clientId),
                totalToPay: req.body.totalToPay,
                verssi: req.body.verssi,
                rest: req.body.rest,
                date: req.body.date,
                camion: req.body.camion,
                isCheck: req.body.isCheck,
                isCredit: req.body.isCredit
            }
            console.log("333333333333");
            const updatedOrder = await Order.findByIdAndUpdate(
                req.params.id, 
                { $set: newData },
                { new: true }
            )
            console.log("44444444444");
            res.status(201).json(updatedOrder);
        } catch (err) {
            console.log("-----------");
            res.status(500).json(err)
        }
    // } else {
    //     res.status(500).json("you are not allowed!")
    // }
})

//DELETE

router.delete("/:id", async (req, res) => {
    // if(req.user.isAdmin) {
        try {
            await Order.findByIdAndDelete(req.params.id)
            res.status(200).json("The Order has been deleted...")
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
        const order = await Order.findById(req.params.id)
        res.status(200).json(order)
    } catch (err) {
        res.status(500).json(err)
    }
})

//GET RANDOM

router.get("/random", verify, async (req, res) => {
    const type = req.query.type
    let orders
    try {
        if (type === "promo") {
            orders = await Order.aggregate([
              {$match: { isPromo: true} },
              { $sample: { size: 10 } },
          ])
        } else {
            orders = await Order.aggregate([
                {$match: { isPromo: false} },
                { $sample: { size: 10 } },
            ])
        }
        res.status(200).json(orders)
    } catch (err) {
        res.status(500).json(err)
    }
})

//GET ALL orders AND orderedProduct JOIN

router.get("/ordresJoin/:type/:value", async (req, res) => {
    // if(req.user.isAdmin) {
    var match
        try {

            // const orders = await Order.find()
            if(req.params.type === "date") { match = { $match : { date : req.params.value } } } 
            else if(req.params.type === "clientName") { match = { $match : { clientName : req.params.value } } } 
            else if(req.params.type === "clientId") { 
                const propertyId = req.params.value;
                const ObjectId = require('mongoose').Types.ObjectId;
                const objectId = new ObjectId(propertyId);
                match = { $match : { clientId : objectId } } 
            } else { res.status(500).json(err) }

            Order.aggregate([
                match,
                {
                $lookup: {
                    from: "orderedproducts", // collection name in db
                    localField: "productListId",
                    foreignField: "_id",
                    as: "productsOrdered"
                }
            }]).exec(function(err, orders) {
                // students contain WorksnapsTimeEntries
                let arr = []
                Promise.all(orders.map( async order => {
                    const client = await Client.findOne({ "_id": order.clientId})
                    .catch(function (err) {
                        res.status(422).json(err)
                    });
                    order.clientPrices = client.prices
                })).then(results => { res.status(200).json({ orders })})
                .catch(function (err) {
                    res.status(505).json(err)
                });
            });
            
        } catch (err) {
            res.status(400).json(err)
        }
    // } else {
    //     res.status(500).json("you are not allowed!")
    // }
})

//GET ALL

router.get("/", async (req, res) => {
    // if(req.user.isAdmin) {
        try {
            const orders = await Order.find()
            res.status(200).json({ orders })
        } catch (err) {
            res.status(500).json(err)
        }
    // } else {
    //     res.status(500).json("you are not allowed!")
    // }
})

module.exports = router