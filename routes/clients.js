const router = require("express").Router()
const Client = require("../models/Client")
const CryptoJS = require("crypto-js")
const verify = require("../verifyToken")

// CREATE

router.post("/", async (req, res) => {
    // if(req.user.isAdmin) {
        const clientDataFromApp = req.body.data
        console.log(clientDataFromApp);
        

        let is_credit = clientDataFromApp.is_credit ? true : false
        let is_frigo = clientDataFromApp.is_frigo ? true : false
        let is_promo = clientDataFromApp.is_promo ? true : false

        const newClient = new Client ({
            appId: clientDataFromApp.id,
            clientName: clientDataFromApp.client_name,
            phone: clientDataFromApp.phone,
            region: clientDataFromApp.region,
            prices: clientDataFromApp.prices,
            oldCredit: clientDataFromApp.old_credit,
            isCredit: is_credit,
            isFrigo: is_frigo,
            isPromo: is_promo,
            camion: clientDataFromApp.camion,
            creditBon: clientDataFromApp.credit_bon,
            lastServe: clientDataFromApp.last_serve
        })
        
        try {
            const savedClient = await newClient.save()
            res.status(200).json({
                status: 1,
                message: "Client save Successful",
                data: savedClient
            })
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
            const updatedClient = await Client.findByIdAndUpdate(req.params.id, 
                {
                    $set:req.body,
                },
                { new: true }
            )
            res.status(200).json(updatedClient)
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
            await Client.findByIdAndDelete(req.params.id)
            res.status(200).json("Client has been deleted...")
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(500).json("you can delete only your account!")
    }
})

//GET

router.get("/find/:id", async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id)
        const { password, ...info } = client._doc

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
            const clients = query ? await Client.find().sort({_id: -1}).limit(10) : await Client.find()
            res.status(200).json({ clients })
        } catch (err) {
            res.status(500).json(err)
        }
    // } else {
    //     res.status(500).json("you are not allowed to see all clients!")
    // }
})

router.get("/ordresPayments", async (req, res) => {
    // if(req.user.isAdmin) {
        try {

            Client.aggregate([
                {
                   $lookup:{
                        from: "orders", // collection name in db
                        localField: "_id",
                        foreignField: "clientId",
                        as: "orders"
                   }
                },
                {
                   $lookup:{
                        from: "payments", // collection name in db
                        localField: "_id",
                        foreignField: "clientId",
                        as: "payments"
                   }
                }
             ]).exec(function(err, orders) {
                // students contain WorksnapsTimeEntries
                let array = []
                Promise.all(orders.map( async (receive, i) => {
                    const initialValue = 0;
                    receive.appId = i+1,
                    receive['totalCapital'] = receive.orders.map( e => parseFloat(e.totalToPay)).reduce((a, b) =>  a + b, initialValue),
                    receive['totalPayments'] = receive.payments.map( e => parseFloat(e.verssi)).reduce((a, b) =>  a + b, initialValue),
                    receive['totalCredit'] = receive.orders.map( e => parseFloat(e.rest)).reduce((a, b) =>  a + b, initialValue) - receive.payments.map( e => parseFloat(e.verssi)).reduce((a, b) =>  a + b, initialValue),
                    receive['totalBonOrders'] = receive.orders.length,
                    receive['totalBonPayments'] = receive.payments.length
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

// router.get("/camion01/", async (req, res) => {
//     const query = req.query.new
//     // if(req.user.isAdmin) {
//         try {
//             const clients = query ? await Client.find().sort({_id: -1}).limit(10) : await Client.find({camion: "CAMION 01" })
//             res.status(200).json({ clients })
//         } catch (err) {
//             res.status(500).json(err)
//         }
//     // } else {
//     //     res.status(500).json("you are not allowed to see all clients!")
//     // }
// })

// router.get("/camion02/", async (req, res) => {
//     const query = req.query.new
//     // if(req.user.isAdmin) {
//         try {
//             const clients = query ? await Client.find().sort({_id: -1}).limit(10) : await Client.find({camion: "CAMION 02" })
//             res.status(200).json({ clients })
//         } catch (err) {
//             res.status(500).json(err)
//         }
//     // } else {
//     //     res.status(500).json("you are not allowed to see all clients!")
//     // }
// })

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
        const data = await Client.aggregate([
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