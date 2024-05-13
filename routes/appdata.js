const router = require("express").Router()
const User = require("../models/User")
const Client = require("../models/Client")
const Region = require("../models/Region")
const Fees = require("../models/Fees")
const Product = require("../models/Product")
const Order = require("../models/Order")
const OrderedProduct = require("../models/OrderedProduct")
const CryptoJS = require("crypto-js")
const Payment = require("../models/Payment")
const mongoose = require("mongoose")

//SET DATA CLIENTS
router.post("/dataclients", async (req, res) => {

    const dataFromApp = req.body.data
    var reutrnStatus

    async function insertData(Element) {
        var status = ""
        const idCheck = await Client.findOne({ _id: Element.server_id})
        let is_credit = Element.is_credit ? true : false
        let is_frigo = Element.is_frigo ? true : false
        let is_promo = Element.is_promo ? true : false

        if (idCheck != null) {
            try {
                const appDate = new Date(Element.updatedAt)
                const serverDate = new Date(idCheck.updatedAt)

                if (appDate > serverDate) {
                    const updatedClient = await Client.findByIdAndUpdate(idCheck._id, 
                        {
                            appId: Element.id,
                            clientName: Element.client_name,
                            phone: Element.phone,
                            region: Element.region,
                            prices: Element.prices,
                            oldCredit: Element.old_credit,
                            isCredit: is_credit,
                            isFrigo: is_frigo,
                            isPromo: is_promo,
                            camion: Element.camion,
                            creditBon: Element.credit_bon,
                            lastServe: Element.last_serve
                        },
                        { new: true }
                    )
                    status = "done"
                } else {
                    status = "done"
                }
            } catch (err) {
                status = err
            }
        } else {
            const newClient = new Client ({
                appId: Element.id,
                clientName: Element.client_name,
                phone: Element.phone,
                region: Element.region,
                prices: Element.prices,
                oldCredit: Element.old_credit,
                isCredit: is_credit,
                isFrigo: is_frigo,
                isPromo: is_promo,
                camion: Element.camion,
                creditBon: Element.credit_bon,
                lastServe: Element.last_serve
            })
            
            try{
                const client = await newClient.save()
                status = "done"           
            } catch (err) {
                status = err
            }
        }
        return status
    }

    for (let i = 0; i < dataFromApp.length; i++) {
        const Element = dataFromApp[i]
        reutrnStatus = await insertData(Element)
    }

    if (reutrnStatus == "done") {
        res.status(201).json({
            status: 1,
            message: "Clients data save Successful",
        })
    } else {
        res.status(500).json(reutrnStatus)
    }
    
})

//SET DATA USERS
router.post("/datausers", async (req, res) => {

    const dataFromApp = req.body.data
    var reutrnStatus

    async function insertData(Element) {
        var status = ""
        const idCheck = await User.findOne({ _id: Element.server_id})
        if (idCheck != null) {
            try {
                const appDate = new Date(Element.updatedAt)
                const serverDate = new Date(idCheck.updatedAt)

                if (appDate > serverDate) {
                    const updatedUser = await User.findByIdAndUpdate(idCheck._id, 
                        {
                            username: Element.username,
                            email: Element.email,
                            password: CryptoJS.AES.encrypt(
                                Element.password,
                                process.env.SECRET_KEY
                                ).toString(),
                            profilePic: Element.profilePic,
                            camion: Element.camion,
                            isAdmin: Element.isadmin,
                        },
                        { new: true }
                    )
                    status = "done"
                } else {
                    status = "done"
                }
            } catch (err) {
                status = err
            }
        } else {
            const newUser = new User ({
                appId: Element.id,
                username: Element.username,
                email: `${Element.username}@gmail.com`,
                password: CryptoJS.AES.encrypt(
                    Element.password,
                    process.env.SECRET_KEY
                    ).toString(),
                profilePic: Element.profilePic,
                camion: Element.camion,
                isAdmin: Element.isadmin,
            })
    
            try{
                const user = await newUser.save()
                status = "done"           
            } catch (err) {
                status = err
            }
        }
        return status
    }

    for (let i = 0; i < dataFromApp.length; i++) {
        const Element = dataFromApp[i]
        reutrnStatus = await insertData(Element)
    }

    if (reutrnStatus == "done") {
        res.status(201).json({
            status: 1,
            message: "Users data save Successful",
        })
    } else {
        res.status(500).json(reutrnStatus)
    }
    
})

