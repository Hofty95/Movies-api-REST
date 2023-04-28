const path = require("path");
const db = require("../../database/models");
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require("moment");

//Aqui tienen otra forma de llamar a cada uno de los modelos
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;

const moviesController = {
  list: async (req, res) => {
    try {
      const allMovies = await db.Movie.findAll({ include: ["genre"] });

      return res.status(200).json({
        ok: true,
        meta: {
          status: 200,
          total: allMovies.length,
          url: "api/movies",
        },
        data: allMovies,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: error.message,
      });
    }
  },
  detail: async (req, res) => {
    try {
      const { id } = req.params;

      const movieDetail = await db.Movie.findByPk(req.params.id, {
        include: ["genre"],
      });

      return res.status(200).json({
        ok: true,
        meta: {
          status: 200,
          total: 1,
          url: `/api/movies/${id}`,
        },
        data: movieDetail,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: error.message,
      });
    }
  },
  new: async (req, res) => {
    try {
      const newestMovies = await db.Movie.findAll({
        order: [["release_date", "DESC"]],
        limit: 5,
      });

      return res.status(200).json({
        ok: true,
        meta: {
          status: 200,
          total: newestMovies.length,
          url: "api/movies/new",
        },
        data: newestMovies,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: error.message,
      });
    }
  },
  recomended: async (req, res) => {
    try {
      const recomendedMovies = await db.Movie.findAll({
        include: ["genre"],
        where: {
          rating: { [db.Sequelize.Op.gte]: 8 },
        },
        order: [["rating", "DESC"]],
      });

      return res.status(200).json({
        ok: true,
        meta: {
          status: 200,
          total: recomendedMovies.length,
          url: "api/movies/recommeded",
        },
        data: recomendedMovies,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: error.message,
      });
    }
  },
  //Aqui dispongo las rutas para trabajar con el CRUD
  create: async function (req, res) {
    try {
      const { title, rating, awards, release_date, length, genre_id } =
        req.body;

      const newMovie = await db.Movie.create({
        title: title,
        rating: rating,
        awards: awards,
        release_date: release_date,
        length: length,
        genre_id: genre_id,
      });
      return res.status(200).json({
        ok: true,
        meta: {
          status: 200,
          total: 1,
          url: `/api/movies/${newMovie.id}`,
        },
        data: newMovie,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: error.message,
      });
    }
  },
  update: async function (req, res) {
    try {
      const movieId = req.params.id;
      const { title, rating, awards, release_date, length, genre_id } =
        req.body;

      const movie = await db.Movie.findByPk(movieId);

      movie.title = title;
      movie.rating = rating;
      movie.awards = awards;
      movie.release_date = release_date;
      movie.length = length;
      movie.genre_id = genre_id;

      await movie.save();

      res.status(200).json({
        ok: true,
        meta: {
          status: 200,
          total: 1,
          url: `/api/movies/${movieId}`,
        },
        data: movie,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: error.message,
      });
    }
  },
  destroy: async function (req, res) {
    try {
      let movieId = req.params.id;

      const movie = await db.Movie.findByPk(movieId);

      await movie.destroy()

      res.status(200).json({
        ok: true,
        meta: {
          status: 200,
          total: 1,
          eliminated: true,
        },
        data: movie,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: error.message,
      });
    }
  },
};

module.exports = moviesController;
