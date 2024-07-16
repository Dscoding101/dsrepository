const mongoose=require('mongoose')

const studentSchema=new mongoose.Schema({
   name:{type:String,required:true},
   gender:{type:String,required:true},
   city:{type:String,required:true},
   studyPreferences:{type: [String], required: true },
   image:{type:String,required:true}
})

const studentModel=mongoose.model('students',studentSchema)
module.exports=studentModel