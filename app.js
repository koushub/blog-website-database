//jshint esversion:6
// 0C4gX7nblTeqrKLf
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const dotenv = require('dotenv');
dotenv.config();

const homeStartingContent = "Welcome to my daily journal! I'm Koushubh Yadav, a web developer with a passion for crafting user-friendly websites. Currently seeking a challenging role, I'm on a quest to learn, grow, and leverage my skills. I hold a Bachelor's in Computer Science with a GPA of 8.4.Explore my projects, ranging from a dynamic CRUD To-do List web-app to a React-based chatroom application. I've also contributed to research with a published paper on NFT Marketplaces. Join me as I document my journey and share insights into web development.Connect with me on LinkedIn or GitHub, and let's navigate the exciting world of web development together.";

const aboutContent = "Welcome to my daily journal! I'm Koushubh Yadav, a web developer with a passion for crafting user-friendly websites. Currently seeking a challenging role, I'm on a quest to learn, grow, and leverage my skills. I hold a Bachelor's in Computer Science with a GPA of 8.4.Explore my projects, ranging from a dynamic CRUD To-do List web-app to a React-based chatroom application. I've also contributed to research with a published paper on NFT Marketplaces. Join me as I document my journey and share insights into web development.Connect with me on LinkedIn or GitHub, and let's navigate the exciting world of web development together.";

const contactContent = "Welcome to my daily journal! I'm Koushubh Yadav, a web developer with a passion for crafting user-friendly websites. Currently seeking a challenging role, I'm on a quest to learn, grow, and leverage my skills. I hold a Bachelor's in Computer Science with a GPA of 8.4.Explore my projects, ranging from a dynamic CRUD To-do List web-app to a React-based chatroom application. I've also contributed to research with a published paper on NFT Marketplaces. Join me as I document my journey and share insights into web development.Connect with me on LinkedIn or GitHub, and let's navigate the exciting world of web development together.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// MONGODB_URI = mongodb+srv://koushubhyadav:0C4gX7nblTeqrKLf@cluster0.e6gja7b.mongodb.net/cluster0?retryWrites=true&w=majority

const uri = process.env.MONGODB_URI || '';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Your code here
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find({})
    .then(posts => {
      // Modify the posts data here
      const modifiedPosts = posts.map(post => ({
        ...post._doc,
        lowerCaseTitle: _.lowerCase(post.title)
      }));

      res.render("home", {
        homeContent: homeStartingContent,
        posts: modifiedPosts
      });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send("An error occurred while fetching posts.");
    });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: _.lowerCase(req.body.postTitle), // Convert to lowercase here
    content: req.body.postBody
  });

  post.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(error => {
      console.error(error);
      res.status(500).send("An error occurred while saving the post.");
    });
});


app.get("/posts/:postName", function (req, res) {
  const requestedTitle = _.lowerCase(req.params.postName);

  Post.findOne({ title: requestedTitle }) // Look up by lowercase title
    .then(post => {
      if (post) {
        res.render("post", {
          title: post.title,
          content: post.content
        });
      } else {
        res.status(404).send("Post not found.");
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).send("An error occurred while fetching the post.");
    });
});


app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent // Should be 'aboutContent'
  });
});


app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

const PORT = process.env.PORT;

app.listen(PORT, function () {
  console.log("Server started on port " + PORT);
});
