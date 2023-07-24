require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL)

const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to Database'))

app.use(cors())
app.use(express.json())

// app.get('/',(req,res)=>{
//     res.send('Hello world')
// })
app.use(express.static("client"));

const messageRouter = require('./routes/message')
app.use('/api/message', messageRouter)

const blogRouter = require('./routes/blog')
app.use('/api/blog', blogRouter)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})