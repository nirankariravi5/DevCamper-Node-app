const path=require('path')
const errorResponse=require('../utils/errorResponse')
const asyncHandler=require('../middleware/async')
const Bootcamp=require('../models/Bootcamp')
const { Geocoder } = require('node-geocoder')
const geocoder = require('../utils/geocoder')

exports.getbootcamps=asyncHandler(async(req,res,next)=>{
          
        
         res.status(200).send(res.advancedResults)

})
exports.createbootcamp=asyncHandler(async(req,res,next)=>{
        req.body.user=req.user.id
        const publishedBootcamp=await Bootcamp.findOne({user:req.user.id})    
        if(publishedBootcamp && req.user.role!=='admin'){
          return next((new errorResponse('user with'+req.user.id+' has already published 1 bootcamp',400))
          
        )}

        const bootcamp=await Bootcamp.create(req.body)
        res.status(201).send({success:true,data:bootcamp}) 
      
})
exports.getbootcamp=asyncHandler(async (req,res,next)=>{

        const bootcamp=await Bootcamp.findById(req.params.id)
        if(!bootcamp){
            return res.status(400).send({sucess:false})
        }
    res.status(200).send({success:true,data:bootcamp})
    
})


exports.updatebootcamp=asyncHandler(async(req,res,next)=>{

        const bootcamp=await Bootcamp.findById(req.params.id)
     if(!bootcamp){
        return res.status(400).send({success:false})
     }

     if(bootcamp.user.toString()!==req.user.id && req.user.role!=='admin'){
       return next(new errorResponse('user with the id'+req.user.id+'is not authorized to access the data',404))
     }
     bootcamp=await Bootcamp.findOneAndUpdate(req.params.id,req.body,{
      new:true,
      runValidators:true
  })

    res.status(200).send({success:true,data:bootcamp})
    })
exports.deletebootcamp=asyncHandler(async(req,res,next)=>{

     const bootcamp=await Bootcamp.findById(req.params.id)
     if(!bootcamp){
        return res.status(400).send({success:false})
     }
    
        if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
          return next(
            new ErrorResponse(
              `User ${req.params.id} is not authorized to update this bootcamp`,
              401
            )
          );
        }
     bootcamp.remove()
    res.status(200).send({success:true,data:{}})
    })

exports.getBootcampByRadius=asyncHandler(async(req,res,next)=>{
    const {zipcode,distance}= req.params

    const loc=await geocoder.geocode(zipcode)
    const lat=loc[0].latitude
    const lng=loc[0].longitude
    const radius=distance/3963
        const bootcamps= await Bootcamp.find({
            location:{$geoWithin:{$centerSphere:[[lng,lat],radius]}}
        })

        res.status(200).send({success:true,count:bootcamps.length,data:bootcamps})
    })
    
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);
      
        if (!bootcamp) {
          return next(
            new errorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
          );
        }
      
   
        if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
          return next(
            new ErrorResponse(
              `User ${req.params.id} is not authorized to update this bootcamp`,
              401
            )
          );
        }
  
        if (!req.files) {
          return next(new errorResponse(`Please upload a file`, 400))
        }
      
        const file = req.files.file
     
        // Make sure the image is a photo
        if (!file.mimetype.startsWith('image')) {
          return next(new errorResponse(`Please upload an image file`, 400));
        }
      
        // Check filesize
        if (file.size > process.env.MAX_FILE_UPLOAD) {
          return next(
            new errorResponse(
              `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
              400
            )
          )
        }
      
        // Create custom filename
        file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`
      
        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
          if (err) {
            console.error(err)
            return next(new errorResponse(`Problem with file upload`, 500));
          }
      
          await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name })
      
          res.status(200).json({
            success: true,
            data: file.name
          })
        })
      })
      