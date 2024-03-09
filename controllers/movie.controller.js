const pool = require("../config/config.js")
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

class MovieController {
  
  static findAll = async (req, res, next) => {

    try {

      const paginationStr = pagination(req.query);

      const sql = `
      SELECT * 
      FROM 
        movies
      ${paginationStr}
      `
    const result = await pool.query(sql) 

    if(result.rows.length === 0 ){
      throw {name: "NoMoviesFound", message: "List Of Movies Not Found!"}
    } else {
      res.status(200).json(result.rows)
    }
    } catch(err) {
      next(err);
    }
  }

  static findDetail = async (req, res, next) => {
    try{
      const {id} = req.params;
      const sql = `
        SELECT *
        FROM
          movies
        WHERE id = $1
        `
      const result = await pool.query(sql, [id]);

      if(result.rows.length === 0){
        throw {name : "ErrorNotFound", message : "Movie Not Found!"}
      } else {
      res.status(200).json(result.rows[0])
      }
    } catch (err) {
      next(err);
    }
    
  }

  static createMovie = async (req, res, next ) => {
    try{
      const {id, title, genres, year} = req.body;
    
    const sql = `
      INSERT INTO movies(id, title, genres, year)
        VALUES
          ($1, $2, $3, $4)
      RETURNING *
    `
    const result = await pool.query(sql, [id, title, genres, year])

    res.status(201).json({message: "Movie created Successfully! Here is the detail of the movie you just created: ", data: result.rows[0]})
    
    }catch(err){
      next(err);
    }
  }

  static updateMovie = async (req, res, next) => {
    try{
      let {title, genres, year} = req.body;
      const {id} = req.params;

      const searchSQL = `
        SELECT 
          *
        FROM
          movies
        WHERE id = $1
      `
      const result = await pool.query(searchSQL, [id])

      if(result.rows.length !== 0){
        const updateSQL = `
          UPDATE movies
          SET title = $1,
              genres = $2,
              year = $3
          WHERE id = $4
        ` 
        const currentMovie = result.rows[0];
        
        title = title || currentMovie.title;
        genres = genres || currentMovie.genres;
        year = year || currentMovie.year;

        await pool.query(updateSQL, [title, genres, year, id])

        res.status(200).json({message: "Movie Updated Successfully!"})
      }else{
        throw {name : "ErrorNotFound", message : "Movie Not Found!"}
      }

    }catch(err){
      next(err);
    }
  }

  static deleteMovie = async (req, res, next) => {  
    try{
      const {id} = req.params; 
      const searchSQL = `
      SELECT *
      FROM
        movies
      WHERE
        id = $1
      `
      const result = await pool.query(searchSQL, [id])

      if(result.rows.length !== 0){
        const deleteSQL = `
          DELETE FROM 
            movies
          WHERE 
            id = $1
        `
      await pool.query(deleteSQL, [id])
      res.status(200).json({message: "Movie Deleted Successfully!"})
      } else {
        throw {name : "ErrorNotFound", message : "Movie Not Found!"}
      }

    }catch(err){
      next(err);
    }
  }

}

  const pagination = (params) => {
    if(Object.entries(params).length === 0){
      return "";
    } else {
      let {limit, page} = params

      limit = limit || DEFAULT_LIMIT;
      page = page || DEFAULT_PAGE
      
      return `LIMIT ${limit} OFFSET ${(page -1) * limit}`
    }
  }

module.exports = MovieController;