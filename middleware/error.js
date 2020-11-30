const errorResponse = require("../utils/errorResponse")
const errorHandler=(err,req,res,next)=>{
    console.log(err)
    let error={...err}
    error.message=err.message
  if(err.name==='CastError'){
     const message="resource associated with the id"+err.value+'is not found';
     error=new errorResponse(message,404)
  }
  if(err.code===11000){
      const message="Duplicate value found in your entery"
      error=new errorResponse(message,400)
  }
  if(err.name==='ValidationError'){
      const message=Object.values(err.errors).map(val=>val.message)
      error=new errorResponse(message,400)
  }
    res.status(error.statusCode||500).send({
        success:false,
        error:error.message||'server error'
    })
}
module.exports=errorHandler