//SET DATA REGIONS
router.post("/dataregions", async (req, res) => {

    const dataFromApp = req.body.data
    var reutrnStatus
    var idCheck
 
    async function insertData(Element) {
        var status = ""
        Element.server_id == "" ? idCheck = null : idCheck = await Region.findById(Element.server_id)
       
        if (idCheck != null) {
            status = "done"
        } else {
            const newRegion = new Region ({
                appId: Element.id,
                regionName: Element.region_name,
                camion: Element.camion
            })
    
            try{
                const region = await newRegion.save()
                status = "done"           
            } catch (err) {
                status = err
            }
        }
        return status
    }

    for (let i = 0; i < dataFromApp.length; i++) {
        const Element = dataFromApp[i]
        reutrnStatus = await insertData(Element)
    }

    if (reutrnStatus == "done") {
        res.status(201).json({
            status: 1,
            message: "Regions data save Successful",
        })
    } else {
        res.status(500).json(reutrnStatus)
    }
    
})

//SET DATA REGIONS
router.post("/datafees", async (req, res) => {

    const dataFromApp = req.body.data
    var reutrnStatus
    var idCheck
 
    async function insertData(Element) {
        var status = ""
        Element.server_id == "" ? idCheck = null : idCheck = await Fees.findById(Element.server_id)
       
        if (idCheck != null) {
            status = "done"
        } else {
            const newFees = new Fees ({
                appId: Element.id,
                DieselFees: Element.diesel_fees,
                MealFees: Element.meal_fees,
                OtherCostsSum: Element.other_costs_sum,
                DescriptionFees: Element.description_fees,
                date: Element.date,
                camion: Element.camion
            })
    
            try{
                const fees = await newFees.save()
                status = "done"           
            } catch (err) {
                status = err
            }
        }
        return status
    }

    for (let i = 0; i < dataFromApp.length; i++) {
        const Element = dataFromApp[i]
        reutrnStatus = await insertData(Element)
    }

    if (reutrnStatus == "done") {
        res.status(201).json({
            status: 1,
            message: "Fees data save Successful",
        })
    } else {
        res.status(500).json(reutrnStatus)
    }
    
})

//SET DATA PRODUCTS
router.post("/dataproducts", async (req, res) => {

    const dataFromApp = req.body.data
    var reutrnStatus

    async function insertData(Element) {
        var status = ""
        const idCheck = await Product.findOne({ appId: Element.id})
        if (idCheck != null) {
            try {
                const appDate = new Date(Element.updatedAt)
                const serverDate = new Date(idCheck.updatedAt)

                if (appDate > serverDate) {
                    const updatedProduct = await Product.findByIdAndUpdate(idCheck._id, 
                        {
                            appId: Element.id,
                            name: Element.name,
                            price: Element.price,
                            qty_par_one: Element.qty_par_one,
                            image: Element.image,
                            status: Element.status
                        },
                        { new: true }
                    )
                    status = "done"
                } else {
                    status = "done"
                }
            } catch (err) {
                status = err
            }
        } else {
            const newProduct = new Product ({
                appId: Element.id,
                name: Element.name,
                price: Element.price,
                qty_par_one: Element.qty_par_one,
                image: Element.image,
                status: Element.status
            })
    
            try{
                const product = await newProduct.save()
                status = "done"           
            } catch (err) {
                status = err
            }
        }
        return status
    }

    for (let i = 0; i < dataFromApp.length; i++) {
        const Element = dataFromApp[i]
        reutrnStatus = await insertData(Element)
    }

    if (reutrnStatus == "done") {
        res.status(201).json({
            status: 1,
            message: "Products data save Successful",
        })
    } else {
        res.status(500).json(reutrnStatus)
    }
    
})

