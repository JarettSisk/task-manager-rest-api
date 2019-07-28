require("../src/db/mongoose");
const Task = require("../src/models/task");

// Task.findByIdAndDelete("5d34d68b38053b2dd4df08c5")
// .then((task) => {
//   console.log(task);
//   return Task.countDocuments({ completed: false})
// })
// .then((result) => {
//   console.log(result);
// })
// .catch((err) => {
//   console.log(err);
// })

const deleteTaskAndCount = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  const count = Task.countDocuments({completed: false});
  return count;
}

deleteTaskAndCount("5d34d68b38053b2dd4df08c5").then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err);
})