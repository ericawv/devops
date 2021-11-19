// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '0625800d46d34cd58817b52ca163302f',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors');
app.use(express.json());
app.use(cors());

// student data
const students = [ 'jimmy', 'timothy', 'jimothy']

// endpoints
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.get("/api/students", (req, res) => {
  rollbar.info("Someone got the list of students on page load");
  res.status(200).send(students);
});

app.get("/api/students", (req, res) => {
  rollbar.info("Your inside the POST method");
  res.status(200).send(students);
});

app.post('/api/students', function(req, res) {
  let { name } = req.body;
  
  const index = students.findIndex((student) => {
      return student === name
  })

  try {
      if (index === -1 && name !== "") {
        students.push(name);
        rollbar.info('Someone added a student')
        res.status(200).send(students);
      } else if (name === "") {
          rollbar.error('Someone tried to enter a blank student')

          res.status(400).send("must provide a name");
      } else {
          rollbar.error('Someone tried to enter a duplicate student name')
        res.status(400).send("that student already exists");
      }
    } catch (err) {
      console.log(err)
      rollbar.error(err)
    }
})

app.delete('/api/students/:index', (req, res) => {
  const targetIndex = +req.params.index

  students.splice(targetIndex, 1);

  rollbar.info('Someone deleted a student')
  res.status(200).send(students)
})

const port = 5050;

app.listen(port, function () {
  console.log(`Server rocking out on ${port}`);
});
