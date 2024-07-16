const jwt=require('jsonwebtoken')
const bcryptjs=require('bcryptjs')
const User=require('../models/user')
const studentModel = require('../models/student')
const nodemailer=require('nodemailer')
//const path =require('path')

exports.verifyEmail=async (req, res) => {
  const {email} = req.body;

  const userexist=await User.findOne({email})
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
  }

exports.register=async (req,res)=>{
    const {name,email,password}=req.body
    const image=req.file
    console.log(image)
       try {
        const preUser=await User.findOne({email:email})
        if(preUser){
            res.status(400).json({error:'User already exists'})
        }else{
        const hashedpassword=await bcryptjs.hash(password,10)
        const user=new User({name,email,password:hashedpassword,image:image.path})
        await user.save()
        return res.status(200).json({message:'Registration Successful'})
        }
       } catch (error) {
        return res.status(400).json({message:'Invalid Details',error})
       }

}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        
        const validPassword = await bcryptjs.compare(password, validUser.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Incorrect Password' });
        }

       
        const token = jwt.sign({ name: validUser.name,image:validUser.image,email:validUser.email,password:validUser.password }, 'fghjklihkuyjthgg798', { expiresIn: '1h' });

        
        return res.status(200).json({ message: 'success', token });

    } catch (error) {     
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.forgotPassword= async(req, res) => {
  const {email} = req.body;
  User.findOne({email: email})
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
};

exports.resetPassword= async (req, res) => {
  try {
      const { id, token } = req.params
      const { password } = req.body
      console.log("Reset password Called")
      jwt.verify(token, "jwt_secret_key", async (err) => {
          if (err) {
              
              return res.status(400).json({ error: "token is not correct" })
          }

          const hash = await bcryptjs.hash(password, 10)
          await User.findByIdAndUpdate(id, { password: hash })
          return res.status(200).json({ message: "password updated successfully" })
          
      })   
  } catch (error) {
      console.log(error)
  }
};

exports.editProfile = async (req, res) => {
  console.log("Edit Backend Called");
  const { name, email, password } = req.body;
  const image = req.file;

  try {
    // Find the user by email
    const user = await User.findOne({ email:email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the new password is different from the current password
    if (password) {
      const isSamePassword = await bcryptjs.compare(password, user.password);
      if (isSamePassword) {
        return res.status(400).json({ message: 'New password should be different from the current password' });
      } else {
        user.password = await bcryptjs.hash(password, 10);
      }
    }

    // Update the user's details
    if (name) user.name = name;
    if (image) user.image = image.path;

    // Save the updated user to the database
    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.deleteAccount=async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'fghjklihkuyjthgg798'); // Verify and decode JWT token
    const userEmail = decoded.email; // Extract email from decoded token

    // Find user by email and delete account
    const deletedUser = await User.findOneAndDelete({ email: userEmail });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Account deleted successfully', user: deletedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};  


exports.createStudent= async (req, res) => {
  console.log("createStudent Called:");
  const {name,gender,city,studyPreferences } = req.body;
  console.log(name,gender,city,studyPreferences );
  const image = req.file;
  try {
    const student = new studentModel({
      name:name,
      gender:gender,
      city:city,
      studyPreferences:studyPreferences.split(','),
      image: image ? image.path : null,
    });
    await student.save();
    console.log("Data Saved");
    return res.status(201).json({ student });
  } catch (error) {
    console.log(error);
    return res.status(300).json({ error: "Server error" });
  }
};


exports.getStudent=(req, res) => {
  studentModel
    .find()
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
};

exports.updateStudent=async (req, res) => {
  const id = req.params.id;
  await studentModel
    .findById({ _id: id })
    .then((users) => {
      console.log(users)
      res.json(users)
    })
    .catch((err) => res.json(err));
};


exports.editStudent= async (req, res) => {
const id = req.params.id;
  const image = req.file;
  const { name, city, gender, studyPreferences } = req.body;

  try {
    const updateData = {
      name: name,
      city: city,
      gender: gender,
      studyPreferences: JSON.parse(studyPreferences), // Parse education back to array
    };

    if (image) {
      updateData.image = image.path;
    }

    const updatedStudent = await studentModel.findByIdAndUpdate(
      { _id: id },
      updateData,
      { new: true } // This option returns the updated document
    );

    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


exports.deleteStudent= (req, res) => {
  const id = req.params.id;
  studentModel
    .findByIdAndDelete({ _id: id })
    .then((res) => res.json(res))
    .catch((err) => res.json(err));
};





   




