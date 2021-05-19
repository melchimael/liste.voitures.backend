const port = 3001;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.listen(port, ()=>{
    console.log("server running");
})
