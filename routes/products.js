const router = require("express").Router()
const Product = require("../models/Product")
const Client = require("../models/Client")
const verify = require("../verifyToken")

// CREATE

router.post("/", async (req, res) => { //verify
    // if(req.user.isAdmin) {
        const newProduct = new Product(req.body)
        var lll = false

        try {
            const savedProduct = await newProduct.save()

            const getAllClients = await Client.findById("6877f12775df58cbeade2f9f")

            console.log(getAllClients);
            
            // getAllClients.map( async client => {

                getAllClients.prices += `:${savedProduct._id}*${savedProduct.price}`
                lll = true
                
                const updateClient = await Client.findByIdAndUpdate(getAllClients._id, 
                    {
                        $set:getAllClients,
                    },
                    { new: true }
                )
            // }). catch (err => {
            //     res.status(400).json(err)
            // }) 

            if (lll) {
                res.status(200).json(savedProduct)
            } else {
                res.status(403).json("savedProduct")
            }
            
        } catch (err) {
            res.status(500).json(err)
        }
    // } else {
        // res.status(500).json("you are not allowed!")
    // }
})

//UPDATE

router.put("/:id", verify, async (req, res) => {
    if(req.user.isAdmin) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(
                req.params.id, 
                { $set: req.body },
                { new: true }
            )
            res.status(200).json(updatedProduct)
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
            await Product.findByIdAndDelete(req.params.id)
            res.status(200).json("The product has been deleted...")
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
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    } catch (err) {
        res.status(500).json(err)
    }
})

//GET RANDOM

router.get("/random", verify, async (req, res) => {
    const type = req.query.type
    let products
    try {
        if (type === "promo") {
            products = await Product.aggregate([
              {$match: { isPromo: true} },
              { $sample: { size: 10 } },
          ])
        } else {
            products = await Product.aggregate([
                {$match: { isPromo: false} },
                { $sample: { size: 10 } },
            ])
        }
        res.status(200).json(products)
    } catch (err) {
        res.status(500).json(err)
    }
})

//GET ALL

router.get("/", async (req, res) => {
    // if(req.user.isAdmin) {
        try {
            const products = await Product.find()
            res.status(200).json({ products })
        } catch (err) {
            res.status(500).json(err)
        }
    // } else {
    //     res.status(500).json("you are not allowed!")
    // }
})

module.exports = router