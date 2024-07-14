const jwt=require('jsonwebtoken')
const bcryptjs=require('bcryptjs')
const User=require('../models/user')
const ProductModel=require('../models/product')
/*const multer=require('multer')*/


/*const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  const upload = multer({ storage: storage });*/


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

        // Check if the user exists
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password is correct
        const validPassword = await bcryptjs.compare(password, validUser.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Incorrect Password' });
        }

        // Generate a token
        const token = jwt.sign({ name: validUser.name,image:validUser.image,email:validUser.email,password:validUser.password }, 'fghjklihkuyjthgg798', { expiresIn: '1h' });

        // Send the response with the token
        return res.status(200).json({ message: 'success', token });

    } catch (error) {     
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// exports.editProfile = async (req, res) => {
//     console.log("Edit Backend Called")
//     const { name, email, password } = req.body;
//     const image = req.file;
//     console.log(image)
//     try {
//         // Find the user by email
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
  
//         // Update the user's details
//         if (name) user.name = name;
//         if (password) user.password = await bcryptjs.hash(password, 10);
//         if (image) user.image = image.path;
  
//         // Save the updated user to the database
//         await user.save();
//         res.status(200).json({ message: 'Profile updated successfully', user });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Internal Server Error' });
//     }
//   };

exports.editProfile = async (req, res) => {
    console.log("Edit Backend Called");
    const { name, email, password } = req.body;
    const image = req.file;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
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
  
  


//   exports.getCurrentPassword = async (req, res) => {
//     try {
//       const { email } = req.User; // Assuming email is stored in the JWT token and available in req.user
//       const user = await User.findOne({ email });
  
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       res.status(200).json({ password: User.password });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: 'Internal Server Error' });
//     }
//   };
  


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


  exports.createProduct=async (req,res)=>{
    console.log("createStudent Called:")
    const { name, color, price } = req.body;
    console.log(name,color,price)
  const image = req.file;
  try {
    const productCreate = new ProductModel({
        name:name,
        color:color,
        price:price,
        image:image?image.path:null
      });
      await productCreate.save()
      console.log("Data Saved")
      return res.status(201).json({productCreate});
  } catch (error) {
    console.log(error)
    return res.status(300).json({ error: 'Server error' });
  }
}

exports.getProduct=(req,res)=>{
    ProductModel.find()
    .then(users => res.json(users))
    .catch(err => res.json(err))
}

exports.updateProduct=async (req,res)=>{
  const id = req.params.id
  await ProductModel.findById({_id:id})
  .then(users => res.json(users))
  .catch(err => res.json(err)) 
}

exports.editProduct=async (req,res)=>{
  const id = req.params.id 
  const image=req.file
  if(image)
    {
      await ProductModel.findByIdAndUpdate({_id:id},{
        name:req.body.name,
        color:req.body.color,
        price:req.body.price,
        image:image?req.file.path:null})
      .then(users => res.json(users))
      .catch(err => res.json(err))
    }
    else{
      await ProductModel.findByIdAndUpdate({_id:id},{
        name:req.body.name,
        color:req.body.color,
        price:req.body.price})
      .then(users => res.json(users))
      .catch(err => res.json(err))
    }
   
}

exports.deleteProduct=(req,res)=>{
  const id=req.params.id
  ProductModel.findByIdAndDelete({_id:id})
  .then(res => res.json(res))
  .catch(err => res.json(err))
}




   




