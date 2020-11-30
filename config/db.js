const mongoose=require('mongoose')

const connectDB=async()=>{
    const conn=await mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
})
    console.log(('database connected at the host '+conn.connection.host).cyan.underline.bold)
}
module.exports=connectDB