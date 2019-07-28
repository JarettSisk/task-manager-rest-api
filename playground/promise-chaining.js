require("../src/db/mongoose");
const User = require("../src/models/user");

// 5d34cf34df563d42745c4d08

// User.findByIdAndUpdate("5d34da691fd642531c7733c2", { age: 1})
// .then((user) => {
//   console.log(user)
//   return User.countDocuments({ age: 1});
// })
// .then((result) => {
//   console.log(result);
// })
// .catch((err) => {
//   console.log(err);
// })

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age: age});
  const count = await User.countDocuments({age});
  return count;
}

updateAgeAndCount("5d34da691fd642531c7733c2", 2).then((count) => {
  console.log(count);
}).catch((err) => {
  console.log(err);
})
