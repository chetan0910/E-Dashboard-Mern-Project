import React, { useState } from "react";
import { useNavigate } from "react-router-dom";



const AddProduct = () =>{

const [name,setName] = useState('');
const [price,setPrice] = useState('');
const [catagory,setCatagory] = useState('');
const [company,setCompany] = useState('');
const [error,setError] =  useState(false);
const navigate = useNavigate();

const addProduct = async () => {
    

    console.warn(!name);
    if(!name || !price || !catagory || !company )
    {
        setError(true);
        return false;
    }

    console.warn(name,price,catagory,company);
    const userId = JSON.parse(localStorage.getItem('user'))._id;

    let result = await fetch("http://localhost:6060/add-product",{
        method:'post',
        body:JSON.stringify({name,price,catagory,company,userId}),
        headers:{
            "Content-Type":"application/json",
            authorization:`bearer ${JSON.parse(localStorage.getItem('token'))}`
            
        }
    });
    result = await result.json();
    console.warn(result);

    navigate('/');

    
    
}


    return(
        <div className="product">
            <h1>Add Product</h1>
            <input type="text" placeholder="Enter product name" className="inputBox" value={name}
            onChange={(e)=>{setName(e.target.value)}}
            />
           { error && !name && <span className="invalid-input" >Enter valid name</span>}

            <input type="text" placeholder="Enter product price" className="inputBox" value={price}
            onChange={(e)=>{setPrice(e.target.value)}}
            />
            { error && !price && <span className="invalid-input" >Enter valid price</span>}

            <input type="text" placeholder="Enter producr catagory" className="inputBox" value={catagory}
            onChange={(e)=>{setCatagory(e.target.value)}}
            />
            { error && !catagory && <span className="invalid-input" >Enter valid catagory</span>}

            <input type="text" placeholder="Enter product company" className="inputBox" value={company}
            onChange={(e)=>{setCompany(e.target.value)}}
            />
            { error && !company && <span className="invalid-input" >Enter valid company</span>}

            <button className="appbutton" onClick={addProduct} >Add Product</button>
        </div>
    )

}

export default AddProduct;