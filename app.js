import express from "express";
import bodyParser from "body-parser";
import session from "express-session";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "apples",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/entry-page", (req, res) => {
  res.render("entryPage.ejs");
});

app.get("/", (req, res) => {
  // Retrieve the user's name from the session
  const userName = req.session.userName;
  res.render("home.ejs", { userName });
});

app.post("/save-name", (req, res) => {
  const userName = req.body.name;
  // Save the user's name in the session
  req.session.userName = userName;
  // Redirect to another page (e.g., homepage)
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
