let express = require("express");
let fs = require("fs");
let cors = require("cors");

let app = express();
app.use(cors());

// Create application/x-www-form-urlencoded parser
let urlencodedParser = express.urlencoded({ extended: false });
app.use(express.json());

////////////////////////////////////////////////////////////
// API endpoints

// GET all courses
app.get("/api/courses", function (req, res) {
    console.log("LOG: Got a GET request for all courses");

    let data = fs.readFileSync(__dirname + "/data/" + "courses.json", "utf8");
    data = JSON.parse(data);

    // LOG returned data
    console.log("LOG: Returned courses -> ");
    console.log(data);

    res.end(JSON.stringify(data));
});

// GET one course by id
app.get("/api/courses/:id", function (req, res) {
    let id = req.params.id;
    console.log("LOG: Got a GET request for course " + id);

    let data = fs.readFileSync(__dirname + "/data/" + "courses.json", "utf8");
    data = JSON.parse(data);

    // Find the course
    let match = data.find(c => c.id == id);

    // If course not found
    if (match == undefined) {
        console.log("LOG: **NOT FOUND**: course " + id + " does not exist!");
        res.status(404).send();   // not found
        return;
    }

    // LOG returned data
    console.log("LOG: Returned course -> ");
    console.log(match);

    res.end(JSON.stringify(match));
});

/*
app.post("/api/courses", urlencodedParser, function (req, res) {
    console.log("LOG: Got a POST request for courses");
    console.log("LOG: Mesage body --------> ");
    console.log(JSON.stringify(req.body));
    res.status(201).json(course);
 })

 app.put("/api/courses/:id", function (req, res) {
    console.log("LOG: Got a PUT request for a course");
    res.status(200).send();
 })
 
 app.delete("/api/courses/:id", function (req, res) {
    console.log("LOG: Got a DELETE request for a course");
    res.status(200).send();
 })
*/

/////////////////////////////////////////////////////
// Start the server

// app.use(express.static("public"));

let server = app.listen(8081, function () {
    let port = server.address().port;
    console.log("LOG: App listening at port %s", port);
});
