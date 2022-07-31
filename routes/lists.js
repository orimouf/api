const router = require("express").Router()
const List = require("../models/List")
const verify = require("../verifyToken")

// CREATE

router.post("/", verify, async (req, res) => {
    if(req.user.isAdmin) {
        const newList = new List(req.body)

        try {
            const savedList = await newList.save()
            res.status(200).json(savedList)
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
            const updatedList = await List.findByIdAndUpdate(
                req.params.id, 
                { $set: req.body },
                { new: true }
            )
            res.status(200).json(updatedList)
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
            await List.findByIdAndDelete(req.params.id)
            res.status(200).json("The product has been deleted...")
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(500).json("you are not allowed!")
    }
})

//GET ALL

router.get("/", verify, async (req, res) => {
    const titleQuery = req.query.title
    let list = []

    try {
        if (titleQuery) {
            list = await List.aggregate([
                { $match: { title: titleQuery }},
                { $sample: { size: 10 }}
            ])
        } else {
            list = await List.aggregate([
                { $sample: { size: 10 }}
            ])
        }
        res.status(200).json(list)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router