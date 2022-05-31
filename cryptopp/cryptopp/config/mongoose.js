"use strict";
const mongoose = require("mongoose");

const connectDB = () => {
    mongoose.connect(
        process.env.MONGO_DB_LOCAL_URL,
        {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }
    ).then((data) => {
        console.log(`MongoDb connected with server ${data.connection.host}`)
    })
};

module.exports = connectDB;