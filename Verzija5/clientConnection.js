 
 var client = new $.es.Client({
      hosts: 'localhost:9200'
  });
 
  console.log("vrstica: 8: client: spremenljicka client je ustvarjena: " + client);
  client.ping({
    requestTimeout: 30000,
  },
  function (error) {
    if (error) {
      console.error('vrstica: 13 elasticsearch cluster is down! | SLO: napaka cluster je down');
    } else {
      console.log('vrstica 15: All is well');
    }
  });
  