const express=require('express')
const router=express.Router()
const
{getbootcamps,
createbootcamp,
getbootcamp,
updatebootcamp,
deletebootcamp,
getBootcampByRadius,
bootcampPhotoUpload
}=require('../controller/bootcamps')
const { protect,authorize }=require('../middleware/auth')
const Bootcamp=require('../models/Bootcamp')
const advancedResults=require('../middleware/advancedResults')
router
.route('/radius/:zipcode/:distance')
.get(getBootcampByRadius)
router
.route('/')
.get(advancedResults(Bootcamp,'courses'),getbootcamps)
.post(protect,authorize('publisher','admin'),createbootcamp)
router
.route('/:id')
.get(getbootcamp)
.patch(protect,authorize('publisher','admin'),updatebootcamp)
.delete(protect,authorize('publisher','admin'),deletebootcamp)

router.route('/:id/photo').patch(protect,authorize('publisher','admin'),bootcampPhotoUpload)
const courserouter=require('./courses')
const reviewrouter=require('./reviews')
router.use('/:bootcampId/courses',courserouter)
router.use('/:bootcampId/reviews',reviewrouter)
module.exports=router