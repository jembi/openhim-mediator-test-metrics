// load modules
var express = require('express')
var app = express()

// get config objects
var config = require("./config/config");
var apiConfig = config.api;
var mediatorConfig = require("./config/mediator");

// include register script
var register = require("./register");
register.registerMediator( apiConfig, mediatorConfig)


/* ######################### */
/* ##### Server Setup  ##### */
/* ######################### */

/* ##### Default Endpoint  ##### */
app.get('/hello', function (req, res) {

  /* ######################################### */
  /* ##### Create Initial Orchestration  ##### */
  /* ######################################### */

  var response = 'Primary Route Reached';

  // context object to store json objects
  var ctxObject = {};
  ctxObject['primary'] = response;

  //Capture 'primary' orchestration data
  orchestrationsResults = [];
  orchestrationsResults.push({
    name: 'Primary Route',
    request: {
      path : req.path,
      headers: req.headers,
      querystring: req.originalUrl.replace( req.path, "" ),
      body: req.body,
      method: req.method,
      timestamp: new Date().getTime()
    },
    response: {
      status: 200,
      body: response,
      timestamp: new Date(new Date().getTime() + 10000).getTime()
    },
    metrics: [
      {
        type: 'counter',
        name: 'orchestration-counter-name',
        value: 10
      },
      {
        type: 'timer',
        name: 'orchestration-timer-name',
        value: 10 // In Seconds
      },
      {
        type: 'gauge',
        name: 'orchestration-gauge-name',
        value: 10 // In Seconds
      }
    ]
  });

  /* ###################################### */
  /* ##### Construct Response Object  ##### */
  /* ###################################### */

  var urn = mediatorConfig.urn;
  var status = 'Successful';
  var response = {
    status: 200,
    headers: {
      'content-type': 'application/json'
    },
    body: response,
    timestamp: new Date().getTime()
  };

  var metrics = [
    {
      type: 'counter',
      name: 'mediator-counter-name',
      value: 72
    },
    {
      type: 'timer',
      name: 'mediator-timer-name',
      value: 100 // In Seconds
    },
    {
      type: 'gauge',
      name: 'mediatior-gauge-name',
      value: 10 // In Seconds
    }
  ]

  // construct property data to be returned
  var properties = {};
  properties['property'] = 'Primary Route';

  // construct returnObject to be returned
  var returnObject = {
    "x-mediator-urn": urn,
    "status": status,
    "response": response,
    "metrics" : metrics,
    "orchestrations": orchestrationsResults,
    "properties": properties
  }

  // set content type header so that OpenHIM knows how to handle the response
  res.set('Content-Type', 'application/json+openhim');
  res.send(returnObject);

})

// export app for use in grunt-express module
module.exports = app;

/* ######################### */
/* ##### Server Setup  ##### */
/* ######################### */
