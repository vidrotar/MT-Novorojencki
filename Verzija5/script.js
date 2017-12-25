var letnice = new Array();
var stevila = new Array();
var podatki = [];
var width = 500;var height = 500;
var margin = 25;
var axisLength = width - 2 * margin;
var canvas, widthScale ,heightScale, xAxis, yAxis, line;
var VsaIskanaImena = [] // create an empty array
console.log(VsaIskanaImena);
var letoStevilo = [];
var stzapisov;
var imena =[];
var podobnaImena = [];



$(window).on("load", function (e) {
});

function dodajNovoIme(bla) {
  console.log("novo ime: " + document.getElementById("inputBoxIme").value);
  iskanoIme = document.getElementById("inputBoxIme").value
  napolniPodatkeZaEnega(iskanoIme);
}
function napolniPodatkeZaEnega(iskanoIme){
      client = Povezava();
      if(preveriSeznam(iskanoIme)){
        console.error("[napolniPodatke]: ime ste ze iskali " + iskanoIme);
        return false
      }
      console.error("nic se ni zgodilo :) ?");
      stzapisov = vrniSteviloZapisov(client,iskanoIme)
      client.search(
        {
            index: 'baby',
            type: 'doc',
            body: {
              size: 100,
              query: {
                match: {
                  ime: iskanoIme
                }
              }
              ,sort : [
              {"year" : {"order" : "asc"}}
              ]
            }
        }
      ). // konc search
      then(function (resp) {
        $a3 = resp['hits']['hits'][3]['_source'];
                letoStevilo = [];
                for (i=0; i<stzapisov; i++){
                  $a3 = resp['hits']['hits'][i]['_source'];
                  letnice[i] = $a3['year'];
                  stevila[i] = $a3['number'];
                  letoStevilo.push({leto: $a3['year'], vrednost: $a3['number']}); 
                }
        podatki.push(letoStevilo);
        imena.push(iskanoIme);
        // VsaIskanaImena.push({
        //     ime:   iskanoIme,
        //     value: podatki
        // });
        // console.error(VsaIskanaImena["Aleks"])
        // console.log("podatki PO: ", podatki);
        ustvariPlatno();
        console.error(VsaIskanaImena);
      }, // end then
        function (err) {
          console.trace(err.message);
        }
        ); // konc 
}

function vrniSteviloZapisov(client,iskanoIme){
  client.search ( {
    index: 'baby',
    type: 'doc',
    body: {
      query: {
        match: {
          ime: iskanoIme
        }
      }
    }
  }).
  then(function (resp) {
      stzapisov = resp['hits']['total'];
      console.log("stevilo zapisov: " + stzapisov);
  },
  function (err) {
      console.trace(err.message);
  }
  );
  return stzapisov;
}

function ustvariPlatno(){
  if (!canvas){
    canvas = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("border", "1px solid");
    widthScale = d3.scaleLinear()
    .domain([1990, 2017])
    .range([0, axisLength]);
    heightScale = d3.scaleLinear()
    .domain([200, 0])
    .range([0, axisLength]);
    xAxis = d3.axisBottom(widthScale);
    yAxis = d3.axisLeft(heightScale);
    canvas.append("g")
      .attr("transform", function() { return "translate(" + margin + "," + (height - margin) + ")"; } )
      .call(xAxis);
    canvas.append("g")
      .attr("transform", function() { return "translate(" + margin + "," + margin + ")"; } )
      .call(yAxis);
    line = d3.line()
      .x(function(d) { return widthScale(d.leto); })
      .y(function(d) { return heightScale(d.vrednost); }) 
      .curve(d3.curveCardinal);
  }
  else{
    d3.selectAll("path").remove();
  }
  console.log("platno ustvarjeno");
  IzrisiSeznamImen();
}

function IzrisiSeznamImen(){
  for (var i = 0; i < podatki.length; i++) {
    if(podatki[i] != null){
      console.error(".i" + i);
      console.log("IZRIS IMEN podatki: ", podatki);
      canvas.append("path")
      .attr("d", line(podatki[i].sort()))
      .attr("fill", "none")
      .attr("stroke", getRandomColor())      
      .attr("transform", function() { return "translate(" + margin + "," + margin + ")"; } ); 
    }
      
  }
}

