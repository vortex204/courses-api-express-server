let express = require('express');
let fs = require("fs");
let cors = require('cors');
let app = express();


app.use(express.json())
app.use(cors())

// Create application/x-www-form-urlencoded parser
let urlencodedParser = express.urlencoded({ extended: false })

function logOneCourse(course)
{
    console.log("ID: " + course.id + 
                " " + course.dept + " " + course.courseNum + 
                " Name:" + course.courseName + 
                " Instructor:" + course.instructor + 
                " Starts:" + course.startDate +
                " Num Days:" + course.numDays);
}

function logArrayOfCourses(arr)
{
    for(let i=0; i < arr.length; i++)
    {
        logOneCourse(arr[i])
    }
}

app.get('/', function (req, res) {
   console.log("Got a GET request at /");
   res.send('Hello World');
})

app.get('/api/courses', function (req, res) {
    console.log("Got a GET request for courses");
    let data = fs.readFileSync( __dirname + "/data/" + "courses.json", 'utf8');
    data = JSON.parse(data);
    console.log( "Returned data is: ");
    logArrayOfCourses(data);
    res.end( JSON.stringify(data) );
});

app.get('/api/courses/:id', function (req, res) {
    let id = req.params.id;
    console.log("Got a GET request for course " + id);
    let data = fs.readFileSync( __dirname + "/data/" + "courses.json", 'utf8');
    data = JSON.parse(data);
    console.log( "In callback after read");
    let match = data[id - 1];
    console.log( "Returned data is: " );
    logOneCourse(match);
    res.end( JSON.stringify(match) );
})

/*
 *   This version uses query string parameters
 *   and just echos the received data
 *
app.post('/api/courses', function (req, res) {
    console.log("Got a POST request for courses");

    // Prepare output in JSON format
    let course = {
        id:req.query.id,
        dept:req.query.dept,        
        courseNum:req.query.coursenum,
        courseName:req.query.coursename,
        instructor:req.query.instructor,
        startDate:req.query.starts,
        numDays:req.body.numdays
    };
    logOneCourse(course);
    res.end(JSON.stringify(course));
 })
 */

app.post('/api/courses', urlencodedParser, function (req, res) {
    console.log("Got a POST request for courses");
    console.log("BODY -------->" + JSON.stringify(req.body));

    let data = fs.readFileSync( __dirname + "/data/" + "courses.json", 'utf8');
    data = JSON.parse( data );

    console.log( "Original data: " );
    logArrayOfCourses(data);

    let course = {
        id:data.length + 1,
        dept:req.body.dept,        
        courseNum:req.body.coursenum,
        courseName:req.body.coursename,
        instructor:req.body.instructor,
        startDate:req.body.starts,
        numDays:req.body.numdays
    };
    console.log( "New course: " );
    logOneCourse(course);

    data[data.length] = course;

    console.log( "New data after add: " );
    logArrayOfCourses(data);

    fs.writeFileSync(__dirname + "/data/" + "courses.json", JSON.stringify(data));
   
    console.log('New course saved!');
    res.status(200).send();
 })



 /*
 app.put('/api/courses', function (req, res) {
    console.log("Got a PUT request for courses");
    res.send('Courses PUT');
 })
 
 app.delete('/api/courses', function (req, res) {
    console.log("Got a DELETE request for courses");
    res.send('Courses DELETE');
 })
 */
 
app.use(express.static('public'));

let server = app.listen(8081, function () {
   //let host = server.address().address
   let port = server.address().port
   
   console.log("App listening at port %s", port)
})
