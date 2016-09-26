//set up
var express = require('express')
var app = express();
var bodyParser = require('body-parser')
var database = null;

//If a client asks for a file,
//look in the public folder. If it's there, give it to them.
app.use(express.static(__dirname + '/public'));

//this lets us read POST data
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//make an empty list of ideas
var posts = [];
var idea = {};
idea.text = "Two cats who solve crimes in Dunedin";
posts.push(idea);

//let a client GET the list of ideas
var sendIdeasList = function (request, response) {
  response.send(posts);
}
app.get('/ideas', sendIdeasList);

//let a client POST new ideas
var saveNewIdea = function (request, response) {
  console.log(request.body.idea); //write it on the command prompt so we can see
  var idea = {};
  idea.text = request.body.idea;
  if (request.body.image===""){
    idea.image = "http://kurld.com/images/wallpapers/michael-jackson-images/michael-jackson-images-5.jpg";
  }
  else {
    idea.image = request.body.image;
  }
  idea.music = request.body.music;
  posts.push(idea);
  response.send("thanks for your idea. Press back to add another")
  var dbPosts = database.collection('posts');
dbPosts.insert(idea);
}
app.post('/ideas', saveNewIdea);

//listen for connections on port 3000
app.listen(3000);
console.log("I am listening... open a web browser and go to localhost:3000 to connect.");
var mongodb = require('mongodb');
var uri = 'mongodb://girlcode:17EppingStreet@ds041516.mlab.com:41516/keep-posts-forever';
mongodb.MongoClient.connect(uri, function(err, newdb) {
  if(err) throw err;
  console.log("yay we connected to the database");
  database = newdb;
  var dbPosts = database.collection('posts');
  dbPosts.find(function (err, cursor) {
    cursor.each(function (err, item) {
      if (item != null) {
        posts.push(item);
      }
    });
  });
});
