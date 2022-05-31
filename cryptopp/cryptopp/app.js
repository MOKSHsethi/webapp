const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser")
const cors = require("cors");

const userroute = require('./routers/userroute');


app.use(cookieParser())
app.use(bodyParser.json());

const corsOption = {
    credentials: true,
    origin: [
        'http://localhost:3000'
    ]
}

app.use(cors(corsOption))
app.use('/api/user', userroute);

app.get('/', (req, res) => {
    res.send('Hi i am from hungrypizza')
})

module.exports = app