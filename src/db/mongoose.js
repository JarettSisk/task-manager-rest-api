const mongoose = require("mongoose");
mongoose.Promise = Promise;

// Connect to database
const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  });
  } catch (error) {
    console.log(error.message);
  }
 
}

connectToDB();









