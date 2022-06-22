// const exp=require('express')
// const userApp=exp.Router()

// userApp.use(exp.json());




// const middleware1=(request,response,next)=>{
//     console.log("Middleware-1 executed");
//     next()
// }

// const middleware2=(request,response,next)=>{
//     console.log("Middleware-2 executed");
//     next()
// }

// const middleware3=(request,response,next)=>{
//     console.log("Middleware-3 executed");
//     next()
// }

// const middleware4=(request,response,next)=>{
//     console.log("Middleware-4 executed");
//     next()
// }


// userApp.use(middleware1)
// userApp.use(middleware2)
// userApp.use(middleware3)
// userApp.use(middleware4)



// //data
// let users=[
//     {
//         id:1,
//         name:'rishi',
//         age:19
//     },
//     {
//         id:2,
//         name:'vicky',
//         age:25
//     }
// ]
// userApp.get('/getusers',(request,response)=>{
//     response.send({message:"all users",payload:users});
// });

// userApp.get('/getuser/:id',(request,response)=>{
//     let userId=(+request.params.id);
//     let userObj=users.find(userObj=>userObj.id==userId);
//     console.log(userObj)
//     if(userObj==undefined){
//         response.send({message:"user not existed"})    }
//     else{
//         response.send({message:"user found",payload:userObj})
//     }
// });

// userApp.post('/create-user',middleware3,(request,response)=>{
//     let newUser=request.body;
//     users.push(newUser);
//     response.send({message:"new user created"})
// });

// userApp.put('/update-user',(request,response)=>{
//     let modifiedObj=request.body;
//     let userId=(+request.params.id)
//     let index =users.find(element => element.id ==userId)
//     users.splice(index,1,modifiedObj)
//     response.send({message:"updated user"})
// })

// userApp.delete('/remove-user/:id',middleware4,(request,response)=>{

//     let userId=(+request.params.id)
//     let index =users.find(element => element.id ==userId)
//     users.splice(index,1)
//     response.send({message:"deleted user"})
// })


//create router to handle user api reqs
const exp = require("express");
const userApp = exp.Router();
const expressAsyncHandler = require("express-async-handler");
//import bcryptjs for password hashing
const bcryptjs = require("bcryptjs");
//import jsonwebtoken to create token
const jwt=require("jsonwebtoken")

require("dotenv").config()

//to extract body of request object
userApp.use(exp.json());

//USER API Routes

//create route to handle '/getusers' path
userApp.get(
  "/getusers",
  expressAsyncHandler(async (request, response) => {
    //get userCollectionObject
    let userCollectionObject = request.app.get("userCollectionObject");
    //get all users
    let users = await userCollectionObject.find().toArray();
    //send res
    response.send({ message: "Users list", payload: users });
  })
);







//create route to user login
userApp.post(
  "/login",
  expressAsyncHandler(async (request, response) => {
    //get userCollectionObject
    let userCollectionObject = request.app.get("userCollectionObject");
    //get user credentials obj from client
    let userCredObj=request.body
    //seacrh for user by username
    let userOfDB=await userCollectionObject.findOne({username:userCredObj.username});
    //if username not existed
    if(userOfDB==null){
      response.send({message:"Invalid user"})
    }
    //if username existed
    else{
      //compare passwords
      let status=await bcryptjs.compare(userCredObj.password,userOfDB.password);
      //if passwords not matched
      if(status==false){
        response.send({message:"Invalid password"})
      }
      //if passwords are matched
      else{
        //create token
        let token=jwt.sign({username:userOfDB.username},process.env.SECRET_KEY,{expiresIn:60})
        //send token
        response.send({message:"login success",payload:token,userObj:userOfDB})
      }
    }
  })
);










//create a route to 'create-user'
userApp.post(
  "/create-user",
  expressAsyncHandler(async (request, response) => {
    //get userCollectionObject
    let userCollectionObject = request.app.get("userCollectionObject");
    //get userObj from client
    let newUserObj = request.body;
    //seacrh for user by username
    let userOfDB = await userCollectionObject.findOne({
      username: newUserObj.username,
    });
    //if user existed
    if (userOfDB !== null) {
      response.send({
        message: "Username has already taken..Plz choose another",
      });
    }
    //if user not existed
    else {
      //hash password
      let hashedPassword = await bcryptjs.hash(newUserObj.password, 6);
      //replace plain password with hashed password in newUserObj
      newUserObj.password = hashedPassword;
      //insert newUser
      await userCollectionObject.insertOne(newUserObj);
      //send response
      response.send({ message: "New User created" });
    }
  })
);

//create a route to modify user data


//create a route to delete user by username


//export userApp
module.exports = userApp;
