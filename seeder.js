const fs=require('fs')
const mongoose=require('mongoose')
const Bootcamp=require('./models/Bootcamp')
const color=require('colors')
const dotenv=require('dotenv')
const Course = require('./models/Course')
const User=require('./models/User')
const Review = require('./models/Review')

dotenv.config({path:'./config/config.env'})

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
})


const bootcamps=JSON.parse(fs.readFileSync(__dirname+'/_data/bootcamps.json','utf-8'))
const courses=JSON.parse(fs.readFileSync(__dirname+'/_data/courses.json','utf-8'))
const users=JSON.parse(fs.readFileSync(__dirname+'/_data/users.json','utf-8'))
const reviews=JSON.parse(fs.readFileSync(__dirname+'/_data/reviews.json','utf-8'))
const importdata=async()=>{
    try{
        await Bootcamp.create(bootcamps)
        await Course.create(courses)
        await User.create(users)
        await Review.create(reviews)
        console.log(('Data created successfuly').green.inverse)
        process.exit()
    }catch(err){
        console.error(err)
    }
}
const deletedata=async()=>{
    try{
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()
        console.log(('Data Deleted').red.inverse)
        process.exit()
    }catch(err){
        console.error(err)
    }
}

if(process.argv[2]==='-i'){
   
    importdata()
}else if(process.argv[2]==='-d'){
    deletedata()
}