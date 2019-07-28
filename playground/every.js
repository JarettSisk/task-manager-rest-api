const obj = {
  name: "jj",
  age: 23
}

let keys = Object.keys(obj);
console.log(keys);

const array1 = ["name", "age"]

const test = keys.every((property) => {
  console.log(property);
  return array1.includes(property);
})

console.log(test);