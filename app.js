
var express = require('express');
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/testing';
var db;


var app = express();
app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))


//Hard Coded Users

// ROUTES PAGES
app.get('/', function (req, res) {
  res.render('index');
});

app.post('/', function (req, res) {
  var user = req.body
  console.log(user);
  var collection = db.collection('users')
  collection.insertOne(user, function(err, result){
    console.log("user has been inserted");
    res.render('index');
  });
});

app.get('/list', function(res, res) {
  var collection = db.collection('users');
  collection.find({}).toArray(function(err, result) {
    console.log(result);
    res.render('list', {users: result});
  })
});


app.get('/user/:name', function(req, res) {
  var user = req.params.name;
  var collection = db.collection('users');
  collection.find({'name':user}).toArray(function(err, result) {
    if (result.length > 0) {
      var found = result[0];
      res.render('user', {name: found.name, info: found });
    } else {
      res.send('User does not exist..')
    }
  })
});

app.get('/user/:name/edit', function(req, res){
  var user = req.params.name;
  var collection = db.collection('users');
  collection.find({'name': user}).toArray(function(err, result){
    if(result.length > 0) {
      var found = result[0];
      res.render('edit', {name: found.name, info: found})
    } else {
      res.send('user does not exist')
    }
  })
});

app.post('/user/edit', function(req, res) {
  var collection = db.collection('users');
  collection.updateOne(
    {'name': req.body.name},
    {
      $set: {
        age: req.body.age,
        occup: req.body.occupation,
        hobby: req.body.hobby
      }}, function(err, result) {
        res.redirect('/user/' + req.body.name);
    })
})

app.post('/user/delete', function(req, res) {
    var collection = db.collection('users');
    collection.deleteOne({'name': req.body.name}, function(err, result){
      res.redirect('/list');
    })
})


app.get('/user/:name/:topic/:show', function (req, res) {
  var check = Users[req.params.name];
  if (check) {
    var list;
    var books = ['book1', 'book2', 'book3', 'book4', 'bookA', 'bookB', 'bookC'];
    var movies = ['movie1', 'movie2', 'movie3', 'movie4', 'movie5', 'movie6'];
    if (req.params.topic === 'books') {
      list = books.slice(0);
    }
    if (req.params.topic === 'movies') {
      list = movies.slice(0);
    }
    res.render('user', {
      name: req.params.name,
      info: check,
      list: list.slice(0, parseInt(req.params.show))
    });
  } else {
    res.send('User does not exist...');
  }
});




MongoClient.connect(url, function(err, database) {
  console.log('connected to mongo!');
  db = database;
  app.listen(5000, function () {
    console.log('server started on port 5000');
  });
});

// SERVER PORT
