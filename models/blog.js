const mongoose=require('mongoose')

const blogSchema=new mongoose.Schema({
    heading:{
        type:String,
        required:true,
        unique: true
    },
    dateOfEvent:{
        type:String
    },
    photo:{
        type:String
    },
    paragraph:{
        type: [String],
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})

module.exports=mongoose.model('Blog',blogSchema)