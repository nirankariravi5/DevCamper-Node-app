const errorResponse=require('../utils/errorResponse')
const asyncHandler=require('../middleware/async')
const Course=require('../models/Course')
const Bootcamp=require('../models/Bootcamp')
exports.getallcourses=asyncHandler(async(req,res,next)=>{


    if(req.params.bootcampId){
        const courses=await Course.find({bootcamp:req.params.bootcampId})

       return  res.status(200).send({
            success:true,
            count:courses.length,
            data:courses
        })
    }else{
            res.status(200).send(res.advancedResults)
    }
})    

exports.getCourse=asyncHandler(async (req,res,next)=>{

    const course=await Course.findById(req.params.id).populate({
        path:'bootcamp',
        select:'name description'
    })
    if(!course){
        return next(new errorResponse('course not existing with the id'+req.params.id))
    }
res.status(200).send({success:true,data:course})

})

exports.addCourse=asyncHandler(async (req,res,next)=>{
    req.body.bootcamp=req.params.bootcampId
    req.body.user=req.user.id
    const bootcamp=await Bootcamp.findById(req.params.bootcampId)
   
    if(!bootcamp){
        return next(new errorResponse('bootcamp not existing with the id'+req.params.bootcampId,404))
    }  
    if(bootcamp.user.toString()!==req.user.id && req.user.role!=='admin'){
        return next(new errorResponse('user with the user id '+req.user.id+'is not authorize to  add the  course to this bootcamp'+bootcamp._id,401)
        )}
  
const course=await Course.create(req.body)

res.status(200).send({success:true,data:course})

})
exports.updateCourse=asyncHandler(async (req,res,next)=>{

    let course=await Course.findById(req.params.id)
    if(!course){
        return next(new errorResponse('course not existing with the'+req.params.id,404))
    }
    if(course.user.toString()!==req.user.id && req.user.role!=='admin'){
        return next(new errorResponse('user with the user id '+req.user.id+'is not authorize to  update the   course',401)
        )}
    course=await Course.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true
})
res.status(200).send({success:true,data:course})

})
exports.deleteCourse=asyncHandler(async (req,res,next)=>{

    let course=await Course.findById(req.params.id)
    if(!course){
        return next(new errorResponse('course not existing with the'+req.params.id,404))
    }
    if(course.user.toString()!==req.user.id && req.user.role!=='admin'){
        return next(new errorResponse('user with the user id '+req.user.id+'is not authorize to  delete this  course',401)
        )}
       
    await course.remove()
    console.log('ji')
res.status(200).send({success:true,data:{}})

})
  