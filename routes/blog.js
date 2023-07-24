const express = require('express')
const router = express.Router()
const Blog = require("../models/blog")
// const  ObjectID = require('mongodb').ObjectId

//Get
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({"createdAt": -1});
        res.status(200).json({
            status:200,
            length:blogs.length,
            blog:blogs
        })
    }
    catch (err) {
        res.status(500).json({
            status:500,
            message: err.message
        })
    }
})

//Get
router.get('/:blogHeading', async (req, res) => {
    try {
        const blogs = await Blog.findOne({"heading":req.params.blogHeading});
        res.status(200).json({
            status:200,
            blog:blogs
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
    const blog = new Blog({
        heading: req.body.heading,
        dateOfEvent: req.body.dateOfEvent,
        photo:req.body.photo,
        paragraph:req.body.paragraph
    })
    try {
        const newBlog = await blog.save()
        res.status(201).json({
            status:201,
            blog:newBlog
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