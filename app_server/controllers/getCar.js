
var client = require('../models/connection.js'); 
module.exports.index=function(req, res, next) {
  console.log(req.query.lat);
  console.log(req.query.long);

// Determine nearest driver by getting geo spatially least distant driver to the customer
  client.search({  
  index: 'cab',
  type: 'driver',
  body: {
    query: {
      match: { "Available": "Y" }
    }
}});

// If more than one drivers at distance, join with rating and serve customer with best driver

// mark the selected driver's ride as Available = 'N'

// get the navigation and time to reach destination from google maps between selected driver and the customer
  
// notify driver

  res.render('car', { title: 'Your Car', carId: 1234, time: '5 mins'});

};