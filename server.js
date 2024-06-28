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

//Use JSON in API-calls.
app.use(express.json());

//Activate CORS middleware for all routes.
app.use(cors({
    methods: "GET, PUT, POST, DELETE"
}));

//To be able to send data with post.
app.use(express.urlencoded({extended:true}));

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
        required: [true, "Du måste ange företagets namn."]
    },
    jobtitle: {
        type: String,
        required: [true, "Du måste ange anställningens titel."]
    },
    location: {
        type: String,
        required: [true, "Du måste ange staden företaget låg i."]
    },
    startdate: {
        type: Date,
        required: [true, "Du måste ange ett startdatum."]
    },
    enddate: {
        type: Date,
        required: [true, "Du måste ange ett slutdatum."]
    },
    description: {
        type: String,
        required: [true, "Du måste ange en beskrivning av anställningen."]
    }
});

//Create a model.
const Job = mongoose.model('Job', jobSchema);

//All routes.
//Get /api
app.get("/api", async (req, res) => {
    res.json({message: "Välkommen till detta API."});
});

//Get /api/work.
app.get("/api/work", async (req, res) => {
    //try-catch for trying to get information from database.
    try {
        let result = await Job.find({});

        //If there are no results, show 404, else send result.
        if(result.length === 0) {
            res.status(404).json({message: "Inga jobb hittades."});
        } else {
            return res.status(200).json(result);
        }
    } catch(error) {
        return res.status(500).json({message: "Något gick fel: " + error});
    }
});

//Get individual job via /api/work/id.
app.get("/api/work/:id", async (req, res) => {
    //Could be argued that using the ObjectId here isn't the most userfriendly.
    //As it's 30 degrees celsius here currently I'm not going to care.
    let id = req.params.id;

    //Try-catch to get information from database.
    try {
        let result = await Job.findOne({_id: id});

        //If there are no results, show 404, else send result.
        if(result === null) {
            res.status(404).json({message: "Inget jobb med det id-numret hittades."});
        } else {
            return res.status(200).json(result);
        }
    } catch (error) {
        //If there's an error
        return res.status(500).json({message: "Något gick fel: " + error});
    }
});

//Post /api/work/.
app.post("/api/work", async (req, res) => {
    //Try-catch to try do add a new job to the database.
    try {
        //
    } catch (error) {
        return res.status(500).json({message: "Något gick fel: " + error});
    }
});

//Put /api/work/id.
app.put("/api/work", async (req, res) => {
    //
    try {
        //
    } catch (error) {
        return res.status(500).json({message: "Något gick fel: " + error});
    }
});

//Delete /api/work/id.
app.delete("/api/work", async (req, res) => {
    //
    try {
        //
    } catch (error) {
        return res.status(500).json({message: "Något gick fel: " + error});
    }
});

//Start server.
app.listen(port, () => {
    console.log("Server running on port: " + port);
});