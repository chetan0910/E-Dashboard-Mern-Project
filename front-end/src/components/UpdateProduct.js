import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateProduct = () =>{

const [name,setName] = useState('');
const [price,setPrice] = useState('');
const [catagory,setCatagory] = useState('');
const [company,setCompany] = useState('');

const params = useParams();

const navigate = useNavigate();

useEffect(()=>{
    
    getProductDetails();
},[])

const getProductDetails = async ()=>{
    console.log(params)
    let result = await fetch(`http://localhost:6060/product/${params.id}`, {
        headers:{
            authorization:`bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
    });
    result=await result.json();
    
    setName(result.name);
    setPrice(result.price);
    setCatagory(result.catagory);
    setCompany(result.company);
}


const updateProduct = async () => {
console.warn(name,price,company,catagory);

let result = await fetch(`http://localhost:6060/product/${params.id}`, {
    method:'Put',
    body:JSON.stringify({name,price,company,catagory}),
    headers:{
        'Content-Type':"application/json",
            authorization:`bearer ${JSON.parse(localStorage.getItem('token'))}`
        
    }

});
result = await result.json();
console.warn(result);
navigate("/");
    
}


    return(
        <div className="product">
            <h1>Update Product</h1>
            <input type="text" placeholder="Enter product name" className="inputBox" value={name}
            onChange={(e)=>{setName(e.target.value)}}
            />
           

            <input type="text" placeholder="Enter product price" className="inputBox" value={price}
            onChange={(e)=>{setPrice(e.target.value)}}
            />
            

            <input type="text" placeholder="Enter producr catagory" className="inputBox" value={catagory}
            onChange={(e)=>{setCatagory(e.target.value)}}
            />
            

            <input type="text" placeholder="Enter product company" className="inputBox" value={company}
            onChange={(e)=>{setCompany(e.target.value)}}
            />
            

            <button className="appbutton" onClick={updateProduct} >Update Product</button>
        </div>
    )

}

export default UpdateProduct;