//SET DATA ORDERS
router.post("/dataorders", async (req, res) => {

    const dataFromApp = req.body.data
    var idCheck
    var serverOrderID = ""
    var serverProductListID = ""
    var appID = ""
    var ordersStatus
    var orderedProductStatus
    
    async function insertOrderedProductData(Element, newOrderID) {
        var status = ""
        Element.server_id == "" ? idCheck = null : idCheck = await OrderedProduct.findById(Element.server_id)
        
        if (idCheck != null) {
            status = "done"
        } else { 
            const newOrderedProduct = new OrderedProduct ({
                appId: Element.id,
                orderId: new mongoose.mongo.ObjectId(newOrderID),
                mini_qty: Element.mini_qty,
                mini_q_u: Element.mini_q_u,
                trio_qty: Element.trio_qty,
                trio_q_u: Element.trio_q_u,
                solo_qty: Element.solo_qty,
                solo_q_u: Element.solo_q_u,
                pot_qty: Element.pot_qty,
                pot_q_u: Element.pot_q_u,
                gini_qty: Element.gini_qty,
                gini_q_u: Element.gini_q_u,
                big_qty: Element.big_qty,
                big_q_u: Element.big_q_u,
                cornito_4_qty: Element.cornito_4_qty,
                cornito_4_q_u: Element.cornito_4_q_u,
                cornito_5_qty: Element.cornito_5_qty,
                cornito_5_q_u: Element.cornito_5_q_u,
                cornito_g_qty: Element.cornito_g_qty,
                cornito_g_q_u: Element.cornito_g_q_u,
                gofrito_qty: Element.gofrito_qty,
                gofrito_q_u: Element.gofrito_q_u,
                pot_v_qty: Element.pot_v_qty,
                pot_v_q_u: Element.pot_v_q_u,
                g8_qty: Element.g8_qty,
                g8_q_u: Element.g8_q_u,
                gold_qty: Element.gold_qty,
                gold_q_u: Element.gold_q_u,
                skiper_qty: Element.skiper_qty,
                skiper_q_u: Element.skiper_q_u,
                scobido_qty: Element.scobido_qty,
                scobido_q_u: Element.scobido_q_u,
                mini_scobido_qty: Element.mini_scobido_qty,
                mini_scobido_q_u: Element.mini_scobido_q_u,
                venezia_qty: Element.venezia_qty,
                venezia_q_u: Element.venezia_q_u,
                bf_400_q_u: Element.bf_400_q_u,
                bf_250_q_u: Element.bf_250_q_u,
                bf_230_q_u: Element.bf_230_q_u,
                bf_200_q_u: Element.bf_200_q_u,
                bf_150_q_u: Element.bf_150_q_u,
                buch_q_u: Element.buch_q_u,
                tarte_q_u: Element.tarte_q_u,
                mosta_q_u: Element.mosta_q_u,
                misso_q_u: Element.misso_q_u,
                juliana_q_u: Element.juliana_q_u,
                bac_5_q_u: Element.bac_5_q_u,
                bac_6_q_u: Element.bac_6_q_u,
                bf_210_q_u: Element.bf_210_q_u,
                bf_300_q_u: Element.bf_300_q_u,
                bf_330_q_u: Element.bf_330_q_u,
                bingo_premium_q_u: Element.bingo_premium_q_u,
                selection_q_u: Element.selection_q_u,
                cornito_prm_qty: Element.cornito_prm_qty,
                cornito_prm_q_u: Element.cornito_prm_q_u,
                bingo_prm_qty: Element.bingo_prm_qty,
                bingo_prm_q_u: Element.bingo_prm_q_u,
                mini_prm_qty: Element.mini_prm_qty,
                mini_prm_q_u: Element.mini_prm_q_u,
                pot_prm_qty: Element.pot_prm_qty,
                pot_prm_q_u: Element.pot_prm_q_u,
                bloom_prm_qty: Element.bloom_prm_qty,
                bloom_prm_q_u: Element.bloom_prm_q_u
            })
        
            try{
                const orderedProduct = await newOrderedProduct.save()
                const updatedOrder = await Order.findByIdAndUpdate(newOrderID, 
                    {
                        productListId: new mongoose.mongo.ObjectId(orderedProduct.id)
                    },
                    { new: true }
                )
                serverProductListID = orderedProduct.id

                status = "done"           
            } catch (err) {
                status = err
            }
        }
        return status
    }

    async function insertOrdersData(OrderElement, ProductList) {
        var status = ""
        OrderElement.server_id == "" ? idCheck = null : idCheck = await Order.findById(OrderElement.server_id)
        
        if (idCheck != null) {
            status = "done"
        } else { 
            const newOrder = new Order ({
                appId: OrderElement.id,
                clientName: OrderElement.client_name,
                clientId: new mongoose.mongo.ObjectId(OrderElement.client_id),
                productListId: OrderElement.product_list_id,
                totalToPay: OrderElement.total_to_pay,
                verssi: OrderElement.verssi,
                rest: OrderElement.rest,
                date: OrderElement.date,
                camion: OrderElement.camion,
                isCredit: OrderElement.iscredit,
                isCheck: OrderElement.is_check
            })
    
            try{
                const order = await newOrder.save()
                // idObj.push(order)
                serverOrderID = order._id   
                appID = order.appId      
                orderedProductStatus = await insertOrderedProductData(ProductList, order._id)
                const ObjectIdProductList = new mongoose.mongo.ObjectId(serverProductListID)
                const updatedOrder = await Order.findByIdAndUpdate(serverOrderID, 
                    {
                        productListId: ObjectIdProductList
                    },
                    { new: true }
                )
                status = "done"
            } catch (err) {
                status = err
            }
        }
        return status
    }

    for (let i = 0; i < dataFromApp.length; i++) {
        ordersStatus = await insertOrdersData(dataFromApp[0].orders[0], dataFromApp[0].orderedProduct[0]).catch(err => {console.log(err);})
    }

    if (ordersStatus == "done" && orderedProductStatus == "done") {
        res.status(201).json({
                status: 1,
                message: "Orders Up To Server Successfully",
                data: {
                    "orderID" : serverOrderID,
                    "productListID" : serverProductListID,
                    "appID" : appID
                }
            })
    } else {
        res.status(500).json(ordersStatus)
    }
    
})

