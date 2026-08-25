export const CartSummary = ({ totalItems, totalPrice }) => {
  return (
    <section>
      <h3>Total items: {totalItems}</h3>
      <h3>Total price: ${totalPrice.toFixed(2)}</h3>
    </section>
  );
};