

// JQUERY
$(window).on("load", function (e) {
  var client = new $.es.Client({
      hosts: 'localhost:9200'
  });
  console.log("client" + client);
  client.ping({
    requestTimeout: 30000,
  }, function (error) {
    if (error) {
      console.error('elasticsearch cluster is down!');
    } else {
      console.log('All is well');
    }
  });
  client.search({
    index: 'baby',
    type: 'doc',
    body: {
      query: {
        match: {
          rang: '1'
        }
      }
    }
  }).then(function (resp) {
    // izpis 
      console.log(resp);
  }, function (err) {
      console.trace(err.message);
  });
});



// JS- se ne dela
// console.log("client");
// window.document.onload = function(e) { 
// var elasticsearch = require('elasticsearch');
// var client = new elasticsearch.Client({
//   host: 'localhost:9200',
//   log: 'trace'
// });
// }
