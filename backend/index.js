const express = require('express');
const User = require('./db/user');
require('./db/config');
const Product = require('./db/product');

const cors = require('cors');
const app = express();

const Jwt = require('jsonwebtoken');
const jwtkey = 'e-comm';


app.use(express.json());
app.use(cors());

app.post("/register", async (req,resp)=>{
    
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    Jwt.sign({result},jwtkey,{ expiresIn: "2h" },(err,token)=>{
        if(err)
        {
            resp.send({result: "something went wrong"})
        }
        resp.send( { result, auth:token})
    })
});

app.post("/login", async (req,resp)=>{
    console.log(req.body);
    if(req.body.password && req.body.email){

    let user =await User.findOne(req.body).select("-password");
    if(user)
    {
        Jwt.sign({user},jwtkey,{ expiresIn: "2h" },(err,token)=>{
            if(err)
            {
                resp.send({result: "something went wrong"})
            }
            resp.send( { user, auth:token})
        })
        
    }else{
        resp.send("No User Found")
    }
}else{
    resp.send("No User Found")
}
})

app.post("/add-product",verifyToken, async (req , resp )=>{
    let product = new Product(req.body);
    let result = await product.save();
    resp.send(result);
});

app.get("/products", verifyToken, async (req, resp)=>{
    let products = await Product.find();
    if(products.length>0){
        resp.send(products)
    } else{
        resp.send({result:"No Products found"})
    }
});

app.delete("/product/:id",verifyToken, async (req,resp)=>{
    
    const result = await Product.deleteOne({_id:req.params.id})

    resp.send(result)
});

app.get("/product/:id", verifyToken, async (req,resp)=>{
    let result = await Product.findOne({_id:req.params.id});
    if(result)
    {
        resp.send(result)
    } else{
        resp.send({result:"No Record Found"});
    }
});

app.put("/product/:id",verifyToken, async (req,resp)=>{
    let result = await Product.updateOne(
        {_id:req.params.id},
        {
            $set:req.body
        }
    )
    resp.send(result);
});

app.get("/search/:key", verifyToken, async(req,resp)=>{
    let result =await Product.find({
        "$or":[
            {name:{$regex:req.params.key}},
            {company:{$regex:req.params.key}},
            {catagory:{$regex:req.params.key}}
        ]
    }); 
    resp.send(result); 
});


function verifyToken(req,resp,next){
let token = req.headers['authorization'];
if(token) {
    token = token.split(' ')[1];
    console.warn("middleware called", token);
    Jwt.verify(token, jwtkey, (err, valid)=>{
        if(err){
            resp.send({result: "please provide valid token with header"})
        }else{
                next();
        }
    })
}else{
    resp.send({result: "please add token with headers"})
}

   


   
}




app.listen(6060);