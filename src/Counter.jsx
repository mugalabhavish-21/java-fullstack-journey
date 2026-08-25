import { useState } from 'react';

export const Counter = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount((prev) => {
      console.log("First updated fn: prev count = ", prev);
      return prev + 1;
    });

    setCount((prev) => {
      console.log("Second updated fn: prev count = ", prev);
      return prev + 5;
    });

    setCount((prev) => {
      console.log("Third updated fn: prev count = ", prev);
      return prev + 10;
    });
  };

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
};