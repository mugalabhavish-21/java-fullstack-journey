import {useState} from "react";
    export const LoginButton = () => {
        const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
      {isLoggedIn ? 'Logout' : 'Login'}
    </button>
  );
}