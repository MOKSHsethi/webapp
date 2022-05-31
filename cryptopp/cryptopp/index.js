const app = require("./app");
const path = require('path');
const dotenv = require("dotenv").config();
const port = 4000;
const database = require('./config/mongoose')

database();


app.listen(port, () => {
    console.log(`Server is working on ${port}`);
});