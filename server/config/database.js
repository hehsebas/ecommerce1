const mongoose = require("mongoose");

const URI =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@e-commerce.4nwpe.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`
const createConnection = async () => {
  await mongoose
    .connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log(`${process.env.DB} connected successfully`))
    .catch((err) => console.error(err));
};

module.exports = createConnection;
