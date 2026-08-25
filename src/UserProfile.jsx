import React from "react";
function Greet() {
  return <h4>GOOD MORNING !!</h4>;  

}

export default Greet;
export const HelloWithoutJsx = () => {
  return React.createElement('h4', null, 'GOOD MORNING !! Babe');
}