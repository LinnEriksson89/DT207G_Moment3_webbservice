/* DT207G - Backend-baserad webbutveckling
 * Moment 3
 * Linn Eriksson, VT24
 */

//Constants and requirements.
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;
require('dotenv').config();

mongoose.connect("mongodb://127.0.0.1:27017/dt207g_moment3")
    .then(() => {
        console.log("Connected to mongoDB");
    }).catch((error) => {
        console.log("Error connecting to database: " + error);
    });


//Start server.
app.listen(port, () => {
    console.log("Server running on port: " + port);
});