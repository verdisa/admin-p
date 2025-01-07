import React, { useState } from "react";
import "./Pos.css";

const products = [
  { id: 1, name: "Apple", category: "Fruits" },
  { id: 2, name: "Banana", category: "Fruits" },
  { id: 3, name: "Carrot", category: "Vegetables" },
  { id: 4, name: "Tomato", category: "Vegetables" },
];

const categories = ["Fruits", "Vegetables"];

const PosTable = () => {
  const [cart, setCart] = useState([]);

  const handleDrop = (event, product) => {
    event.preventDefault();
    setCart((prevCart) => [...prevCart, product]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className="container">
      <div className="products">
        <h2>Products</h2>
        {categories.map((category) => (
          <div key={category} className="category">
            <h3>{category}</h3>
            <div className="product-list">
              {products
                .filter((product) => product.category === category)
                .map((product) => (
                  <div
                    key={product.id}
                    className="product"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("product", JSON.stringify(product))}
                  >
                    {product.name}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      <div
        className="cart"
        onDrop={(e) => handleDrop(e, JSON.parse(e.dataTransfer.getData("product")))}
        onDragOver={handleDragOver}
      >
        <h2>Cart</h2>
        {cart.length === 0 ? (
          <p>Drag products here</p>
        ) : (
          cart.map((item, index) => (
            <div key={index} className="cart-item">
              {item.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PosTable;
