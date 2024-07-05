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
    //Variables from the body.
    let companyname = req.body.companyname;
    let jobtitle = req.body.jobtitle;
    let location = req.body.location;
    let startdate = req.body.startdate;
    let enddate = req.body.enddate;
    let description = req.body.description;

    //Object for errors.
    let error = {
        message: "",
        details: "",
        https_response: {}
    };

    //If any fields of information are empty.
    if(!companyname || !jobtitle || !location || !startdate || !enddate || !description) {
        
        //Error messages and response code.
        error.message = "Information saknas!";
        error.details = "För att lägga till ett jobb krävs företagets namn, titel på anställningen, stad där företaget finns, startdatum, slutdatum och en beskrivning av anställningen.";
        error.https_response.message = "Bad Request";
        error.https_response.code = 400;
        
        //Send error-message and return.
        res.status(400).json(error);
        return;
    } else if (companyname.length < 4 || companyname.length > 32) {
        //If companyname is too short or too long.
        error.message = "Felaktig information.";
        error.details = "Företagsnamn behöver vara 4-32 tecken långa.";
        error.https_response.message = "Bad request";
        error.https_response.code = 400;

        //Send error-message and return.
        res.status(400).json(error);
        return;
    } else if (jobtitle.length < 4 || jobtitle.length > 64) {
        //If job title is too short or too long.
        error.message = "Felaktig information.";
        error.details = "Titel på anställningen behöver vara 4-64 tecken lång.";
        error.https_response.message = "Bad request";
        error.https_response.code = 400;

        //Send error-message and return.
        res.status(400).json(error);
        return;
    } else if (location.length < 4 || location.length > 32) {
        //If location is too short or too long.
        error.message = "Felaktig information.";
        error.details = "Namnet på staden där företaget finns måste vara 4-32 tecken långt.";
        error.https_response.message = "Bad request";
        error.https_response.code = 400;
        
        //Send error-message and return.
        res.status(400).json(error);
        return;
    } else if (description.length < 10 || description.length > 128) {
        //If description is too short or too long.
        error.message = "Felaktig information.";
        error.details = "Beskrivningen behöver vara 4-128 tecken lång.";
        error.https_response.message = "Bad request";
        error.https_response.code = 400;

        //Send error-message and return.
        res.status(400).json(error);
        return;
    }

    //Try-catch to try do add a new job to the database.
    try {
        //Create job-object
        let job = {
            companyname: companyname,
            jobtitle: jobtitle,
            location: location,
            startdate: startdate,
            enddate: enddate,
            description: description
        }

        let result = await Job.create(job);

        //If there are no results the insert didn't work and 500 is shown, else show result.
        if(result === null) {
            return res.status(500).json({message: "Något gick fel: " + error});
        } else {
            return res.status(201).json({message: "Följande jobb har lagts till: ", job});
        }
    } catch (error) {
        return res.status(500).json({message: "Något gick fel: " + error});
    }
});

//Put /api/work/id.
app.put("/api/work/:id", async (req, res) => {
    
    //Variables from the body.
    let id = req.params.id;
    let companyname = req.body.companyname;
    let jobtitle = req.body.jobtitle;
    let location = req.body.location;
    let startdate = req.body.startdate;
    let enddate = req.body.enddate;
    let description = req.body.description;

    //Object for errors.
    let error = {
        message: "",
        details: "",
        https_response: {}
    };

    //If any fields of information are empty.
    if(!id || !companyname || !jobtitle || !location || !startdate || !enddate || !description) {
        
        //Error messages and response code.
        error.message = "Information saknas!";
        error.details = "För att uppdatera ett jobb krävs id, företagets namn, titel på anställningen, stad där företaget finns, startdatum, slutdatum och en beskrivning av anställningen.";
        error.https_response.message = "Bad Request";
        error.https_response.code = 400;
        
        //Send error-message and return.
        res.status(400).json(error);
        return;
    } else if (companyname.length < 4 || companyname.length > 32) {
        //If companyname is too short or too long.
        error.message = "Felaktig information.";
        error.details = "Företagsnamn behöver vara 4-32 tecken långa.";
        error.https_response.message = "Bad request";
        error.https_response.code = 400;

        //Send error-message and return.
        res.status(400).json(error);
        return;
    } else if (jobtitle.length < 4 || jobtitle.length > 64) {
        //If job title is too short or too long.
        error.message = "Felaktig information.";
        error.details = "Titel på anställningen behöver vara 4-64 tecken lång.";
        error.https_response.message = "Bad request";
        error.https_response.code = 400;

        //Send error-message and return.
        res.status(400).json(error);
        return;
    } else if (location.length < 4 || location.length > 32) {
        //If location is too short or too long.
        error.message = "Felaktig information.";
        error.details = "Namnet på staden där företaget finns måste vara 4-32 tecken långt.";
        error.https_response.message = "Bad request";
        error.https_response.code = 400;
        
        //Send error-message and return.
        res.status(400).json(error);
        return;
    } else if (description.length < 10 || description.length > 128) {
        //If description is too short or too long.
        error.message = "Felaktig information.";
        error.details = "Beskrivningen behöver vara 4-128 tecken lång.";
        error.https_response.message = "Bad request";
        error.https_response.code = 400;

        //Send error-message and return.
        res.status(400).json(error);
        return;
    }

    //Try to update the job
    try {
        //Create job-object
        let job = {
            companyname: companyname,
            jobtitle: jobtitle,
            location: location,
            startdate: startdate,
            enddate: enddate,
            description: description
        }

        let result = await Job.updateOne({_id: id}, {$set: {job}});

        //If there are no results the update didn't work.
        if(result === null) {
            return res.status(500).json({message: "Något gick fel: " + error});
        } else {
            return res.status(200).json({message: "Jobbet har uppdaterats med följande infO: " + job});
        }
    } catch (error) {
        return res.status(500).json({message: "Något gick fel: " + error});
    }
});

//Delete /api/work/id.
app.delete("/api/work/:id", async (req, res) => {
    //Variables
    let id = req.params.id;
    //Try to delete item based on id.
    try {
        let result = await Job.deleteOne({_id: id});

        if(result === null) {
            res.status(500).json({message: "Något gick fel: " + error});
        } else {
            res.status(200).json({message: "Jobbet med följande id har raderats: " + id});
        }
    } catch (error) {
        return res.status(500).json({message: "Något gick fel: " + error});
    }
});

//Start server.
app.listen(port, () => {
    console.log("Server running on port: " + port);
});