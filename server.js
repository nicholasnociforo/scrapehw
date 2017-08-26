var cheerio = require("cheerio");
var request = require("request");
var express = require("express");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var Article = require("./Article.js");
var Note = require("./Note.js");
mongoose.Promise = Promise;
const router = express.Router();
var bodyParser = require("body-parser");
var path = require("path");

var app = express();


// app.use(logger("dev"));
// app.use(bodyParser.urlencoded({
//   extended: false
// }));


app.use(express.static("public"));
// 

mongoose.connect("mongodb://localhost/week18day3mongoose");
var db = mongoose.connection;



db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});



// First, tell the console what server.js is doing
console.log("\n***********************************\n" +
            "Grabbing every title name and link\n" +
            "from Google News:" +
            "\n***********************************\n");

// Making a request for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
request("https://news.google.com/news/?ned=us&hl=en", function(error, response, html) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
var databaseUrl = "news";
var collections = ["articles"];

var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});


  var $ = cheerio.load(html);

  // An empty array to save the data that we'll scrape
  var results = [];

  // With cheerio, find each p-tag with the "title" class
  // (i: iterator. element: the current element)
  

// Routes
// 1. At the root path, send a simple hello world message to the browser





$("c-wiz.M1Uqc.kWyHVd").each(function(i, element) {

    // Save the text of the element in a "title" variable
    var title = $(element).text();

    // In the currently selected element, look at its child elements (i.e., its a-tags),
    // then save the values for any "href" attributes that the child elements may have
    var link = $(element).children().attr("href");


    var article = {
      title: title,
      link: link
    }
    // console.log('article', article);
    // Save these results in an object that we'll push into the results array we defined earlier
    // results.push(article);

    // var entry = new Article(article);
      var entry = new Article(article);

    // Now, save that entry to the db
    entry.save(function(err, doc) {
      // Log any errors
      if (err) {
        console.log(err);
      }
      // Or log the doc
      else {
        console.log("success");
      }    
    });

  // Log the results once you've looped through each of the elements found with cheerio
  // console.log(results);
});

});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3000, function() {
  console.log("App running on port 3000!");
})