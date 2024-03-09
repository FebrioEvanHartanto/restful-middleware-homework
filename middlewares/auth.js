const {verifyToken} = require("../lib/jwt.js")
const pool = require("../config/config.js")

const authentication = async (req, res, next) => {
  try{

    if(req.headers.authorization) {
      
      const accessToken = req.headers.authorization.split(" ")[1]
      
      const {id, email} = verifyToken(accessToken);
      
      const  searchSQL = `
        SELECT *
        FROM
          users
        WHERE
          id = $1
      `

      const result = await pool.query(searchSQL, [id])

      if(result.rows.length > 0) {
        const foundUser = result.rows[0]

        req.loggedUser = {
          id: foundUser.id,
          email: foundUser.email
        }
        next();
      } else {
        throw {name: "Unauthorized"}
      }

    } else {
      throw {name: "Unauthenticated"}
    }

  }catch (err){
    next(err);
  }
}

module.exports = {
  authentication
}