import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import './ProductList.css';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Category {
  name: string;
  products: Product[];
}

interface ProductListProps {
  category: Category;
}

const ProductList: React.FC<ProductListProps> = ({ category }) => {
  return (
    <Droppable droppableId={category.name}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef} className="product-list">
          {category.products.map((product, index) => (
            <Draggable key={product.id} draggableId={product.id} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="product-item"
                >
                  <span className="product-name">{product.name}</span>
                  <span className="product-price">${product.price.toFixed(2)}</span>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default ProductList;

