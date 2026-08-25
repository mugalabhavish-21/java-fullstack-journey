import { useReducer } from "react";

const products = [
  { id: 1, name: "React Course", price: 29.99 },
  { id: 2, name: "JavaScript Guide", price: 19.99 },
  { id: 3, name: "CSS Essentials", price: 14.99 },
  { id: 4, name: "UX Basics", price: 24.99 },
];

const initialState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const product = action.payload;
      const existingItemIndex = state.items.findIndex((item) => item.id === product.id);

      if (existingItemIndex !== -1) {
        const updatedItems = state.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
        );

        return {
          items: updatedItems,
          totalItems: state.totalItems + 1,
          totalAmount: Number((state.totalAmount + product.price).toFixed(2)),
        };
      }

      return {
        items: [...state.items, { ...product, quantity: 1 }],
        totalItems: state.totalItems + 1,
        totalAmount: Number((state.totalAmount + product.price).toFixed(2)),
      };
    }

    case "REMOVE_FROM_CART": {
      const productId = action.payload;
      const item = state.items.find((product) => product.id === productId);

      if (!item) return state;

      if (item.quantity === 1) {
        const updatedItems = state.items.filter((product) => product.id !== productId);
        return {
          items: updatedItems,
          totalItems: state.totalItems - 1,
          totalAmount: Number((state.totalAmount - item.price).toFixed(2)),
        };
      }

      const updatedItems = state.items.map((product) =>
        product.id === productId ? { ...product, quantity: product.quantity - 1 } : product
      );

      return {
        items: updatedItems,
        totalItems: state.totalItems - 1,
        totalAmount: Number((state.totalAmount - item.price).toFixed(2)),
      };
    }

    case "CLEAR_CART":
      return initialState;

    default:
      return state;
  }
};

export const Shooppingcaart = () => {
  const [cart, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="min-vh-100 bg-dark text-light">
      <nav className="navbar navbar-expand-lg navbar-dark bg-black border-bottom border-secondary sticky-top shadow-sm">
        <div className="container py-3">
          <a className="navbar-brand fw-bold text-warning" href="#products">
            Velvet Cart
          </a>
          <div className="d-flex align-items-center gap-4 ms-auto">
            <div className="navbar-nav d-flex flex-row gap-3">
              <a className="nav-link text-light" href="#products">
                Products
              </a>
              <a className="nav-link text-light" href="#checkout">
                Checkout
              </a>
            </div>
            <a className="text-decoration-none text-light-emphasis" href="#checkout" aria-label="View shopping cart">
              <span className="badge bg-warning text-dark rounded-pill px-3 py-2">
                {cart.totalItems} items
              </span>
              <span className="fw-semibold ms-2">${cart.totalAmount.toFixed(2)}</span>
            </a>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        <div className="row g-4 align-items-start">
          <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="mb-0 text-white">Curated Collection</h2>
              <span className="badge bg-secondary-subtle text-light border border-secondary rounded-pill px-3">
                New Arrivals
              </span>
            </div>

            <div className="d-grid gap-3">
              {products.map((product) => (
                <div key={product.id} className="card border-0 bg-secondary-subtle shadow-sm">
                  <div className="card-body d-flex justify-content-between align-items-center py-3">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <h3 className="h5 mb-0 text-white">{product.name}</h3>
                        <span className="badge text-bg-warning text-dark rounded-pill">Popular</span>
                      </div>
                      <p className="text-light-emphasis mb-0">${product.price.toFixed(2)}</p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-warning fw-semibold"
                      onClick={() => dispatch({ type: "ADD_TO_CART", payload: product })}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-4" id="checkout">
            <div className="card bg-black border border-secondary shadow-lg">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="h4 mb-0 text-white">Checkout</h2>
                  <span className="badge bg-warning text-dark rounded-pill">{cart.totalItems} items</span>
                </div>

                {cart.items.length === 0 ? (
                  <p className="text-light-emphasis mb-4">Your cart is empty.</p>
                ) : (
                  <ul className="list-group list-group-flush mb-3">
                    {cart.items.map((item) => (
                      <li key={item.id} className="list-group-item bg-transparent px-0 border-secondary text-light">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <strong>{item.name}</strong>
                            <div className="text-light-emphasis small">Qty: {item.quantity}</div>
                          </div>
                          <div className="btn-group btn-group-sm" role="group">
                            <button
                              type="button"
                              className="btn btn-outline-light"
                              onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item.id })}
                            >
                              -
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-light"
                              onClick={() => dispatch({ type: "ADD_TO_CART", payload: item })}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="border-top border-secondary pt-3 mt-3">
                  <div className="d-flex justify-content-between mb-2 text-light-emphasis">
                    <span>Subtotal</span>
                    <span>${cart.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2 text-light-emphasis">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3 fw-bold text-white">
                    <span>Total</span>
                    <span>${cart.totalAmount.toFixed(2)}</span>
                  </div>

                  <button type="button" className="btn btn-warning w-100 fw-semibold mb-2">
                    Proceed to Checkout
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-light w-100"
                    onClick={() => dispatch({ type: "CLEAR_CART" })}
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};