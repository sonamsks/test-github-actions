//provides stronger error checking and more secure code
"use strict";

// web server framework for Node.js applications
const express = require("express");
const axios = require('axios');

// allows requests from web pages hosted on other domains
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const fileName = "app.js";

const { HttpException } = require("./HttpException.utils");

const app = express();
const port = 8083;

// Parses incoming JSON requests
app.use(express.json());
app.use(cors());

/** add reqId to api call */



app.use(function (req, res, next) {
  res.locals.reqId = uuidv4();
  next();
});

app.post("/add-sub",async (req, res) => {
  const {a=0, b=0} = req.body;
  console.log(`A: ${a}, B: ${b}`);



//////////////////////////////////////
  // Your logic to call S1 and S2 services to get the addition and subtraction
  //////////////////////////////////////
    try {
    const addResponse = await axios.post('http://devops-services-s1-1:8081/add', { a, b });
    const subResponse = await axios.post('http://devops-services-s2-1:8082/sub', { a, b });

    const sum = addResponse.data.body.sum;
    const sub = subResponse.data.body.sum;  

    res.status(200).send({
      sum: sum,
      sub: sub
    });

  } catch (error) {
    console.error('Error fetching from S1 or S2:', error.message);
    res.status(500).send({ error: 'Failed to get data from S1 or S2 services' });
  }

});

/** 404 error */
app.all("*", (req, res, next) => {
  const err = new HttpException(404, "Endpoint Not Found");
  return res.status(err.status).send(err.message);
});

app.listen(port, () => {
  console.log("Start", fileName, `S3 App listening at http://localhost:${port}`);
});
