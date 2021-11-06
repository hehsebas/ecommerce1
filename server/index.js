//Imports
require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const cors = require("cors");
const products = require("./routes/products.routes");
const ventas = require("./routes/sales.routes");
const usuarios = require("./routes/users.routes");
const createConnection = require("./config/database");

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

//DB connection
createConnection();

//Routes
app.use("/products", products);
app.use("/sales", ventas);
app.use("/users", usuarios);

//HTTP request
app.get("/", async (_, res) => {
  res.send("Hello World");
});

//Start server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
