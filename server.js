const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.set('view engine', 'ejs');
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
const managerRouter = require('./routes/manager');
const adminRouter = require('./routes/admin');
 
app.use(express.static(__dirname + '/public'));
app.use('/',indexRouter);
app.use('/manager',managerRouter);
app.use('/admin',adminRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
