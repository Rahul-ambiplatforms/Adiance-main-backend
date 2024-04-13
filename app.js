const express=require('express');
const app = express();
const https = require('https');
const router=require('./Routes/router');
const cors=require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const blogRoutes = require("./Routes/blogRoutes");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const MONGODB_URI = "mongodb+srv://poojanambiplatforms:vXBvqSXLgTeftxwt@adiance-blog-db.r1vwjfr.mongodb.net/adiance-blog-db?retryWrites=true&w=majority";
// Path to your SSL/TLS certificate and key
const privateKey = fs.readFileSync('/etc/letsencrypt/live/adiance.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/adiance.com/fullchain.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const PORT=443;
app.use(cors());
  
app.use(router);

app.use(express.json());
app.use("/api/blogs", blogRoutes);
app.use('/images', express.static(path.join(__dirname, 'uploads')));
app.get('/', (req, res) => {
  res.send('<h1>Welcome to Adiance App!</h1>');
});



const uploadDirectory = 'uploads/';

// Create the 'uploads/' directory if it doesn't exist
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Save uploaded files to the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Retain the original filename
  }
});
// Initialize Multer with the configured storage
// Initialize Multer with the configured storage
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Example limit: 10 MB
});


// POST endpoint for uploading images
app.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    // File uploaded successfully
    res.status(200).send('File uploaded.');
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).send("Error uploading file.");
  }
});

// // POST endpoint for uploading images
// app.post('/upload', upload.single('image'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }
//   // File uploaded successfully
//   res.status(200).send('File uploaded.');
// });

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));

