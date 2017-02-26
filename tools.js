var client = require('./app_server/models/connection.js');

/*client.indices.delete({index: 'cab'},function(err,resp,status) {  
  console.log("delete",resp);
});*/

/*client.indices.create({  
  index: 'cab'
},function(err,resp,status) {
  if(err) {
    console.log(err);
  }
  else {
    console.log("create",resp);
  }
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

client.indices.getMapping({  
    index: 'cab',
    type: 'driver',
  },
function (error,response) {  
    if (error){
      console.log(error.message);
    }
    else {
      console.log("Mappings:\n",response.cab.mappings.driver.properties);
    }
});

/*client.indices.putMapping({  
  index: 'cab',
  type: 'driver',
  body: {
    properties: {
      'id': {
        'type': 'string'
      },
      'location': {
        'type': 'geo_point'
      }
    }
  }
},function(err,resp,status){
    if (err) {
      console.log(err);
    }
    else {
      console.log(resp);
    }
});*/
