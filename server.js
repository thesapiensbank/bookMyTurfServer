const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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
const exerciseRouter = require('./routes/exercises');
const userRouter = require('./routes/user');
 
app.use(express.static(__dirname + '/public'));
app.use('/',indexRouter);
app.use('/exercises',exerciseRouter);
app.use('/users',userRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
