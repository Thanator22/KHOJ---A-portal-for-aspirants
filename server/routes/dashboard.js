const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const UserModal = require('../models/user.js')
var jwt = require('jsonwebtoken')

const secret = 'test'

router.get(
    '/account/:id',
    asyncHandler(async (req, res) => {
        const user = await UserModal.uss.findById(req.params.id).populate("currentHostel.hostel").populate("futureHostels.hostel").populate("oldHostels.hostel");
        if (user) {
            res.json(user)
        } else {
            res.status(404)
            throw new Error('User not Found')
        }
    }),
)

router.get(
    '/:id',
    asyncHandler(async (req, res) => {
        try {
            let result = await UserModal.uss.findById(req.params.id).populate("currentHostel.hostel").populate("futureHostels.hostel").populate("oldHostels.hostel");
            const token = jwt.sign(
                { email: result.email, id: result._id },
                secret,
                { expiresIn: '1h' },
            );
            res.status(200).json({ result: result, token });
        } catch (err) {
            res.status(200).json({ message: 'Something went wrong' })
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
router.get(
    '/complaints/:id',
    asyncHandler(async (req, res) => {
        const user = await UserModal.uss.findById(req.params.id)
        if (user) {
            res.json(user.complaints)
        } else {
            res.status(404)
            throw new Error('User not Found')
        }
    }),
)

router.patch('/reviews/:id', async (req, res) => {
    try {
        const {hostel, comment, date}=req.body;

        const hostell=await UserModal.uss2.findById(hostel);
        const std=await UserModal.uss.findById(req.params.id);

        const user = await UserModal.uss.updateOne(
            { _id: req.params.id },
            { $push: { reviews: {
                hostel:hostell.name, comment, date
            } } },
        )
        const user2 = await UserModal.uss2.updateOne(
            { _id: hostel },
            { $push: { reviews: {
                student:std.name, comment, date
            } } },
        )
        let result = await UserModal.uss.findById(req.params.id).populate("currentHostel.hostel").populate("futureHostels.hostel").populate("oldHostels.hostel");
        const token = jwt.sign(
            { email: result.email, id: result._id },
            secret,
            { expiresIn: '1h' },
        );
        res.status(200).json({ result: result, token });
    } catch (err) {
        res.status(200).json({ message: 'Something went wrong' })
    }
})
router.patch('/complaints/:id', async (req, res) => {
    try {
        const {hostel, comment, date}=req.body;

        const hostell=await UserModal.uss2.findById(hostel);
        const std=await UserModal.uss.findById(req.params.id);

        const user = await UserModal.uss.updateOne(
            { _id: req.params.id },
            { $push: { complaints: {
                hostel:hostell.name, comment, date
            } } },
        )
        const user2 = await UserModal.uss2.updateOne(
            { _id: hostel },
            { $push: { complaints: {
                student:std.name, comment, date
            } } },
        )

        let result = await UserModal.uss.findById(req.params.id).populate("currentHostel.hostel").populate("futureHostels.hostel").populate("oldHostels.hostel");
        const token = jwt.sign(
            { email: result.email, id: result._id },
            secret,
            { expiresIn: '1h' },
        );
        res.status(200).json({ result: result, token });
    } catch (err) {
        res.status(200).json({ message: 'Something went wrong' })
    }
})
router.patch('/editProfile/:id', async (req, res) => {
    try {
        const user = await UserModal.uss.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    name: req.body.name,
                    phone: req.body.phone,
                    email: req.body.email,
                    address: req.body.address,
                },
            },
        );
        let result = await UserModal.uss.findById(req.params.id).populate("currentHostel.hostel").populate("futureHostels.hostel").populate("oldHostels.hostel");
        const token = jwt.sign(
            { email: result.email, id: result._id },
            secret,
            { expiresIn: '1h' },
        );
        res.status(200).json({ result: result, token })
    } catch (err) {
        res.status(200).json({ message: 'Something went wrong' })
    }
})

module.exports = router
