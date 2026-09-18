let arr = [1, 2, 3, 4, 5];
let sum = arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
let product = arr.reduce((accumulator, currentValue) => accumulator * currentValue, 1);
console.log("The sum of the array elements is:", sum);
console.log("The product of the array elements is:", product);