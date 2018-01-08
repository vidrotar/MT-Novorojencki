var letnice = new Array();
var stevila = new Array();
var podatki = [];
var width = window.innerWidth;
var width = width/2; //izbris za bo cez use
var raz = width * 0.2;
width = width -raz;

var height = width;
var margin = 25;
var axisLength = width - 2 * margin;
var canvas, widthScale ,heightScale, xAxis, yAxis, line;
var letoStevilo = []; //zacasen arrey
var stzapisov;
var imena =[];
var podobnaImena = [];
var idKrivulje = 0;
var seznamP = [];

// knjiznica za predlaganje imen
var awesomplete;

// preverjanje ce je ime ze v seznamu podobnih imen
var notri = false;


// TODO: ON MOUSE OVER NA GRAF IZPIS INFORMAIJ VPRASAJ MATEVZA

// $(window).on("load", function (e) {
//   dodajNovoIme("Aleks");
//   dodajNovoIme("Maja");
//   dodajNovoIme("Nika");
//   dodajNovoIme("Mina");
//   dodajNovoIme("Dina");
//   dodajNovoIme("Nina");
// }).then(function(){
//   naZaslonIskanaImena();

// });

// isntanciramo class iz knjiznice za predlaganje imen
$(window).on("load", function (e) {
  //DODAMO AWESOMPLETE DA IZPOLNE BESEDO
  var input = document.getElementById("inputBoxIme");
  awesomplete = new Awesomplete(input);
  console.log("awesomplete: ", awesomplete);
});



function dodajNovoIme(iskanoIme =  document.getElementById("inputBoxIme").value) {
  console.log("[dodajNovoIme()]");
  console.log("novo ime: " + document.getElementById("inputBoxIme").value);
  if(preveriAliImeZeObstaja(imena,iskanoIme)){
    console.error("Iskali ste ime ki ste ga ze iskali(" + iskanoIme + ")");
    window.alert("Iskali ste ime ki ste ga ze iskali(" + iskanoIme + ") ime nebo dodano");
    return null;
  }
  if(iskanoIme == ""){
    window.alert("Vnesite ime");
  }
  napolniPodatkeZaEnega(iskanoIme);
}
function napolniPodatkeZaEnega(iskanoIme){
  console.log("[napolniPodatkeZaEnega()]");
      client = Povezava();
      if(preveriSeznam(iskanoIme)){
        console.log("[napolniPodatke]: ime ste ze iskali " + iskanoIme);
        return false
      }
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
        ustvariPlatno();
      }, // end then
        function (err) {
          console.trace(err.message);
        }
        ); // konc 
}

function vrniSteviloZapisov(client,iskanoIme){
  console.log("[vrniSteviloZapisov()]")
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
      console.log("->stevilo zapisov: " + stzapisov);
  },
  function (err) {
      console.trace(err.message);
  }
  );
  return stzapisov;
}

function ustvariPlatno(){
  console.log("[ustvariPlatno()]")
  if (true){
    var svg = d3.select("svg");
    if(svg){
      svg.remove();
    }
    canvas = d3.select("#canvas")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      // .style("border", "1px solid");

    // X OS
    widthScale = d3.scaleLinear()
      .domain([1990, 2017])
      .range([0, axisLength]);

    xAxis = d3.axisBottom(widthScale);

    canvas.append("g")
      .attr("transform", function() { return "translate(" + margin + "," + (height - margin) + ")"; } )
      .call(xAxis);
    

    // Y OS
    var maxSteviloOtrok = maxStevilo();
    console.error("max: " + maxSteviloOtrok);
    heightScale = d3.scaleLinear()
      .domain([maxSteviloOtrok*1.1, 0])
      .range([0, axisLength]);

    yAxis = d3.axisLeft(heightScale);

    canvas.append("g")
      .attr("transform", function() { return "translate(" + margin + "," + margin + ")"; } )
      .call(yAxis);

  // ----
    line = d3.line()
      .x(function(d) { return widthScale(d.leto); })
      .y(function(d) { return heightScale(d.vrednost); }) 
      .curve(d3.curveCardinal);

  }
  else{
    // d3.selectAll("path").remove();
  }
  console.log("->platno ustvarjeno");
  IzrisiSeznamImen();
}
function maxStevilo(){
  maxSteviloOtrok = 0;
  console.error("podatki.length:" + podatki.length);
  for(var j =0; j < podatki.length; j++){
    for(var i =0; i < podatki[j].length; i++){
      if(podatki[j][i]["vrednost"] > maxSteviloOtrok){
        maxSteviloOtrok = podatki[j][i]["vrednost"];
      }
    }
  }
  return maxSteviloOtrok;

}