// ------------------------------------------------------------------------------------------------------------------
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
function Povezava(){
  var client = new $.es.Client({
      hosts: 'localhost:9200'
  });
  console.log("vrstica: 8: client: spremenljicka client je ustvarjnapolniPodatke: " + client);
  client.ping({
    requestTimeout: 30000,
  }, function (error) {
      if (error) {
        console.log("aleks->" + error);
  console.error('vrstica: 13 elasticsearch cluster is down! | SLO: napaka cluster je down');
      } else {
        console.log('vrstica 15: All is well');
      }
  });
  return client;
}
function naZaslonImena(){
  console.error("[naZaslonImena()]");
  console.error(imena);
  document.getElementById("iskanaImena").innerHTML = ''; // pobrise seznam skanih imen
  for (var i = 0; i < imena.length; i++) { // gre ces vsa imena v seznamu
    console.error("--> " + imena[i] + " - " + podatki[i])
    izpisiImeNaHTML(imena[i]); // jih izpise na seznam

  }
}
function izpisiImeNaHTML(text) { // funkcija doda text na seznam
    var node = document.createElement("p")
    // node.classList.add("otherclass");
    var textnode = document.createTextNode(text);
    node.appendChild(textnode);
    document.getElementById("iskanaImena").appendChild(node);
}
$(document).ready(function() {
  $("#iskanaImena").on("click", "p",function(){
      // $( this ).slideUp();
      $( this ).slideUp();
      console.error("Klik na ime: " + this.innerHTML);
      izbrisiIzSeznama(this.innerHTML);
    })
});
function izbrisiIzSeznama(ime){
  console.log("Ali je iskano ime v sezanmu: " +  preveriSeznam(ime));
  console.log("Brisem ime z seznama vseh imen");
  if(preveriSeznam(ime) != null){
    var index = preveriSeznam(ime)
    imena[index] = null;
    podatki[index] = null;
    console.error("ime: " + ime + " je bilo izbrisano");  
  }
  else{
    console.error("ime:" + ime + " ne obstaja v seznamu");
  }

  ustvariPlatno();
}
function preveriSeznam(iskanoIme){
  for(i = 0; i < imena.length; i++){
    if(imena[i] == iskanoIme){
      return i;
    }
  }
  return false;
}
// ------------------------------------------------------------------------------------------------------------------
// SORODNA IMENA
function blabla(){
  iskanoIme = document.getElementById("inputBoxIme").value;
  podobnaImena = []
      iskanoIme = "*"+iskanoIme+"*"
      client = Povezava();
      stzapisov = vrniSteviloZapisov(client,iskanoIme)
      console.error(iskanoIme);
      client.search(
        {
            index: 'baby',
            type: 'doc',
            body: {
              size: 100,
               _source: "ime",
               query: {
                query_string: {
                default_field: "ime",
                query: iskanoIme
            }
              }
        }
      }
      ). // konc search
      then(function (resp) {
        $a3 = resp['hits']['hits'][3]['_source'];
                for (i=0; i<stzapisov; i++){
                  $a3 = resp['hits']['hits'][i]['_source'];
                  console.log($a3['ime']);
                  podobnaImena.push($a3['ime']);
                }
      var zacasno = podobnaImena;
      podobnaImena = []
      for(var i = 0; i < zacasno.length; i++){
        if(!preveri(zacasno[i])){
          podobnaImena.push(zacasno[i])
        }
      }
      izpisiPodobnaNaZaslov()
      }, // end then
        function (err) {
          console.trace(err.message);
        }
        ); // konc 
}
function preveri(iskanoIme){
  for(i = 1; i < podobnaImena.length; i++){
    if(podobnaImena[i] == iskanoIme){
      return i;
    }
  }
  return false;
}
function izpisiPodobnaNaZaslov(){
  document.getElementById("iskanaImena").innerHTML = ''; // pobrise seznam skanih imen
  izpisiImeNaHTML("Podobna imena:"); // jih izpise na seznam
  for (var i = 0; i < podobnaImena.length; i++) { // gre ces vsa imena v seznamu
    izpisiImeNaHTML(podobnaImena[i]); // jih izpise na seznam

  }
}