/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunctionGenre() {
  document.getElementById("genres").classList.toggle("show");
}

function myFunctionLanguage() {
  document.getElementById("language").classList.toggle("show");
}

function myFunctionType() {
  document.getElementById("classes").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
    }
  }
}

window.onload = function(){
	putGenresInHTML();
};

function putGenresInHTML(){
	endpoint = "http://192.168.178.12:7200/repositories/ProjectOwl2-RL?query=";

	query = [
		"PREFIX pr: <http://www.semanticweb.org/ravib/ontologies/Project/>" ,
		"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" ,
		"SELECT DISTINCT ?genre" ,
		"WHERE {" ,
			"?s rdf:type pr:Film ." ,
			"?s pr:hasGenre ?genre ." ,
		"}" ,
		"ORDER BY ?genre"
	].join(" ");

	queryURL = endpoint + encodeURIComponent(query);

	$.getJSON(queryURL, function(data) {
		html = ""
		for (i in data.results.bindings){
			genre = data.results.bindings[i].genre.value
			genre = genre.slice(20);
			html += '<label class="container">' + genre;
			html += '<input type="checkbox" value="' + genre + '">';
			html += '<span class="checkmark"></span>';
			html += '</label>';
		}
		document.getElementById("genres").innerHTML = html;
	});
}

function runQuery() {
  //The endpoint for graphDB with ?query= added to the end
  GDBendpoint = "http://192.168.178.12:7200/repositories/ProjectOwl2-RL?query=";

  GDBquery = makeGDBQuery();

  GDBqueryURL = GDBendpoint + encodeURIComponent(GDBquery);

  $.getJSON(GDBqueryURL, function(data) {
    html = ""
    for (i in data.results.bindings){
      film = data.results.bindings[i];
      html += "You should watch " + film.title.value
      html += " from " + film.release.value + ". "
      html += "It has a " + film.rating.value + " on IMDB. <br>"
    }
    document.getElementById("Output").innerHTML = html;
  });
}

function makeGDBQuery(){
  query = [
    "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" ,
    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" ,
    "PREFIX id: <urn:default:baseUri:>" ,
    "PREFIX pr: <http://www.semanticweb.org/ravib/ontologies/Project/>" ,
    "SELECT DISTINCT ?title ?rating ?release",
    "WHERE {",
      "?id a pr:Film .",
      "?id pr:hasTitle ?title .",
      "?id pr:hasRating ?rating .",
      "?id pr:hasReleaseDate ?release ."
  ].join(" ");
  genres = getGenres();
  for(g in genres){
    query += "?id pr:hasGenre id:" + genres[g] + " .";
  }
  classes = getClasses();
  for(c in classes){
    if (classes[c] == "UnusualMix"){
      query += "?id a pr:UnusualMix .";
    }
    if (classes[c] == "Classic"){
      query += "FILTER(?release < 1950) . FILTER(?rating > 8) ."
    }
    if (classes[c] == "ChillingWithTheBoys"){
      query += "?id pr:hasRuntime ?runtime ."
      query += "FILTER(?runtime < 60) ."
      query += "{?id pr:hasGenre id:Comedy .} UNION {?id pr:hasGenre id:Action .}"
    }
    if (classes[c] == "SoBadItsGood"){
      query += "FILTER(?rating < 4) ."
    }
	if (classes[c] == "Recent"){
	  query += "FILTER(?release >=2010) ."
	}

  }

  query += "} ORDER BY DESC(?rating) LIMIT 10";
  return query;
}

function getGenres(){
  output = [];
  x = document.getElementById("genres");
  for(i = 0; i < x.length; i++){
    if(x.elements[i].checked){
      output.push(x.elements[i].value);
    }
  }
  return output;
}

function getClasses(){
  output = [];
  x = document.getElementById("classes");
  for(i = 0; i < x.length; i++){
    if(x.elements[i].checked){
      output.push(x.elements[i].value);
    }
  }
  return output;
}
