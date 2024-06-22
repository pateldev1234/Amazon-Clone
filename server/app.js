require("dotenv").config;
const express  = require("express");
const app = express();
const mongoose = require("mongoose");
require("./db/conn")
const cookieParser = require("cookie-parser");

const cors = require("cors");

const Products  = require("./models/productSchema");




const DefaultData = require("./default");
// require("./db/conn");
// const Products = require('./models/productSchema');
// const DefaultData = require("./default");

app.use(express.json());
app.use(cors());
app.use(cookieParser(""));
const router = require("./routes/router");
app.use(router);

const port = 8000;

app.listen(port,()=>
{
    
    console.log("Server is running at port number 8000");
});

DefaultData();