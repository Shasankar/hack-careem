var elasticsearch=require('elasticsearch');

var client = new elasticsearch.Client( {  
  host: '35.163.88.214:9200',
  log: 'trace'
});

module.exports = client; 