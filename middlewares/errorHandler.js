const errorHandler = (err, req, res, next) => {

  console.log(err);

  if(err.name === "ErrorNotFound"){
    res.status(404).json({name : err.name, message: err.message})
  } else if (err.name === "NoMoviesFound"){
    res.status(404).json({name: err.name, message: err.message})
  } else if (err.name === "UserNotFound") {
    res.status(404).json({name: err.name, message: err.message})
  }else if(err.code === "23505"){
    res.status(400).json({message: err.detail})
  }else if (err.name === "InvalidCredentials") {
    res.status(400).json({message: "Wrong Email or Password!"})
  }else if (err.name === "Unauthenticated"){
    res.status(401).json({message: "Unauthenticated!"})
  }else {
    res.status(500).json({message: "Internal Server Error!"})
  }
}

module.exports = errorHandler;