const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const UserModal = require('../models/user.js')

router.get(
    '/account/:id',
    asyncHandler(async (req, res) => {
        const user = await UserModal.uss.findById(req.params.id)
        if (user) {
            res.json(user)
        } else {
            res.status(404)
            throw new Error('User not Found')
        }
    }),
)

router.get(
    '/reviews/:id',
    asyncHandler(async (req, res) => {
        const user = await UserModal.uss.findById(req.params.id)
        if (user) {
            res.json(user.reviews)
        } else {
            res.status(404)
            throw new Error('User not Found')
        }
    }),
)

router.patch('/reviews/:id', async (req, res) => {
    try {
        const user = await UserModal.uss.updateOne(
            { _id: req.params.id },
            { $push: { reviews: req.body } },
        )
        res.send(user)
    } catch (err) {
        res.json({ message: err.message, data: req.body, id: req.params.id })
    }
})

module.exports = router
