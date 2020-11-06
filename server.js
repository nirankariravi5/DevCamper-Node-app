const express=require('express')
const dotenv=require('dotenv')
dotenv.config({path: './config/config.env'})
const PORT= process.env.PORT||5000
const app=express()
app.listen(PORT,console.log('Server is running in '+process.env.NODE_ENV+' mode on '+PORT))