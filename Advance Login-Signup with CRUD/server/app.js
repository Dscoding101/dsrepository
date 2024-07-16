const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const authRoute=require('./routes/authRoute')
//const UserModel=require('./models/user')
const jwt=require('jsonwebtoken')
//const nodemailer=require('nodemailer')
//const bcrypt=require('bcryptjs')



const app=express()
app.use(cors())

app.use(express.json())
app.use('/uploads', express.static('uploads'))

mongoose.connect('mongodb+srv://Debojit0101:l59t2wDDKhQ0tWuK@cluster0.8clrhtr.mongodb.net/LOGIN_WITH_FORGOTPASSWORD').then(()=>{
    console.log('MongoDB connected Successfully')
}).catch((error)=>{
    console.log('MOngoDB connection Failed',error)
})



app.use('/api',authRoute)

app.listen(5001,()=>{
    console.log('Server running on Port 5001')
})


 
    








