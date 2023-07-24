const express = require('express')
const router = express.Router()
const Message = require("../models/message")

//Get
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find()
        res.status(200).json({
            status:200,
            length:messages.length,
            message:messages
        })
    }
    catch (err) {
        res.status(500).json({
            status:500,
            message: err.message
        })
    }
})

//POST
router.post('/', async (req, res) => {
    const message = new Message({
        name: req.body.name,
        email: req.body.email,
        subject:req.body.subject,
        message:req.body.message
    })
    try {
        const newMessage = await message.save()
        res.status(201).json({
            status:201,
            message:newMessage
        })
    }
    catch (err) {
        res.status(400).json({
            status:400,
            message: err.message
        })
    }
})

module.exports = router