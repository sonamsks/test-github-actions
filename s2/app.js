//provides stronger error checking and more secure code
"use strict";

// web server framework for Node.js applications
const express = require("express");
// allows requests from web pages hosted on other domains
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const fileName = "app.js";

const { HttpException } = require("./HttpException.utils");

const app = express();
const port = 8082;

// Parses incoming JSON requests
app.use(express.json());
app.use(cors());

/** add reqId to api call */
app.use(function (req, res, next) {
  res.locals.reqId = uuidv4();
  next();
});

app.post("/sub", (req, res) => {
  const {a=0, b=0} = req.body;
  console.log(`A: ${a}, B: ${b}`);
  res.status(200).send({
    body: {
      sum: parseFloat(a) - parseFloat(b)
    }
  });
});

/** 404 error */
app.all("*", (req, res, next) => {
  const err = new HttpException(404, "Endpoint Not Found");
  return res.status(err.status).send(err.message);
});

app.listen(port, () => {
  console.log("Start", fileName, `S2 App listening at http://localhost:${port}`);
});
