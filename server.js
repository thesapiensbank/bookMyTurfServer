const express = require("express");
const cors = require("cors");
const session = require("express-session");
const mongoose = require("mongoose");
const http = require("http");
const https = require("https");
const fs = require("fs");
require("dotenv").config();
const { checkPrivilege } = require("./routes/commonutils");
const app = express();
const port = process.env.PORT || 5000;
let multer = require("multer");

//var upload = multer({ dest: 'public/images/' })

app.set("view engine", "ejs");
app.use(
  session({ secret: "mySecret", resave: false, saveUninitialized: false })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri = process.env.ATLAS_URI;

const privateKey = fs.readFileSync(
  "/etc/letsencrypt/live/bookmyturf.net/privkey.pem",
  "utf8"
);
const certificate = fs.readFileSync(
  "/etc/letsencrypt/live/bookmyturf.net/cert.pem",
  "utf8"
);
const ca = fs.readFileSync(
  "/etc/letsencrypt/live/bookmyturf.net/chain.pem",
  "utf8"
);

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("mongodb successfuly connected");
});

const indexRouter = require("./routes/index");
const turfRouter = require("./routes/turf");
const userRouter = require("./routes/user");

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname, { dotfiles: "allow" }));
app.use("/", indexRouter);
app.use("/turf", turfRouter);
app.use("/admin", userRouter);

var timestamp = "";
var fileNames = [];

//Define where project photos will be stored
var storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, __dirname + "/public/images/");
  },
  filename: function (request, file, callback) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    console.log(file);
    timestamp = Number(new Date());
    let filename = timestamp + "." + extension;
    fileNames.push(filename);
    callback(null, filename);
  },
});

// Function to upload project images
var upload = multer({ storage: storage });

app.post("/turf/upload", upload.array("image", 9), function (req, res, err) {
  console.log(req, req.session);
  if (checkPrivilege(req)) {
    console.log(req.body);

    if (err) {
      console.log("error");
      console.log(err);
    }
    var file = req.files;
    //res.end();
    console.log(fileNames);

    res.json(fileNames);
    fileNames = [];
    //res.sendStatus(200);
  }
});

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  console.log(`https://127.0.0.1:${port}`);
});
