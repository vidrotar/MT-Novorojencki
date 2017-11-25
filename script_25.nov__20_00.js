  

// JQUERY
$(window).on("load", function (e) {
  var client = new $.es.Client({
      hosts: 'localhost:9200'
  });
  console.log("vrstica: 8: client: spremenljicka client je ustvarjena: " + client);
  client.ping({
    requestTimeout: 30000,
  }, function (error) {
    if (error) {
      console.error('vrstica: 13 elasticsearch cluster is down! | SLO: napaka cluster je down');
    } else {
      console.log('vrstica 15: All is well');
    }
  });
  

  // sPridobvi stevilo zapisov za nadaljno poizvedbo  
  var stzapisov;
  client.search({
    index: 'imena',
    type: 'vsa',
    body: {
      query: {
        match: {
          ime: "Aleks"
        }
      }
    }
  }).then(function (resp) {
      stzapisov     = resp['hits']['total'];
      console.log("stevilo zapisov: " + stzapisov);
  },
  function (err) {
      console.trace(err.message);
  }
  );
  // !Pridobi stevilo zapisov 
    

     //iskanje
  client.search({
      index: 'imena',
      type: 'vsa',
      body: {
        size: 100,
        query: {
          match: {
            ime: "Aleks"
          }
        }
      }
    }).then(function (resp) {
        // console.log(resp);
            // $milliseconds = resp['took'];
            // $stzapisov     = resp['hits']['total'];
              // console.log("took:" + $milliseconds);
               // console.log("----->: " +  stzapisov);
            $a1 = resp['hits']['hits'][0]['_id'];
            $a2 = resp['hits']['hits'][0]['_score'];
            $a3 = resp['hits']['hits'][3]['_source'];
            // console.log("_id:" + $a1);
            // console.log("_source:" + $a2);
            for (i=0; i<stzapisov; i++){
              $a3 = resp['hits']['hits'][i]['_source'];
              console.log("Zapis: ime:" + $a3['ime'] + " leto:" + $a3['year'] + " stevilka:" + $a3['number'] + " rang:" + $a3['rang'] + " spol:" + $a3['spol']);
              $("ul").append("<li>Zapis " + i + " : ime:" + $a3['ime'] + " leto:" + $a3['year'] + " stevilka:" + $a3['number'] + " rang:" + $a3['rang'] + " spol:" + $a3['spol'] + " " + "</li>");
            }
    },
    function (err) {
        console.trace(err.message);
    }
    );
  //  !iskanje
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
