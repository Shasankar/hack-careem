var client = require('../models/connection.js'); 
module.exports.index=function(req, res, next) {
  console.log(req.query.id);
  console.log(req.query.lat);
  console.log(req.query.long);
  console.log(req.query.avl);
  var lati = parseInt(req.query.lat); 
  var longi = parseInt(req.query.long);

  //debug 1
  client.cluster.health({},function(err,resp,status) {  
    console.log("-- Client Health --",resp);
  });

  //debug 2
  client.ping({
    // ping usually has a 3000ms timeout
    requestTimeout: 1000
  }, function (error) {
    if (error) {
      console.trace('elasticsearch cluster is down!');
  }else {
      console.log('All is well');
  }
  });
  
  //seed elasticsearch with hardcoded values
  var myBody = [{ index: { _index: 'cab', _type: 'driver', _id: req.query.id } },
    {
      location: {
        lat: lati,
        lon: longi
      },
      Available: req.query.avl
    }];
  client.bulk({
    index: 'cab',
    type: 'driver',
    body: myBody
  });
};