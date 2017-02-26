
var client = require('../models/connection.js'); 
module.exports.index=function(req, res, next) {
  var lat = parseInt(req.query.lat); 
  var long = parseInt(req.query.long);
  console.log(req.query.lat);
  console.log(req.query.long);
  console.log(lat);
  console.log(long);

// Determine nearest driver by getting geo spatially least distant driver to the customer
  client.search({  
  index: 'cab',
  type: 'driver',
  body: {
    query: {
      "filtered": {
      "filter": {
        "geo_distance": {
          "distance": "1km", 
          "location": { 
            "lat":  40.715,
            "lon": -73.988
          }
        }
      }
    },
      match: { "Available": "Y" }
    }
}});

// If more than one drivers at distance, sort based on driver rating and serve customer with best driver

// mark the selected driver's ride as Available = 'N'

// get the navigation and time to reach destination from google maps between selected driver and the customer
  
// notify driver

  res.render('car', { title: 'Your Car', carId: 1234, time: '5 mins'});

};