function IzrisiSeznamImen(){
  console.log("[IzrisiSeznamImen()]");

  for (var i = 0; i < podatki.length; i++) {
    if(podatki[i] != null){
      console.log("->Podatki za izris: ", podatki);
      canvas.append("path")
      .attr("d", line(podatki[i].sort()))
      .attr('stroke-width', '10')
      .attr("fill", "none")
      .attr("stroke", getRandomColor())      
      .attr("id", i)
      .attr("transform", function() { return "translate(" + margin + "," + margin + ")"; } ); 
    }

  }
}


// --------------------------------------------PODPORNE FUNKCIJE----------------------------------------------------------------------
function getRandomColor() {
  console.log("[getRandomColor()]");
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
function Povezava(){
  console.log("[Povezava()]");
  var client = new $.es.Client({
      hosts: 'localhost:9200'
  });
  client.ping({
    requestTimeout: 30000,
  }, function (error) {
      if (error) {
  console.error(' !!! POGLEJ ALI ELASTIC RUN !!!');
      } else {
        console.log('->Povezava OK');
      }
  });
  return client;
}
// ----------------------------------------------ISPIS ISKANIH IMEN--------------------------------------------------------------------

function naZaslonIskanaImena(){
  console.log("[naZaslonImena()]");
  document.getElementById("iskanaImena").innerHTML = 'Iskana imena:'; // pobrise seznam skanih imen
  for (var i = 0; i < imena.length; i++) { // gre ces vsa imena v seznamu
    console.log("-> " + imena[i] + " - " + podatki[i])
    izpisiImeNaHTML(imena[i]); // jih izpise na seznam
  }
}
function izpisiImeNaHTML(text) { // funkcija doda text na seznam
  console.log("[izpisiImeNaHTML]");
    var node = document.createElement("p")
    var textnode = document.createTextNode(text);
    node.appendChild(textnode);
    document.getElementById("iskanaImena").appendChild(node);
}
$(document).ready(function() {
  $("#iskanaImena").on("click", "p",function(){
      $( this ).slideUp();
      console.log("Klik na ime: " + this.innerHTML);
      izbrisiIzSeznama(this.innerHTML);
    })
});
function izbrisiIzSeznama(ime){
  console.log("[izbrisiIzSeznama(ime)]");
  console.log("->Ali je iskano ime v sezanmu: " +  preveriSeznam(ime));
  console.log("->Brisem ime z seznama vseh imen");
  if(preveriSeznam(ime) != null){
    var index = preveriSeznam(ime)
    imena[index] = null;
    podatki[index] = null;
    console.log("->ime: " + ime + " je bilo izbrisano");  
  }
  else{
    console.log("->ime:" + ime + " ne obstaja v seznamu");
  }
  ustvariPlatno();
}
function preveriSeznam(iskanoIme){
  console.log("[preveriSeznam()]");
  for(i = 0; i < imena.length; i++){
    if(imena[i] == iskanoIme){
      return i;
    }
  }
  return false;
}
// ----------------------------------------------IZPIS PODOBNIH IMEN--------------------------------------------------------------------
// SORODNA IMENA
function SorodnaImena(ime){
  console.log("[SorodnaImena()]");
  iskanoIme = document.getElementById("inputBoxIme").value;
  podobnaImena = [];
  iskanoIme = "*" + iskanoIme + "*"
  client = Povezava();
  stzapisov = vrniSteviloZapisov(client,iskanoIme);
  console.log(iskanoIme);
  client.search(
    {
        index: 'baby',
        type: 'doc',
        body: {
          size: 10000,
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
  podobnaImena = [];
  seznamP = [];
  for(var i = 0; i < zacasno.length; i++){
    if(!preveri(zacasno[i])){
      podobnaImena.push(zacasno[i]);
    }

    // za izpis podbnih imen, se znebimo duplikatov
    notri = false;
    if (i == 0) {
      seznamP.push(zacasno[i]);
    }
    for (var j = 0; j < seznamP.length; j++) {
      if (seznamP[j] == zacasno[i]) {
        notri = true;
      }
      // ni ga se v seznamu, dodamo ime
      if (notri == false && j == seznamP.length - 1) {
        seznamP.push(zacasno[i]);
      }
    }
  }

  // dela sort najprej po dolzini besede, nato po abecedi
  // seznamP.sort();
  seznamP.sort(function (a, b) {
    return a.localeCompare(b);
  });
  awesomplete.list = seznamP;
  console.log("podobnaImenaP: ", seznamP);

  // izpisiPodobnaNaZaslov()
  }, // end then
    function (err) {
      console.trace(err.message);
    }
    ); // konc 
}

// IMAS PODOBNA IMENA
function isciPodobnaImena() {
  var ime = document.getElementById("inputBoxIme").value;
  // console.log(ime);
  SorodnaImena(ime);
  console.log("PODOBNA IMENA: ", seznamP);
}


function izpisiPodobnaNaZaslov(){
  console.log("[preveri()]");
  izpisiPodobnaImeNaHTML("Podobna imena:")
  document.getElementById("podobnaImena").innerHTML = 'Podobna imena'; // pobrise seznam skanih imen
  for (var i = 0; i < podobnaImena.length; i++) { // gre ces vsa imena v seznamu
    izpisiPodobnaImeNaHTML(podobnaImena[i]); // jih izpise na seznam

  }
}
function izpisiPodobnaImeNaHTML(text) { // funkcija doda text na seznam
    var node = document.createElement("p")
    var textnode = document.createTextNode(text);
    node.appendChild(textnode);
    document.getElementById("podobnaImena").appendChild(node);
}
function preveri(iskanoIme){
  console.log("[preveri()]");
  for(i = 1; i < podobnaImena.length; i++){
    if(podobnaImena[i] == iskanoIme){
      return i;
    }
  }
  return false;
}
function preveriAliImeZeObstaja(imena,iskanoIme){
  for(var i = 0; i< imena.length; i++){
    if(imena[i] == iskanoIme){
      return true;
    }
  }
  return false;
}
$(document).ready(function() {
  $("#podobnaImena").on("click", "p",function(){
      $( this ).slideUp();
      console.log("Klik na podobno ime: " + this.innerHTML);
      dodajNovoIme(this.innerHTML);
      naZaslonIskanaImena();
    })
});
// ----------------------------------------------OMEJITEV--------------------------------------------------------------------
function omejitev(steviloCrk,crke){
  //stevilo crk = int => kolk crk ma loh ime
  // crke = [] => kere crke so lahko notr
  
}


// REGEX IZPIS DIVOV

var stoplec=1;
var vrstica=1;

var dodatenID = 0;

function dodajVrstico(id) {
  console.log("id:" + id);
  console.log("DODANA VRSTICA");
	var idstarsa = document.getElementById(id).parentElement.id;
  var newNode = document.createElement('div');
  newNode.setAttribute("id", "" + id + "-vrstica" + vrstica);
  vrstica += 1;
  // newNode.innerHTML = "<input type='text' value='' class='buckinput' name='items[]' style='padding:2px;' />";
  newNode.innerHTML = vrstica + " &nbsp";
  // document.getElementById(id).appendChild(newNode);
  document.getElementById(id).insertBefore(newNode, plus);     
}

function dodajStoplec(id) {
  console.log("id:" + id);
  console.log("DODAN STOLPEC");
    var newNode = document.createElement('div');
    var newNodePlus = document.createElement('div');
    

    // TODO: ID STOLPCEV IN VRSTIC, KO NAREDIS NOV STOLPEC, DODAS SPODJNEMU PLUSU IN DESNEMU
    //       ID, DA VES, KAM DODAJATI VRSTICE VSAKEMU STOLPCU -> SLIKA
    // newNodePlus.setAttribute("id", dodatenID);

    newNodePlus.innerHTML = "+";

    // document.getElementById(dodatenID).onclick = dodajVrstico(dod);

    var plus = document.getElementById("plusDesno");
    console.log(plus);
    newNode.className = 'inline';
    newNode.setAttribute("id", "stolpec"+ stoplec);    
    newNode.innerHTML = stoplec + ".ZNAKOV &nbsp";

    document.getElementById("celota").insertBefore(newNode, plus);
    document.getElementById("stolpec"+ stoplec).appendChild(newNodePlus);
    
    stoplec +=1;
    dodatenID += 1;
    // document.getElementById(id).appendChild(newNode);

    // document.getElementById();     
}


// function dodajDiv() {
//   var div = document.createElement("div", {
//     "id": "id",
//     "class": "this that and so on",
//     "data-whatever": "whatever data",
//   });
// }


