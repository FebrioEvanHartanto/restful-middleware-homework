const pool = require("../config/config.js")
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

class UserController {

  static findAll = async (req, res, next) => {
    try {

      const paginationStr = pagination(req.query)

      const sql = `
      SELECT *
      FROM 
        users
      ${paginationStr}
      `
    const result = await pool.query(sql)

    if(result.rows.length === 0){
      throw {name: "UserNotFound", message: "There are no users in the database!"}
    } else {
      res.status(200).json(result.rows);
    }

    } catch(err){
      next(err);
    }
  }

  static findDetail = async (req, res, next) => {
    try {
      const {id} = req.params;
        const sql = `
        SELECT *
        FROM
          users
        WHERE 
          users.id = $1
        `
    const result = await pool.query(sql, [id])

    if(result.rows.length === 0){
      throw {name: "UserNotFound!",  message: "Cannot find the user you are looking for!"}
    } else {
      res.status(200).json(result.rows[0]);
    }
    } catch(err){
      next(err);
    }
  }

  static createUser = async (req, res, next) => {
    try {
     const {id, email, gender, password, role} = req.body;
      
     const sql = `
      INSERT INTO users (id, email, gender, password, role)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING *
     `

     const result = await pool.query(sql, [id, email, gender, password, role]);

     res.status(201).json({message: "User created successfully! Here is the detail of the user you just created: ", data: result.rows[0]})

    }catch(err){
      next(err);
    }
  }

  static updateUser = async (req, res, next) => {
    try {
      let {email, gender, password, role} = req.body;
      const {id} = req.params;

      const searchSQL = `
        SELECT * 
        FROM
          users
        WHERE id = $1
      `
    const result = await pool.query(searchSQL, [id]);
    
    if(result.rows.length !== 0) {
      const updateSQL = `
        UPDATE
          users
        SET 
          email = $1,
          gender = $2,
          password = $3,
          role = $4
        WHERE id = $5
      `
      const currentUser = result.rows[0]

      email = email || currentUser.email;
      gender = gender || currentUser.gender;
      password = password || currentUser.password;
      role = role || currentUser.role;

      await pool.query(updateSQL, [email, gender, password, role, id])
      res.status(200).json({message: "User Updated Successfully!"})
    } else {
      throw {name: "UserNotFound", message: "We can't find the user you are looking for!"}
    }

    } catch (err) {
      next(err);
    }
  }
  
  static deleteUser = async (req, res, next) => {
    try {
      const {id} = req.params;
      const searchSQL = `
        SELECT * 
        FROM
          users
        WHERE 
          id = $1
      `
    const result = await pool.query(searchSQL, [id]);
    
    if(result.rows.length !== 0) {
      const deleteSQL = `
      DELETE FROM
        users
      WHERE 
        id = $1
      `
      await pool.query(deleteSQL, [id])
      res.status(200).json({message: "User deleted successfully!"})
      } else {
          throw {name: "UserNotFound", message: "We can't find the user you are looking for!"}
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

    limit = limit || DEFAULT_LIMIT
    page = page || DEFAULT_PAGE

    return `LIMIT ${limit} OFFSET ${(page -1 ) * limit}`

  }
}


module.exports = UserController;