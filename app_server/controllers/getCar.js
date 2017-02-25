var client = require('../models/connection.js'); 
module.exports.index=function(req, res, next) {
  console.log(req.query.lat);
  console.log(req.query.long);
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
  res.render('car', { title: 'Your Car', carId: 1234, time: '5 mins'});
};