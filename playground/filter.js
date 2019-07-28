// The array we want to filter
const currentArray = [1, 2, 3];
console.log(currentArray);

// When we filter, it will return a new array with all the items that pass the conditional logic
const filteredArray = currentArray.filter((item) => {
  if (item < 3) {
    return item;
  }
})
console.log(filteredArray);
