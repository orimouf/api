const router = require("express").Router()
const OrderedProduct = require("../models/OrderedProduct")
const verify = require("../verifyToken")

// CREATE

router.post("/", verify, async (req, res) => {
    if(req.user.isAdmin) {
        const newOrderedProduct = new OrderedProduct(req.body)

        try {
            const savedOrderedProduct = await newOrderedProduct.save()
            res.status(200).json(savedOrderedProduct)
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
            const updatedOrderedProduct = await OrderedProduct.findByIdAndUpdate(
                req.params.id, 
                { $set: req.body },
                { new: true }
            )
            res.status(200).json(updatedOrderedProduct)
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(500).json("you are not allowed!")
    }
})

//DELETE

router.delete("/:id", async (req, res) => {
    // if(req.user.isAdmin) {
        try {
            await OrderedProduct.findByIdAndDelete(req.params.id)
            res.status(200).json("The OrderedProduct has been deleted...")
        } catch (err) {
            res.status(500).json(err)
        }
    // } else {
    //     res.status(500).json("you are not allowed!")
    // }
})

//GET

router.get("/find/:id", async (req, res) => {
    try {
        const orderedProduct = await OrderedProduct.findById(req.params.id)
        res.status(200).json(orderedProduct)
    } catch (err) {
        res.status(500).json(err)
    }
})

//GET RANDOM

router.get("/random", verify, async (req, res) => {
    const type = req.query.type
    let orderedProducts
    try {
        if (type === "promo") {
            orderedProducts = await OrderedProduct.aggregate([
              {$match: { isPromo: true} },
              { $sample: { size: 10 } },
          ])
        } else {
            orderedProducts = await OrderedProduct.aggregate([
                {$match: { isPromo: false} },
                { $sample: { size: 10 } },
            ])
        }
        res.status(200).json(OrderedProducts)
    } catch (err) {
        res.status(500).json(err)
    }
})

//GET ALL

router.get("/", async (req, res) => {
    // if(req.user.isAdmin) {
        try {
            const orderedProducts = await OrderedProduct.find()
            res.status(200).json({ orderedProducts })
        } catch (err) {
            res.status(500).json(err)
        }
    // } else {
    //     res.status(500).json("you are not allowed!")
    // }
})

module.exports = router