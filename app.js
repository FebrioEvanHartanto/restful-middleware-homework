const express = require ("express");
const app = express();
const port = 3000;
const router = require("./routes");
const errorHandler = require("./middlewares/errorHandler.js")
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const morgan = require("morgan")

app.use(morgan("tiny"))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

app.use(router);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App is listening to port ${port}`)
})