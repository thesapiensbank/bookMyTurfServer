const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


app.set('view engine', 'ejs');
app.use(session({secret: 'mySecret', resave: false, saveUninitialized: false}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

const connection = mongoose.connection;
connection.once('open',()=>{
    console.log("mongodb successfuly connected")
})

const indexRouter = require('./routes/index')
const turfRouter = require('./routes/turf');
const userRouter = require('./routes/user');
 
app.use(express.static(__dirname + '/public'));
app.use('/',indexRouter);
app.use('/turf',turfRouter);
app.use('/admin',userRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
