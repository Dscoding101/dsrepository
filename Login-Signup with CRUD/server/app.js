const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const authRoute=require('./routes/authRoute')
const UserModel=require('./models/user')
const jwt=require('jsonwebtoken')
const nodemailer=require('nodemailer')
const bcrypt=require('bcryptjs')
/*const multer=require('multer')*/


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


app.post('/verifyEmail', async (req, res) => {
    const {email} = req.body;

    const userexist=await UserModel.findOne({email})
    if(userexist)
      {
        return res.status(300).json({message:"User Already Exists !!"})
      }
    
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 's.debo26@gmail.com',
              pass: 'djfr wubs fvoo haqt'
            }
        });
        
        var mailOptions = {
            from: 's.debo26@gmail.com',
            to: email,
            subject: 'Email Verification Link',
            text: `http://localhost:3000/verify-email/${email}`
        };
          
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log("error", error);
                return res.status(400).json({ message: "Email not sent" });
            } else {
                console.log("Email sent", info.response);
                return res.status(200).json({ message: "Email sent successfully" });
            }
        });
    })
    



app.post('/forgot-password', (req, res) => {
    const {email} = req.body;
    UserModel.findOne({email: email})
    .then(user => {
        if(!user) {
            return res.status(404).json({message: "User not existed"});
        } 
        const token = jwt.sign({id: user._id}, "jwt_secret_key", {expiresIn: "1d"});
        
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 's.debo26@gmail.com',
              pass: 'djfr wubs fvoo haqt'
            }
        });
        
        var mailOptions = {
            from: 's.debo26@gmail.com',
            to: email,
            subject: 'Reset Password Link',
            text: `http://localhost:3000/reset-password/${user._id}/${token}`
        };
          
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log("error", error);
                return res.status(400).json({ message: "Email not sent" });
            } else {
                console.log("Email sent", info.response);
                return res.status(200).json({ message: "Email sent successfully" });
            }
        });
    })
    .catch(err => {
        console.log("Error finding user:", err);
        res.status(500).json({ message: "Internal server error" });
    });
});



/*app.post('/reset-password/:id/:token', (req, res) => {
    const {id, token} = req.params
    const {password} = req.body
    console.log("Reset password Called")
    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
        if(err) {
            console.log(err)
            return res.json({Status: "Error with token"})
            
        } else {
            //console.log(decoded)
            bcrypt.hash(password, 10)
            .then(hash => {
                UserModel.findByIdAndUpdate({_id: id}, {password: hash})
                console.log(id,password)
                .then(res => res.send({Status: "Success"}))
                .catch(err => res.send({Status: err}))
            })
            .catch(err => res.send({Status: err}))
        }
    })
})*/

app.post('/reset-password/:id/:token', async (req, res) => {
    try {
        const { id, token } = req.params
        const { password } = req.body
        console.log("Reset password Called")
        jwt.verify(token, "jwt_secret_key", async (err) => {
            if (err) {
                
                return res.status(400).json({ error: "token is not correct" })
            }

            const hash = await bcrypt.hash(password, 10)
            await UserModel.findByIdAndUpdate(id, { password: hash })
            return res.status(200).json({ message: "password updated successfully" })
            
        })   
    } catch (error) {
        console.log(error)
    }
})