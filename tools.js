var client = require('./app_server/models/connection.js');

/*client.indices.delete({index: 'cab'},function(err,resp,status) {  
  console.log("delete",resp);
});*/

client.count({},function(err,resp,status) {  
  console.log("results",resp);
});

client.search({  
  index: 'cab',
  type: 'driver',
  body: {
    query: {
      match: { "Available": "Y" }
    }
}});