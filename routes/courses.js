const express=require('express')
const router=express.Router({mergeParams:true})
const
{getallcourses,getCourse,addCourse, updateCourse,deleteCourse}=require('../controller/courses')
const Course=require('../models/Course')
const advancedResults=require('../middleware/advancedResults')
const {protect,authorize}=require('../middleware/auth')
router
.route('/')
.get(advancedResults(Course,{
    path:'bootcamp',
    select:'name description'
}),getallcourses)
.post(protect,authorize('publisher','admin'),addCourse)
router
.route('/:id')
.get(getCourse)
.patch(protect,authorize('publisher','admin'),updateCourse)
.delete(protect,authorize('publisher','admin'),deleteCourse)
module.exports=router