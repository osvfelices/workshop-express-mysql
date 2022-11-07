const database = require("./database");

const movieHandler = require("express").Router();

const getMovies = (req, res) => {
  database
    .query("select * from movies")
    .then(([movie]) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select * from movies where id = ?", [id])
    .then(([movies]) => {
      if (movies[0] != null) {
        res.json(movies[0]);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const postMovie = (req, res) => {
  const { title, genre, rate, year } = req.body;

  database
    .query("INSERT INTO movies(title, genre, rate, year) VALUES (?, ?, ?, ?)", [
      title,
      genre,
      rate,
      year,
    ])
    .then(([result]) => {
      res.location(`/api/movies/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the movies");
    });
};

const updateMovie = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, genre, rate, year } = req.body;

  database
    .query("update Movies set title = ?, genre = ?, rate = ? where id = ?", [
      title,
      genre,
      rate,
      year,
      id,
    ])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error editing the movies");
    });
};

movieHandler.get("/api/movies", getMovies);
movieHandler.get("/api/movies/:id", getMovieById);
movieHandler.post("/api/movies", postMovie);
movieHandler.put("/api/movies/:id", updateMovie);

module.exports = movieHandler;
