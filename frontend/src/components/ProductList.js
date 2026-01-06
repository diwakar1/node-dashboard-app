import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    let result = await fetch("http://localhost:5000/products",{
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });
    const data = await result.json();
    setProducts(data);
  };
  console.log(products);

  const deleteProduct = async(id) =>{
    let result = await fetch(`http://localhost:5000/product/${id}`,{
        method: "Delete",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
    });
    const resultJsonData = await result.json();
     if(resultJsonData){
        getProducts()
     }
  }

  const searchHandle = async(event) =>{
    let key = event.target.value;
    if(key){
      let result = await fetch(`http://localhost:5000/search/${key}`)
      let modifiedData = await result.json();
      if(modifiedData){
        setProducts(modifiedData)
      }else{
        getProducts()
      }
    }else{
      getProducts()
    }
   
  }

  return (
    <div className="product-list">
      <h3>Products Details</h3>
      <input type="" className="search-product-box" placeholder="search Prodct" onChange={searchHandle}/>
      <ul>
        <li>S.No</li>
        <li>Name</li>
        <li>Price</li>
        <li>Category</li>
        <li>Comapany</li>
         <li>Operations</li>
      </ul>
        { products.length>0?products.map((product, index) => (
         <ul key={product._id || index}>
          <li>{index+1}</li>
          <li>{product.name}</li>
          <li>{product.price}</li>
          <li>{product.category}</li>
          <li>{product.company}</li>
          <li className="operation-buttons">
          <button onClick={()=>deleteProduct(product._id)} className="delete-btn">Delete</button>
          <Link to={"/update/" + product._id} className="update-btn">Update</Link>
          </li>
        </ul>
      )):<h2>No result found</h2>
      }
    </div>
  );
};
export default ProductList;