//SET DATA PAYMENTS
router.post("/datapayments", async (req, res) => {

    const dataFromApp = req.body.data
    var idCheck
    var idObj = []
    var reutrnStatus

    async function insertData(Element) {
        var status = ""
        Element.server_id == "" ? idCheck = null : idCheck = await Payment.findById(Element.server_id)
        
        if (idCheck != null) {
            status = "done"
        } else { 
            const newPayment = new Payment ({
                appId: Element.id,
                clientName: Element.client_name,
                clientId: new mongoose.mongo.ObjectId(Element.client_id),
                region: Element.region,
                oldSomme: Element.old_somme,
                verssi: Element.verssi,
                rest: Element.rest,
                date: Element.date,
                camion: Element.camion,
                isCheck: Element.is_check
            })

            try{
                const payment = await newPayment.save()
                idObj.push(payment)
                status = "done"           
            } catch (err) {
                status = err
            }
        }
        return status
    }

    for (let i = 0; i < dataFromApp.length; i++) {
        reutrnStatus = await insertData(dataFromApp[i])
    }

    if (reutrnStatus == "done") {
        res.status(201).json({ idObj })
    } else {
        res.status(500).json(reutrnStatus)
    }
    
})

//SET DATA ORDER_PRODUCTS
// router.post("/dataorderproducts", async (req, res) => {

//     const dataFromApp = req.body.data
//     var idCheck
//     var idObj = []
//     var reutrnStatus

//     async function insertData(Element) {
//         var status = ""
//         Element.server_id == "" ? idCheck = null : idCheck = await OrderedProduct.findById(Element.server_id)
        
