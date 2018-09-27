var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// scraping
// var axios = require("axios"); // Think we're using request instead of axios here.
var cheerio = require("cheerio");
var request = require("request");

// models
// console.log(__dirname, "../models/Thread.js");
var db = require("./models");

// port
var PORT = process.env.PORT || 3000;

// initializing express
var app = express();

// logger middleware (morgan)
app.use(logger("dev"));
// body-parser
app.use(bodyParser.urlencoded({extended: true}));
// use public as static directory
app.use(express.static("public"));

// connect to Mongo DB
mongoose.connect("mongodb://localhost/pathdb", { useNewUrlParser: true });

// handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes

app.get("/", function(req, res) {
  db.Thread.find({})
    .populate("notes")
    .then(function(dbThread) {
    res.render("index", {
      thread: dbThread
    });
  }).catch(function(err) {
    res.json(err);
  });
});

app.get("/clear", function(req, res) {
  db.Thread.remove({}, function(err) {
    console.log("collection cleared");
  });
  res.redirect("/");
});

app.get("/scrape", function(req, res) {

  request("http://www.pathofexile.com/forum/view-forum/40", function(error, response, html) {
    var $ = cheerio.load(html);

    $("td.thread").each(function(i, element) {
      var result = {};

      result.author = $(this)
        .find("div.postBy")
        .children(".profile-link")
        .find("a")
        .text().trim();
      result.profile = $(this)
        .find("div.postBy")
        .children(".profile-link")
        .find("a")
        .attr("href");
      result.title = $(this)
        .find("div.thread_title")
        .children(".title")
        .find("a")
        .text().trim();
      result.views = $(this)
        .nextAll("td.views")
        .find(".post-stat")
        .find("span")
        .text().trim();
      result.replies = $(this)
        .nextAll("td.views")
        .find("div")
        .find("span")
        .text().trim();
      result.link = $(this)
        .find("div.thread_title")
        .children(".title")
        .find("a")
        .attr("href");

      db.Thread.create(result).then(function(dbThread) {
        console.log(dbThread);
      }).catch(function(err) {
        return res.json(err);
      });
    });

    res.redirect("/");
  });
});

// saving notes to db
app.post("/submit/:id", function(req, res) {
  db.Note.create(req.body).then(function(dbNote) {
    return db.Thread.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true })
  }).then(function(dbThread) {
    res.redirect("/");
    // console.log("Note added.");
  }).catch(function(err) {
    res.json(err);
  });
});

// delete a note
app.get("/delete/:id", function(req, res) {
  db.Note.findOneAndDelete({ _id: req.params.id })
    .then(function() {
      res.redirect("/");
    }).catch(function(err) {
      res.json(err);
    });
});

// get all threads from db 
app.get("/threads", function(req, res) {
  db.Thread.find({}).then(function(dbThread) {
    res.json(dbThread);
  }).catch(function(err) {
    res.json(err);
  });
});

/// Routes for testing

app.get("/shownotes", function(req, res) {
  db.Thread.find({})
    .populate("notes")
    .then(function(dbThread) {
      res.json(dbThread)
    }).catch(function(err) {
      res.json(err);
    });
});

app.get("/notes", function(req, res) {
  db.Note.find({}).then(function(dbNote) {
    res.json(dbNote);
  }).catch(function(err) {
    res.json(err);
  });
});

// Server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + ".");
});
