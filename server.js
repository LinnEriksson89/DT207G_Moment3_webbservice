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

//Create a schema.
const jobSchema = mongoose.Schema({
    companyname: {
        type: String,
        required: true
    },
    jobtitle: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    startdate: {
        type: Date,
        required: true
    },
    enddate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

//Create a model.
const Job = mongoose.model('Job', jobSchema);

//Start server.
app.listen(port, () => {
    console.log("Server running on port: " + port);
});