const mongoose=require('mongoose')

const prodSchema=new mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    
    color:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    }
})

const ProductModel=mongoose.model('products',prodSchema)
module.exports=ProductModel