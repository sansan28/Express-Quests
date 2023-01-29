require("dotenv").config();

const express = require("express");


const app = express();
const { hashPassword, verifyPassword, verifyToken } = require("./auth");
app.use(express.json());

const port = process.env.APP_PORT ?? 5500;
const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);
app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);


/*routes publiques*/ 
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);
app.post("/api/users", hashPassword, userHandlers.postUser);


/*routes to protect*/
app.use(verifyToken);

app.post("/api/movies", movieHandlers.postMovie);
app.put("/api/movies/:id", movieHandlers.updateMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);

app.put("/api/users/:id", hashPassword, userHandlers.updateUser);
app.delete("/api/users/:id", userHandlers.deleteUser);

// const isItSandra = (req, res) => {
//   if (
//     req.body.email === "sandra.s@example.com" &&
//     req.body.password === "tata"
//   ) {
//     res.send("Credentials are valid");
//   } else {
//     res.sendStatus(401);
//   }
// };


// app.get("/api/login", isItSandra);



app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