//         if (idCheck != null) {
//             status = "done"
//         } else { 
//             const newOrderedProduct = new OrderedProduct ({
//                 appId: Element.id,
//                 orderId: Element.orderId,
//                 mini_qty: Element.mini_qty,
//                 mini_q_u: Element.mini_q_u,
//                 trio_qty: Element.trio_qty,
//                 trio_q_u: Element.trio_q_u,
//                 solo_qty: Element.solo_qty,
//                 solo_q_u: Element.solo_q_u,
//                 pot_qty: Element.pot_qty,
//                 pot_q_u: Element.pot_q_u,
//                 gini_qty: Element.gini_qty,
//                 gini_q_u: Element.gini_q_u,
//                 big_qty: Element.big_qty,
//                 big_q_u: Element.big_q_u,
//                 cornito_4_qty: Element.cornito_4_qty,
//                 cornito_4_q_u: Element.cornito_4_q_u,
//                 cornito_5_qty: Element.cornito_5_qty,
//                 cornito_5_q_u: Element.cornito_5_q_u,
//                 cornito_g_qty: Element.cornito_g_qty,
//                 cornito_g_q_u: Element.cornito_g_q_u,
//                 gofrito_qty: Element.gofrito_qty,
//                 gofrito_q_u: Element.gofrito_q_u,
//                 pot_v_qty: Element.pot_v_qty,
//                 pot_v_q_u: Element.pot_v_q_u,
//                 g8_qty: Element.g8_qty,
//                 g8_q_u: Element.g8_q_u,
//                 gold_qty: Element.gold_qty,
//                 gold_q_u: Element.gold_q_u,
//                 skiper_qty: Element.skiper_qty,
//                 skiper_q_u: Element.skiper_q_u,
//                 scobido_qty: Element.scobido_qty,
//                 scobido_q_u: Element.scobido_q_u,
//                 mini_scobido_qty: Element.mini_scobido_qty,
//                 mini_scobido_q_u: Element.mini_scobido_q_u,
//                 venezia_qty: Element.venezia_qty,
//                 venezia_q_u: Element.venezia_q_u,
//                 bf_400_q_u: Element.bf_400_q_u,
//                 bf_250_q_u: Element.bf_250_q_u,
//                 bf_230_q_u: Element.bf_230_q_u,
//                 bf_200_q_u: Element.bf_200_q_u,
//                 bf_150_q_u: Element.bf_150_q_u,
//                 buch_q_u: Element.buch_q_u,
//                 tarte_q_u: Element.tarte_q_u,
//                 mosta_q_u: Element.mosta_q_u,
//                 misso_q_u: Element.misso_q_u,
//                 juliana_q_u: Element.juliana_q_u,
//                 bac_5_q_u: Element.bac_5_q_u,
//                 bac_6_q_u: Element.bac_6_q_u,
//                 bf_210_q_u: Element.bf_210_q_u,
//                 bf_300_q_u: Element.bf_300_q_u,
//                 bf_330_q_u: Element.bf_330_q_u,
//                 bingo_premium_q_u: Element.bingo_premium_q_u,
//                 selection_q_u: Element.selection_q_u,
//                 cornito_prm_qty: Element.cornito_prm_qty,
//                 cornito_prm_q_u: Element.cornito_prm_q_u,
//                 bingo_prm_qty: Element.bingo_prm_qty,
//                 bingo_prm_q_u: Element.bingo_prm_q_u,
//                 mini_prm_qty: Element.mini_prm_qty,
//                 mini_prm_q_u: Element.mini_prm_q_u,
//                 pot_prm_qty: Element.pot_prm_qty,
//                 pot_prm_q_u: Element.pot_prm_q_u,
//                 bloom_prm_qty: Element.bloom_prm_qty,
//                 bloom_prm_q_u: Element.bloom_prm_q_u
//             })
        
//             try{
//                 const orderedProduct = await newOrderedProduct.save()
//                 const updatedOrder = await Order.findByIdAndUpdate(orderedProduct.orderId, 
//                     {
//                         productListId: orderedProduct.id
//                     },
//                     { new: true }
//                 )
//                 idObj.push(orderedProduct)
//                 status = "done"           
//             } catch (err) {
//                 status = err
//             }
//         }
//         return status
//     }

//     for (let i = 0; i < dataFromApp.length; i++) {
//         reutrnStatus = await insertData(dataFromApp[i])
//     }

//     if (reutrnStatus == "done") {
//         res.status(201).json({ idObj })
//     } else {
//         res.status(500).json(reutrnStatus)
//     }
    
// })

module.exports = router