const exp=require('express')
const productApp=exp.Router()

const expressAsyncHandler=require("express-async-handler")

productApp.use(exp.json())


// product api routes

//get all products
productApp.get('/getproducts',expressAsyncHandler(async(request,response)=>{
    let productCollectionObj=request.app.get("productCollectionObj")
    let products =await productCollectionObj.find().toArray()
    response.send({message:"all products",payload:products})
}))

//get product by id
productApp.get("/getproduct/:id",expressAsyncHandler(async(request,response)=>{
    let productCollectionObj=request.app.get("productCollectionObj")
    let pid=(+request.params.id);
    let product=await productCollectionObj.findOne({productId:pid})
    if(product==null)
    {
        response.send({message:"product doesnt exist"})
    }    else{
    response.send({message:`product with id ${request.params.id} is`,payload:product})}
}))

//to create a product using callback

// productApp.post('/create-product',(request,response)=>{
//     console.log(request.body)
//     response.send({message:"product is created"})
//     let productObj=request.body
//     productCollectionObj=request.app.get("productCollectionObj")
//     productCollectionObj.insertOne(productObj,(err,result)=>{
//         if(err)
//         {
//             console.log("error in creating product",err)
//         }
//         else{
//             response.send({message:'product created successfully'})
//         }
//     })
// })


//to create a product using async await 
productApp.post('/create-product',expressAsyncHandler(async(request,response)=>{
    try{
    let productObj=request.body
    let productCollectionObj=request.app.get("productCollectionObj")
    let result =await productCollectionObj.insertOne(productObj) 
    response.send({message:"Product created successfully"})}
    catch(err){
       next(err)
    }
}))

productApp.put('./update-product',expressAsyncHandler(async(request,response)=>{
    let productCollectionObj=request.app.get("productCollectionObj")
    let modifiedProduct=request.body;
    let result=await productCollectionObj.updateOne({productId:modifiedProduct.productId},{$set:{...modifiedProduct}})
    response.send({message:`product updated`})
}))
module.exports=productApp;