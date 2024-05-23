const express = require('express');
const app = express();
const router = require('./Routes/router');
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const blogRoutes = require("./Routes/blogRoutes");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const xlsx = require("xlsx");


const MONGODB_URI = "mongodb+srv://poojanambiplatforms:vXBvqSXLgTeftxwt@adiance-blog-db.r1vwjfr.mongodb.net/adiance-blog-db?retryWrites=true&w=majority";
const PORT = 8007; // Use any available port for HTTP

app.use(cors());
app.use(router);
app.use(express.json());
app.use("/api/blogs", blogRoutes);
app.use('/images', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('<h1>Welcome to Adiance App!</h1>');
});

const uploadDirectory = 'uploads/';

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

app.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    res.status(200).send('File uploaded.');
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).send("Error uploading file.");
  }
});


app.post("/subscribe", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).send("Name and Email are required");
  }

  const filePath = "./subscribers.xlsx";
  let workbook;

  // Check if file exists, if not create a new one
  try {
    workbook = xlsx.readFile(filePath);
  } catch (error) {
    workbook = xlsx.utils.book_new();
  }

  const sheetName = "Subscribers";
  const worksheet = workbook.Sheets[sheetName] || xlsx.utils.aoa_to_sheet([["Name", "Email"]]);

  // Append the new subscriber data
  const newRow = [name, email];
  xlsx.utils.sheet_add_aoa(worksheet, [newRow], { origin: -1 });

  workbook.Sheets[sheetName] = worksheet;
  xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
  xlsx.writeFile(workbook, filePath);

  res.send("Subscription successful!");
});


mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));
