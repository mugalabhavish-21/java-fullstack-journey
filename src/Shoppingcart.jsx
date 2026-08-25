import { useState } from "react";
import { CartSummary } from "./CartSummary.jsx";
import { ProductCard } from "./ProductCard.jsx";

const products = [
  { id: "reactCourse", name: "React Course", price: 29.99 },
  { id: "javascriptCourse", name: "JavaScript Course", price: 19.99 },
];

export const Shoppingcart = () => {
  const [cartItems, setCartItems] = useState({
    reactCourse: 0,
    javascriptCourse: 0,
  });

  const addItem = (productId) => {
    setCartItems((currentItems) => ({
      ...currentItems,
      [productId]: currentItems[productId] + 1,
    }));
  };
  const clearCart = () => {
    setCartItems({
      reactCourse: 0,
      javascriptCourse: 0,
    });
  }


  const totalItems = products.reduce(
    (total, product) => total + cartItems[product.id],
    0,
  );
  const totalPrice = products.reduce(
    (total, product) => total + cartItems[product.id] * product.price,
    0,
  );
  const removeItem = (productId) => {
    setCartItems((currentItems) => ({
      ...currentItems,
      [productId]: Math.max(currentItems[productId] - 1, 0),
    }));
  } 

  return (
    <div>
      <h2>Shopping Cart</h2>
      <ul>
        {products.map((product) => (
          <><ProductCard
                key={product.id}
                product={product}
                quantity={cartItems[product.id]}
                onAddToCart={addItem} />
                <button onClick={() => removeItem(product.id)}>Remove Item</button></>
        ))}
      </ul>
      <CartSummary totalItems={totalItems} totalPrice={totalPrice}
         />
         <button onClick={clearCart}>Clear Cart</button>    
    </div>
  );
};
