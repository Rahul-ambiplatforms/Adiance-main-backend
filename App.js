const express=require('express');
const app = express();
const router=require('./Routes/router');
const cors=require("cors");
require("dotenv").config();

const port=8007;

app.use(router);
app.use(cors());
app.use(express.json());

app.listen(port, () =>{
    console.log(`listening on port ${port}`);
});