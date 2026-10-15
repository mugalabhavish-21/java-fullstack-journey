export const ProductCard = ({ product, quantity, onAddToCart }) => {
  return (
    <li>
      {product.name} - ${product.price.toFixed(2)}
      <button onClick={() => onAddToCart(product.id)}>Add item</button>
      <span> Quantity: {quantity}</span>
    </li>
  );
};