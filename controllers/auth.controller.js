const pool = require("../config/config.js")
const {hashPassword, comparePassword} = require("../lib/bcrypt.js")
const {generateToken} = require("../lib/jwt.js")

class AuthController {

  static register = async (req, res, next) => {
      try {
        const {id,email,gender,password,role} = req.body;
        const encryptedPassword = hashPassword(password);

        const insertSQL = `
          INSERT INTO users(id,email,gender,password,role)
            VALUES
              ($1, $2, $3, $4, $5)
          RETURNING *
        `

        console.log(encryptedPassword)

        const result = await pool.query(insertSQL, [id, email, gender, encryptedPassword, role]) 

        res.status(201).json(result.rows[0])

      } catch (err){
          next(err);
      }
  }

  static login = async (req, res, next) => {
    try{

      const {email, password} = req.body;

      const searchSQL = `
      SELECT *
      FROM
        users
      WHERE email = $1
      `
      const result = await pool.query(searchSQL, [email])

      if(result.rows.length !== 0){

        const foundUser = result.rows[0];

        if(comparePassword(password, foundUser.password)){
          
          //Login successfull, generate token

          const accessToken = generateToken({
            id: foundUser.id,
            email: foundUser.email,
          })

          res.status(200).json({
            message: "Login Successful!",
            accessToken
          })

        } else {
          throw {name:"InvalidCredentials"}
        }

      }else{
        throw {name:"InvalidCredentials"}
      }

    }catch(err){
      next(err);
    }
  }
}

module.exports = AuthController;