const advancedResults=(model,populate)=>async(req,res,next)=>{
    let query
        
    let reqQuery={...req.query}
    let removeFields=['select','sort','page','limit']
    removeFields.forEach(param=>delete reqQuery[param])
  
    let queryStr=JSON.stringify(reqQuery)
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>'$'+match)
    query=model.find(JSON.parse(queryStr))
    
    if(req.query.select){
        const fields=req.query.select.split(',').join(' ')

        query=query.select(fields)
        
    }

    if(req.query.sort){
        const sortby=req.query.sort.split(',').join(' ')
        
        query=query.sort(sortby)
     
    }else {
        query=query.sort('-createdAt')
    }

    const page=parseInt(req.query.page,10)||1
    const limit=parseInt(req.query.limit,10)||1
    startindex=(page-1)*limit
    endindex=page*limit
    const total=await model.countDocuments()

    query=query.skip(startindex).limit(limit)
    if(populate){
        query=query.populate(populate)
    }
    const results=await query
    const pagination={}
    if(endindex<total){
        pagination.next={
            page:page+1,
            limit
        }
    }
    if(startindex>0){
        pagination.prev={
            page:page-1,
            limit
        }
    }
res.advancedResults={
    success:true,
    count:results.length,
    pagination,
    data:results
}

next()


}

module.exports=advancedResults