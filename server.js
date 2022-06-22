const exp=require('express')
const app=exp()
const mclient=require("mongodb").MongoClient;

const path =require('path')


require('dotenv').config()

//connect build or react app with nodejs
app.use(exp.static(path.join(__dirname,'./build')))

//db connection url
const Dburl=process.env.DATABASE_CONNECTION_URL;

//connect with db server
mclient.connect(Dburl)
.then((client)=>{
    let dbObj=client.db("firstdb22")

    let userCollectionObj=dbObj.collection("usercollection")   
    let productCollectionObj=dbObj.collection("productcollection")

    app.set("userCollectionObj",userCollectionObj)
    app.set("productCollectionObj",productCollectionObj)

    console.log(" db connection success")})
.catch(err=>console.log("error occured",err))


const userApp=require('./Api/userapi');
const productApp=require('./Api/productapi');

app.use('/user-api',userApp);

app.use('/product-api',productApp);


//handling invalid path
app.use((request,response,next)=>{
    response.send({message:`path ${request.url} is invalid`})
})

//handling errors
app.use((error,request,response,next) => {
    response.send({message:`${error.message}`})
})


const port=process.env.PORT;
app.listen(port,()=>console.log('server is listening on port ${port}'));