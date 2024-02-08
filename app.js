import express from "express";
import bodyParser from "body-parser";
import session from "express-session";

const app = express();
const port = 3000;

// Sample posts array with initial data
const posts = [];
console.log(posts);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "apples",
    resave: false,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");

// Landing page where users can enter their name
app.get("/entry-page", (req, res) => {
  res.render("entryPage.ejs");
});

// Page explaining how the app works
app.get("/how-it-works", (req, res) => {
  res.render("howitworks.ejs");
});

// Homepage with the list of posts
app.get("/", (req, res) => {
  const userName = req.session.userName;
  res.render("home.ejs", { userName, posts });
});

// Save the user's name and redirect to the homepage
app.post("/save-name", (req, res) => {
  const userName = req.body.name;
  req.session.userName = userName;
  res.redirect("/");
});

// Page for creating a new post
app.get("/create-post", (req, res) => {
  res.render("create-post.ejs");
});

// Handle the form submission to create a new post
app.post("/create-post", (req, res) => {
  const newPost = {
    id: posts.length + 1,
    content: req.body.postContent, // Ensure you are using the correct property name
  };
  posts.push(newPost);
  res.redirect("/");
});

// Handle post deletion
app.post("/delete-post/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const index = posts.findIndex((p) => p.id === postId);

  if (index !== -1) {
    posts.splice(index, 1);
  }

  res.redirect("/");
});

// Show confirmation page before deleting a post
app.get("/confirm-delete/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    res.status(404).send("Post not found");
    return;
  }

  res.render("confirm-delete.ejs", { post });
});

// Page for updating a post
app.get("/posts/:id/update", (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    res.status(404).send("Post not found");
    return;
  }

  res.render("update-post.ejs", { post });
});

// Handle the form submission to update a post
app.post("/update-post/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    res.status(404).send("Post not found");
    return;
  }

  post.content = req.body.postContent;
  res.redirect("/");
});

// Page for viewing a specific post
app.get("/posts/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    res.status(404).send("Post not found");
    return;
  }
  res.render("post.ejs", { post });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
